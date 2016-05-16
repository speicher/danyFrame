package com.danyShop.manager;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.danyShop.service.BaseCrudService;
import com.danyShop.service.MembersService;

@Service("membersManager")
public class MembersManagerImpl extends BaseCrudManagerImpl implements MembersManager {

	@Resource
	private  MembersService membersService;
	
	@Override
	protected BaseCrudService init() {
		return membersService;
	}

}
