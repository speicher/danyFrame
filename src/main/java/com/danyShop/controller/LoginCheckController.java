package com.danyShop.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.danyShop.common.annotation.InitpowerInterceptors;
import com.danyShop.common.exception.ManagerException;
import com.danyShop.common.model.UserDto;
import com.danyShop.controller.common.BaseCrudController;
import com.danyShop.manager.MembersManager;


@SuppressWarnings("restriction")
@Controller
@RequestMapping({"/login"})
public class LoginCheckController extends BaseCrudController<UserDto>{

	@Resource
	private MembersManager membersManager;
	
	@Override
	protected CrudInfo init() {
		return new CrudInfo(null, membersManager);
	}
	
	@RequestMapping(value = "/obj_get", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<UserDto> login(HttpServletRequest req, Model model) throws ManagerException{
		UserDto resultObj = null;
		
		Map<String, Object> params = builderParams(req, model);
		try {
			List<UserDto> usrList = membersManager.findByBiz(null, params);
			if (usrList.size() > 0) {
				resultObj = usrList.get(0);
			} 
		} catch (ManagerException e) {
			throw new ManagerException(e);
		}
		
		return new ResponseEntity<UserDto>(resultObj, HttpStatus.OK);
	}
	
//	@RequestMapping(value = "/error")
//	@ResponseBody
//	public ResponseEntity<Map<String, Object>> error(HttpServletRequest req, Model model) throws ManagerException{
//		Map<String, Object> params = builderParams(req, model);
//		params.put("error", "用户名或密码错误");
//		
//		return new ResponseEntity<Map<String, Object>>(params, HttpStatus.OK);
//	}
	
	@RequestMapping({ "/error" })
	public String errorPage(HttpServletRequest request) {
		request.setAttribute("errFlag", "error");
		return "forward:/danyShop/";
	}
	
	@RequestMapping({ "/welcome" })
	public String successPage() {
		return "welcome";
	}
}
