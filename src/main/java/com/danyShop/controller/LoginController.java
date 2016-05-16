package com.danyShop.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping({"/danyShop"})
public class LoginController {

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String login(HttpServletRequest request){
		String flag = request.getParameter("errFlag");
		if(StringUtils.isNotEmpty(flag)){
			request.setAttribute("error", "用户名或密码错误");
		}
		return "login";
	}
}
