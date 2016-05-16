package com.danyShop.data.security;

import java.util.List;
import java.util.Map;

import com.danyShop.common.exception.ManagerException;

public abstract interface AuthorizationProvider {
	
//	public abstract Map<String, AuthorityUserModuleDto> getUserModel() throws ManagerException;

	public abstract Map<String, Integer> getOptions();

	public abstract String getCurrentModule();

//	public abstract SystemUser getUser();

//	public abstract SystemUser getUser(Integer paramInteger);

//	public abstract void setUser(SystemUser paramSystemUser);

	public abstract int getSystemId();

	public abstract void setSystemId(int paramInt);

	public abstract int getAreasystemId();

	public abstract void setAreasystemId(int paramInt);

	public abstract void signout();

	public abstract void clear();

//	public abstract AuthorityUserModuleDto getUserPermission();

	public abstract List<String> getRoles();
}
