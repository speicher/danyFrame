package com.danyShop.dal.database;

import org.apache.ibatis.annotations.Param;
import com.danyShop.common.exception.DaoException;
import com.danyShop.common.model.UserDto;

/**
 * 会员信息表
 * @author Danica
 * @date  2016-03-01 
 * @version 0.0.1
 */
public interface MembersMapper extends BaseCrudMapper {
	
    public UserDto selectMemberName(@Param("memberId")String memberId) throws DaoException;
}