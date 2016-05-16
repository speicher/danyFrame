package com.danyShop.service;

import java.util.List;
import java.util.Map;

import com.danyShop.common.exception.ServiceException;
import com.danyShop.common.utils.SimplePage;

public abstract interface BaseCrudService {
	public abstract <ModelType> int deleteById(ModelType paramModelType)
			throws ServiceException;

	public abstract <ModelType> int add(ModelType paramModelType)
			throws ServiceException;

	public abstract <ModelType> ModelType findById(ModelType paramModelType)
			throws ServiceException;

	public abstract <ModelType> List<ModelType> findByBiz(
			ModelType paramModelType, Map<String, Object> paramMap)
			throws ServiceException;

	public abstract <ModelType> int modifyById(ModelType paramModelType)
			throws ServiceException;

	public abstract int findCount(Map<String, Object> paramMap)
			throws ServiceException;

	public abstract <ModelType> List<ModelType> findByPage(
			SimplePage paramSimplePage, String paramString1,
			String paramString2, Map<String, Object> paramMap)
			throws ServiceException;

}
