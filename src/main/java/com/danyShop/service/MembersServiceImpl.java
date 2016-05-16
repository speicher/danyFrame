package com.danyShop.service;
import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.danyShop.dal.database.BaseCrudMapper;
import com.danyShop.dal.database.MembersMapper;

@Service("membersService") 
public class MembersServiceImpl extends BaseCrudServiceImpl implements MembersService{
	@Resource
	private MembersMapper membersMapper;
	
	@Override
	public BaseCrudMapper init() {
		return membersMapper;
	}

}
