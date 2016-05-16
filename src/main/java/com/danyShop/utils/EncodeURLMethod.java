package com.danyShop.utils;

import freemarker.template.TemplateMethodModel;
import freemarker.template.TemplateModelException;
import java.util.List;

public class EncodeURLMethod
  implements TemplateMethodModel
{
  public Object exec(List args)
    throws TemplateModelException
  {
    boolean flag = false;

    if ((args != null) && (args.size() > 1)) {
      String s1 = (String)args.get(0);
      String s2 = (String)args.get(1);

      flag = true;
    }

    return Boolean.valueOf(flag);
  }
}