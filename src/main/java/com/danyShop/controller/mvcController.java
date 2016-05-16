package com.danyShop.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping({"/mvc"})
public class mvcController
{
  @RequestMapping({"/welcome"})
  public String hello()
  {
    return "welcome";
  }
}