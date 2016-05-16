package com.danyShop.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Map;
import java.util.Map.Entry;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.StringUtils;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping({"/initCache"})
public class InitCacheController implements ApplicationListener<ContextRefreshedEvent>
{
	  protected static final XLogger logger = XLoggerFactory.getXLogger(InitCacheController.class);

	  @Value("${db.schema}")
	  private String schema;

	  public void init()
	  {
	    logger.info(StringUtils.center("初始化开始", 10, "★"));

	    logger.info(StringUtils.center("初始化完成", 10, "★"));
	  }

	  private Map<String, Object> builderParams(HttpServletRequest req, Model model)
	  {
	    Map<String, Object> params = req.getParameterMap();
	    if ((params != null) && (params.size() > 0)) {
	      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	      for (Map.Entry p : params.entrySet()) {
	        if ((p.getValue() != null) && (!StringUtils.isEmpty(p.getValue().toString())))
	        {
	          String[] values = (String[])p.getValue();
	          String match = "^((((1[6-9]|[2-9]\\d)\\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\\d|3[01]))|(((1[6-9]|[2-9]\\d)\\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\\d|30))|(((1[6-9]|[2-9]\\d)\\d{2})-0?2-(0?[1-9]|1\\d|2[0-8]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-)) (20|21|22|23|[0-1]?\\d):[0-5]?\\d:[0-5]?\\d$";
	          if (values[0].matches(match))
	            try {
	              p.setValue(sdf.parse(values[0]));
	            } catch (ParseException e) {
	              e.printStackTrace();
	            }
	          else if ((((String)p.getKey()).equals("queryCondition")) && (model.asMap().containsKey("queryCondition")))
	            p.setValue(model.asMap().get("queryCondition"));
	          else
	            p.setValue(values[0]);
	        }
	      }
	    }
	    return params;
	  }

	  public String getSchema()
	  {
	    return this.schema;
	  }

	  public void setSchema(String schema) {
	    this.schema = schema;
	  }

	  public void onApplicationEvent(ContextRefreshedEvent event)
	  {
		  this.init();
	  }
	}