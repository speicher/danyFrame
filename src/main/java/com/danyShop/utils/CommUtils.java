package com.danyShop.utils;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CommUtils
{
  public static Map<String, Object> ConvertObjToMap(Object obj)
  {
    Map reMap = new HashMap();
    if (obj == null)
      return null;
    Field[] fields = obj.getClass().getDeclaredFields();
    try {
      for (int i = 0; i < fields.length; i++)
        try {
          Field f = obj.getClass().getDeclaredField(fields[i].getName());
          f.setAccessible(true);
          Object o = f.get(obj);
          reMap.put(fields[i].getName(), o);
        } catch (NoSuchFieldException e) {
          e.printStackTrace();
        } catch (IllegalArgumentException e) {
          e.printStackTrace();
        } catch (IllegalAccessException e) {
          e.printStackTrace();
        }
    }
    catch (SecurityException e) {
      e.printStackTrace();
    }
    return reMap;
  }

  public static <ModelType> Map<String, Object> resultHashMap(List<String> errorList, List<ModelType> dataList) {
    Map resultMap = new HashMap();
    resultMap.put("data", dataList);
    resultMap.put("error", errorList);
    return resultMap;
  }
}