package com.danyShop.dal.database;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import com.danyShop.common.utils.SimplePage;

public abstract interface BaseCrudMapper {
	 public abstract int deleteByPrimaryKey(int paramInt);

	  public abstract <ModelType> int insert(ModelType paramModelType);

	  public abstract <ModelType> int insertSelective(ModelType paramModelType);

	  public abstract <ModelType> ModelType selectByPrimaryKey(ModelType paramModelType);

	  public abstract <ModelType> List<ModelType> selectByParams(@Param("model") ModelType paramModelType, @Param("params") Map<String, Object> paramMap);

	  public abstract <ModelType> int updateByPrimaryKeySelective(ModelType paramModelType);

	  public abstract <ModelType> int updateByPrimaryKey(ModelType paramModelType);

	  public abstract int selectCount(@Param("params") Map<String, Object> paramMap);

	  public abstract <ModelType> List<ModelType> selectByPage(@Param("page") SimplePage paramSimplePage, @Param("orderByField") String paramString1, @Param("orderBy") String paramString2, @Param("params") Map<String, Object> paramMap);

	  public abstract <ModelType> int deleteByPrimarayKeyForModel(ModelType paramModelType);
}
