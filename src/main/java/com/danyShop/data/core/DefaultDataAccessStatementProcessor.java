package com.danyShop.data.core;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ResultMap;
import org.apache.ibatis.mapping.ResultMapping;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import com.danyShop.data.security.DataAccessEnum;
import com.danyShop.data.security.DataAccessProvider;
import com.danyShop.data.security.EmptyDataAccessProvider;

@Component("dataAccessStatementProcessor")
public class DefaultDataAccessStatementProcessor implements
		DataAccessStatementProcessor {
	private Pattern regex = Pattern.compile(
			"((--)?\\W+(AND|OR)?\\W?\\(?\\W?)?@(\\w+\\.)?(\\w+)(!\\w+)?", 2);

	private Pattern regexAutoWired = Pattern.compile(
			"--\\W?+@AutoWired+\\W?(\\w+)?", 2);
	private DataAccessProvider dataAccessProvider;
	private String[] fields = { DataAccessEnum.BRAND, DataAccessEnum.ORDERUNIT,
			DataAccessEnum.SHOP, DataAccessEnum.STORE, DataAccessEnum.SUPPLIER,
			DataAccessEnum.ORGAN };

	public String Process(MetaObject metaObject) {
		BoundSql boundSql = (BoundSql) metaObject.getValue("delegate.boundSql");
		String script = boundSql.getSql();
		if (StringUtils.indexOfIgnoreCase(script, "INSERT INTO") >= 0) {
			return null;
		}
		if (script.indexOf("@AutoWired") > 0) {
			return ProcessAutoWired(script, metaObject);
		}
		return scan(script);
	}

	public String scan(String script) {
		String rn = System.getProperty("line.separator");
		Scanner scanner = new Scanner(script);
		StringBuffer sb = new StringBuffer();
		boolean changed = false;
		while (scanner.hasNextLine()) {
			String line = scanner.nextLine();
			line = line.trim();
			if (line.length() != 0) {
				String tmp = replace(line);
				if (tmp == null) {
					sb.append(line);
				} else {
					sb.append(tmp);
					changed = true;
				}
				sb.append(rn);
			}
		}
		if (changed) {
			return sb.toString();
		}
		return null;
	}

	public String replace(String script) {
		Matcher m = this.regex.matcher(script);
		StringBuffer sb = new StringBuffer();
		boolean finded = m.find();
		if (!finded) {
			return null;
		}
		while (finded) {
			String op = m.group(1);
			String alias = m.group(4);
			String name = m.group(5);
			String field = m.group(6);
			if (field == null)
				field = name;
			else
				field = field.substring(1);
			if (alias == null)
				alias = "";
			if (op == null)
				op = "";
			else
				op = op.replaceFirst("--", "");
			String statement = getStatement(name);
			if (statement == null)
				statement = op + " 1=1 ";
			else
				statement = op + " " + alias + field + " in (" + statement
						+ ")";
			m.appendReplacement(sb, statement);
			finded = m.find();
		}
		m.appendTail(sb);
		String result = sb.toString() + System.getProperty("line.separator");
		return result;
	}

	private String ProcessAutoWired(String script, MetaObject metaObject) {
		MappedStatement mapper = (MappedStatement) metaObject.getValue("delegate.mappedStatement");
		Matcher m = this.regexAutoWired.matcher(script);
		if (!m.find())
			return null;
		String alias = m.group(1);
		if (alias == null)
			alias = "";
		else {
			alias = alias + ".";
		}
		List<ResultMapping> columns = ((ResultMap) mapper.getResultMaps().get(0)).getResultMappings();
		List where = new ArrayList();
		for (ResultMapping item : columns) {
			String column = item.getColumn();
			String name = getField(column);
			if (name != null) {
				String statement = getStatement(name);
				if (statement != null)
					where.add(alias + column + " in (" + statement + ")");
			}
		}
		if (where.size() == 0)
			return null;
		String express = " (" + StringUtils.join(where, " AND ") + ") ";

		int index = StringUtils.lastIndexOfIgnoreCase(script, "where");
		if (index <= 0) {
			return " Where " + express;
		}
		index += 5;
		String p1 = script.substring(0, index);
		String p2 = script.substring(index);
		return p1 + express + " AND" + p2
				+ System.getProperty("line.separator");
	}

	private String getField(String col) {
		for (String item : this.fields) {
			if ((col.startsWith(item)) || (col.endsWith(item)))
				return item;
		}
		return null;
	}

	private DataAccessProvider getProvider() {
		if (this.dataAccessProvider == null) {
			if (SpringContext.containsBean("dataAccessProvider"))
				this.dataAccessProvider = ((DataAccessProvider) SpringContext.getBean("dataAccessProvider"));
			else
				this.dataAccessProvider = new EmptyDataAccessProvider();
		}
		return this.dataAccessProvider;
	}

	private String getStatement(String name) {
		String script = getProvider().getAccessDataString(name);
		return script;
	}
}
