package com.danyShop.data.core;

import org.apache.ibatis.reflection.MetaObject;

public abstract interface DataAccessStatementProcessor {
	public abstract String Process(MetaObject paramMetaObject);
}
