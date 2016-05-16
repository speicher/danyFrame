package com.danyShop.service;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.xml.validation.Validator;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.danyShop.common.enums.CommonOperatorEnum;
import com.danyShop.common.exception.ServiceException;
import com.danyShop.common.utils.SimplePage;
import com.danyShop.dal.database.BaseCrudMapper;

public abstract class BaseCrudServiceImpl implements BaseCrudService {
	@Autowired(required = false)
	private Validator validator;

	@Value("${base.boot.is_need_validate}")
	private String valid = "false";
	private BaseCrudMapper mapper;

	@PostConstruct
	private void initConfig() {
		this.mapper = init();
		// if ((null != this.valid) && (new Boolean(this.valid).booleanValue())
		// && (null == this.validator))
		// throw new RuntimeException("系统开启实体类验证,验证器为空异常");
	}

	public abstract BaseCrudMapper init();

	// public <ModelType> void validate(ModelType t) throws ServiceException
	// {
	// if ((null == this.valid) || (!new Boolean(this.valid).booleanValue())) {
	// return;
	// }
	// Set constraintViolations = this.validator.validate(t, new Class[0]);
	// if (constraintViolations.size() > 0) {
	// StringBuilder validateError = new StringBuilder();
	// for (ConstraintViolation constraintViolation : constraintViolations) {
	// validateError.append("属性：").append(constraintViolation.getPropertyPath()).append("报错！").append(constraintViolation.getMessage()).append(";");
	// }
	//
	// throw new ServiceException(validateError.toString());
	// }
	// }

	public <ModelType> int deleteById(ModelType modelType)
			throws ServiceException {
		try {
			return this.mapper.deleteByPrimarayKeyForModel(modelType);
		} catch (Exception e) {
			throw new ServiceException(new StringBuilder()
					.append("Problem invoking method, Cause:")
					.append(e.getMessage()).toString(), e);
		}
	}

	public <ModelType> int add(ModelType modelType) throws ServiceException {
		try {
			// validate(modelType);
			return this.mapper.insertSelective(modelType);
		} catch (Exception e) {
			throw new ServiceException(new StringBuilder()
					.append("Problem invoking method, Cause:")
					.append(e.getMessage()).toString(), e);
		}
	}

	public <ModelType> ModelType findById(ModelType modelType)
			throws ServiceException {
		try {
			return this.mapper.selectByPrimaryKey(modelType);
		} catch (Exception e) {
			throw new ServiceException(new StringBuilder()
					.append("Problem invoking method, Cause:")
					.append(e.getMessage()).toString(), e);
		}
	}

	public <ModelType> List<ModelType> findByBiz(ModelType modelType,
			Map<String, Object> params) throws ServiceException {
		try {
			return this.mapper.selectByParams(modelType, params);
		} catch (Exception e) {
			throw new ServiceException(new StringBuilder()
					.append("Problem invoking method, Cause:")
					.append(e.getMessage()).toString(), e);
		}
	}

	public <ModelType> int modifyById(ModelType modelType)
			throws ServiceException {
		try {
			return this.mapper.updateByPrimaryKeySelective(modelType);
		} catch (Exception e) {
			throw new ServiceException(new StringBuilder()
					.append("Problem invoking method, Cause:")
					.append(e.getMessage()).toString(), e);
		}
	}

	public int findCount(Map<String, Object> params) throws ServiceException {
		try {
			return this.mapper.selectCount(params);
		} catch (Exception e) {
			throw new ServiceException("", e);
		}
	}

	public <ModelType> List<ModelType> findByPage(SimplePage page,
			String orderByField, String orderBy, Map<String, Object> params)
			throws ServiceException {
		return this.mapper.selectByPage(page, orderByField, orderBy, params);
	}

}
