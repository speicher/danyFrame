package com.danyShop.controller.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.springframework.ui.Model;

public class WebCommonUtil {

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map<String, Object> builderParams(HttpServletRequest req, Model model) {
		Map retParams = new HashMap(req.getParameterMap().size());
		Map<String, Object> params = req.getParameterMap();
		SimpleDateFormat sdf;
		if ((null != params) && (params.size() > 0)) {
			sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			for (Map.Entry p : params.entrySet()) {
				if ((null != p.getValue())
						&& (!StringUtils.isEmpty(((String[]) p.getValue())
								.toString()))) {
					String[] values = (String[]) p.getValue();
					String match = "^((((1[6-9]|[2-9]\\d)\\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\\d|3[01]))|(((1[6-9]|[2-9]\\d)\\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\\d|30))|(((1[6-9]|[2-9]\\d)\\d{2})-0?2-(0?[1-9]|1\\d|2[0-8]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-)) (20|21|22|23|[0-1]?\\d):[0-5]?\\d:[0-5]?\\d$";
					if (values[0].matches(match))
						try {
							retParams.put(p.getKey(), sdf.parse(values[0]));
						} catch (ParseException e) {
							retParams.put(p.getKey(), values);
							e.printStackTrace();
						}
					else if ((((String) p.getKey()).equals("queryCondition"))
							&& (model.asMap().containsKey("queryCondition")))
						retParams.put(p.getKey(),
								model.asMap().get("queryCondition"));
					else
						retParams.put(p.getKey(), values[0]);
				}
			}
		}
		return retParams;
	}
}
