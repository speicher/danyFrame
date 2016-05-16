package com.danyShop.manager;

import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import com.danyShop.common.exception.ManagerException;
import com.danyShop.common.exception.ServiceException;
import com.danyShop.common.utils.SimplePage;
import com.danyShop.service.BaseCrudService;

public abstract class BaseCrudManagerImpl implements BaseCrudManager {
	private BaseCrudService service;

	@PostConstruct
	protected void initConfig() {
		this.service = init();
	}

	protected abstract BaseCrudService init();

	public <ModelType> int deleteById(ModelType modelType)
			throws ManagerException {
		try {
			return this.service.deleteById(modelType);
		} catch (ServiceException e) {
			throw new ManagerException(e.getMessage(), e);
		}
	}

	public <ModelType> int add(ModelType modelType) throws ManagerException {
		try {
			return this.service.add(modelType);
		} catch (ServiceException e) {
			throw new ManagerException(e.getMessage(), e);
		}
	}

	public <ModelType> ModelType findById(ModelType modelType)
			throws ManagerException {
		try {
			return this.service.findById(modelType);
		} catch (ServiceException e) {
			throw new ManagerException(e.getMessage(), e);
		}
	}

	public <ModelType> int modifyById(ModelType modelType)
			throws ManagerException {
		try {
			return this.service.modifyById(modelType);
		} catch (ServiceException e) {
			throw new ManagerException(e.getMessage(), e);
		}
	}

	public int findCount(Map<String, Object> params) throws ManagerException {
		try {
			return this.service.findCount(params);
		} catch (ServiceException e) {
			throw new ManagerException(e.getMessage(), e);
		}
	}

	public <ModelType> List<ModelType> findByBiz(ModelType modelType,
			Map<String, Object> params) throws ManagerException {
		try {
			return this.service.findByBiz(modelType, params);
		} catch (ServiceException e) {
			throw new ManagerException(e.getMessage(), e);
		}
	}

	public <ModelType> List<ModelType> findByPage(SimplePage page,
			String orderByField, String orderBy, Map<String, Object> params)
			throws ManagerException {
		try {
			return this.service.findByPage(page, orderByField, orderBy, params);
		} catch (ServiceException e) {
			throw new ManagerException(e.getMessage(), e);
		}
	}

}
