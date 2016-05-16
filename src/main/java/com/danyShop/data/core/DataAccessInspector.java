package com.danyShop.data.core;

import java.util.Properties;

import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.factory.DefaultObjectFactory;
import org.apache.ibatis.reflection.factory.ObjectFactory;
import org.apache.ibatis.reflection.wrapper.DefaultObjectWrapperFactory;
import org.apache.ibatis.reflection.wrapper.ObjectWrapperFactory;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

public class DataAccessInspector implements Interceptor {

	private static final ObjectFactory DEFAULT_OBJECT_FACTORY = new DefaultObjectFactory();
	private static final ObjectWrapperFactory DEFAULT_OBJECT_WRAPPER_FACTORY = new DefaultObjectWrapperFactory();

	protected static final XLogger logger = XLoggerFactory.getXLogger(""); // .getXLogger(Authorization.class);
	DataAccessStatementProcessor statementProcessor;

	public DataAccessStatementProcessor getProcessor() {
		String name = "dataAccessStatementProcessor";
		if (this.statementProcessor != null) {
			return this.statementProcessor;
		}
		if (SpringContext.containsBean(name))
			this.statementProcessor = ((DataAccessStatementProcessor) SpringContext.getBean(name));
		else
			this.statementProcessor = new DefaultDataAccessStatementProcessor();
		return this.statementProcessor;
	}

	private MetaObject getMappedStatement(Invocation invocation) {
		StatementHandler statementHandler = (StatementHandler) invocation.getTarget();

		MetaObject metaStatementHandler = MetaObject.forObject(
				statementHandler, DEFAULT_OBJECT_FACTORY,
				DEFAULT_OBJECT_WRAPPER_FACTORY);

		while ((metaStatementHandler.hasGetter("h"))
				|| (metaStatementHandler.hasGetter("target"))) {
			Object object = null;
			if (metaStatementHandler.hasGetter("h"))
				object = metaStatementHandler.getValue("h");
			if (metaStatementHandler.hasGetter("target"))
				object = metaStatementHandler.getValue("target");
			if (object != null) {
				metaStatementHandler = MetaObject.forObject(object,
						DEFAULT_OBJECT_FACTORY, DEFAULT_OBJECT_WRAPPER_FACTORY);
			}
		}
		return metaStatementHandler;
	}

	public Object intercept(Invocation invocation) throws Throwable {
		long startTime = System.currentTimeMillis();
		MetaObject metaObject = getMappedStatement(invocation);

		String statement = getProcessor().Process(metaObject);

		if (statement == null) {
			return invocation.proceed();
		}
		metaObject.setValue("delegate.boundSql.sql", statement);
		long time = System.currentTimeMillis() - startTime;
		if (logger.isDebugEnabled()) {
			logger.debug("注入数据权限:" + statement + " (" + time + "ms)");
		}
		return invocation.proceed();
	}

	public Object plugin(Object target) {
		if ((target instanceof StatementHandler)) {
			return Plugin.wrap(target, this);
		}
		return target;
	}

	public void setProperties(Properties properties) {
	}

}
