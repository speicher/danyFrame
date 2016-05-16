package com.danyShop.controller.common;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.danyShop.common.annotation.InitpowerInterceptors;
//import com.danyShop.common.enums.CommonOperatorEnum;
import com.danyShop.common.exception.ManagerException;
import com.danyShop.common.utils.BeanUtilsCommon;
import com.danyShop.common.utils.CustomDateEditorBase;
import com.danyShop.common.utils.SimplePage;
import com.danyShop.manager.BaseCrudManager;

public abstract class BaseCrudController<ModelType> {
	private BaseCrudManager manager;
	private BaseCrudController<ModelType>.CrudInfo crudInfo;

	@SuppressWarnings("restriction")
	@PostConstruct
	protected void initConfig() {
		this.crudInfo = init();
		this.manager = this.crudInfo.getManager();
	}

	protected abstract BaseCrudController<ModelType>.CrudInfo init();

	@InitBinder
	public void initBinder(WebDataBinder binder) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		dateFormat.setLenient(false);
		binder.registerCustomEditor(Date.class, new CustomDateEditorBase(dateFormat, false));
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping({ "/list.json" })
	@ResponseBody
	public Map<String, Object> queryList(HttpServletRequest req, Model model)
			throws ManagerException {
		int pageNo = StringUtils.isEmpty(req.getParameter("page")) ? 1
				: Integer.parseInt(req.getParameter("page"));
		int pageSize = StringUtils.isEmpty(req.getParameter("rows")) ? 10
				: Integer.parseInt(req.getParameter("rows"));
		String sortColumn = StringUtils.isEmpty(req.getParameter("sort")) ? ""
				: String.valueOf(req.getParameter("sort"));

		String sortOrder = StringUtils.isEmpty(req.getParameter("order")) ? ""
				: String.valueOf(req.getParameter("order"));

		Map params = builderParams(req, model);
		int total = this.manager.findCount(params);
		SimplePage page = new SimplePage(pageNo, pageSize, total);
		List list = this.manager
				.findByPage(page, sortColumn, sortOrder, params);
		Map obj = new HashMap();
		obj.put("total", Integer.valueOf(total));
		obj.put("rows", list);
		return obj;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
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

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping({ "/get_count.json" })
	public ResponseEntity<Integer> getCount(HttpServletRequest req, Model model)
			throws ManagerException {
		Map params = builderParams(req, model);
		int total = this.manager.findCount(params);
		return new ResponseEntity(Integer.valueOf(total), HttpStatus.OK);
	}

	@RequestMapping({ "/list" })
	@InitpowerInterceptors
	public String list() {
		return this.crudInfo.ftlFolder + "list";
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping({ "/get" })
	public ResponseEntity<ModelType> get(ModelType modelType)
			throws ManagerException {
		Object type = this.manager.findById(modelType);
		return new ResponseEntity(type, HttpStatus.OK);
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping({ "/get_biz" })
	@ResponseBody
	public List<ModelType> getBiz(ModelType modelType, HttpServletRequest req,
			Model model) throws ManagerException {
		Map params = builderParams(req, model);
		return this.manager.findByBiz(modelType, params);
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping({ "/post" })
	public ResponseEntity<ModelType> add(ModelType type)
			throws ManagerException {
		this.manager.add(type);
		return new ResponseEntity(type, HttpStatus.OK);
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping({ "/put" })
	public ResponseEntity<ModelType> moditfy(ModelType type)
			throws ManagerException {
		this.manager.modifyById(type);
		return new ResponseEntity(type, HttpStatus.OK);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping({ "/delete" })
	public ResponseEntity<Map<String, Boolean>> remove(ModelType type)
			throws ManagerException {
		this.manager.deleteById(type);
		Map flag = new HashMap();
		flag.put("success", Boolean.valueOf(true));
		return new ResponseEntity(flag, HttpStatus.OK);
	}

//	@RequestMapping({ "/save" })
//	public ResponseEntity<Map<String, Boolean>> save(HttpServletRequest req)
//			throws JsonParseException, JsonMappingException, IOException,
//			ManagerException {
//		Map flag = new HashMap();
//
//		String deletedList = StringUtils.isEmpty(req.getParameter("deleted")) ? ""
//				: req.getParameter("deleted");
//		String upadtedList = StringUtils.isEmpty(req.getParameter("updated")) ? ""
//				: req.getParameter("updated");
//		String insertedList = StringUtils.isEmpty(req.getParameter("inserted")) ? ""
//				: req.getParameter("inserted");
//		ObjectMapper mapper = new ObjectMapper();
//		Map params = new HashMap();
//		if (StringUtils.isNotEmpty(deletedList)) {
//			List list = (List) mapper.readValue(deletedList, new TypeReference() {});
//			List oList = convertListWithTypeReference(mapper, list);
//			params.put(CommonOperatorEnum.DELETED, oList);
//		}
//		if (StringUtils.isNotEmpty(upadtedList)) {
//			List list = (List) mapper.readValue(upadtedList, new TypeReference() {});
//			List oList = convertListWithTypeReference(mapper, list);
//			params.put(CommonOperatorEnum.UPDATED, oList);
//		}
//		if (StringUtils.isNotEmpty(insertedList)) {
//			List list = (List) mapper.readValue(insertedList, new TypeReference() {});
//			List oList = convertListWithTypeReference(mapper, list);
//			params.put(CommonOperatorEnum.INSERTED, oList);
//		}
//		if (params.size() > 0) {
//			this.manager.save(params);
//		}
//		flag.put("success", Boolean.valueOf(true));
//		return new ResponseEntity(flag, HttpStatus.OK);
//	}

	@SuppressWarnings({ "rawtypes", "unchecked", "unused" })
	private List<ModelType> convertListWithTypeReference(ObjectMapper mapper,
			List<Map> list) throws JsonParseException, JsonMappingException,
			JsonGenerationException, IOException {
		Class entityClass = (Class) ((java.lang.reflect.ParameterizedType) getClass()
				.getGenericSuperclass()).getActualTypeArguments()[0];

		List tl = new ArrayList(list.size());
		for (int i = 0; i < list.size(); i++) {
			Object type = mapper.readValue(mapper.writeValueAsString(list.get(i)), entityClass);
			tl.add(type);
		}
		return tl;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping({ "/do_export" })
	public void doExport(ModelType modelType, HttpServletRequest req,
			Model model, HttpServletResponse response) throws ManagerException {
		
		String sortColumn = StringUtils.isEmpty(req.getParameter("sort")) ? "" : String.valueOf(req.getParameter("sort"));
		String sortOrder = StringUtils.isEmpty(req.getParameter("order")) ? "" : String.valueOf(req.getParameter("order"));

		Map<String, Object> params = builderParams(req, model);
		String exportColumns = (String) params.get("exportColumns");
		String fileName = (String) params.get("fileName");

		String rowAccessWindowSizeStr = (String) params.get("rowAccessWindowSize");
		ObjectMapper mapper = new ObjectMapper();
		if (StringUtils.isNotEmpty(exportColumns))
			try {
				exportColumns = exportColumns.replace("[", "");
				exportColumns = exportColumns.replace("]", "");
				exportColumns = "[" + exportColumns + "]";

				List ColumnsList = (List) mapper.readValue(exportColumns, new TypeReference() {});
				int total = this.manager.findCount(params);
				SimplePage page = new SimplePage(1, total, total);
				List list = this.manager.findByPage(page, sortColumn,
						sortOrder, params);
				List listArrayList = new ArrayList();
				if ((list != null) && (list.size() > 0)) {
					for (Iterator i$ = list.iterator(); i$.hasNext();) {
						Object vo = i$.next();
						Map map = new HashMap();
						BeanUtilsCommon.object2MapWithoutNull(vo, map);
						listArrayList.add(map);
					}

					Integer rowAccessWindowSize = getRowAccessWindowSizeValue(rowAccessWindowSizeStr);
					HSSFExport.commonExportData(StringUtils.isNotEmpty(fileName) ? fileName : "导出信息",
							ColumnsList, listArrayList, response,
							rowAccessWindowSize);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
	}

	private Integer getRowAccessWindowSizeValue(String rowAccessWindowSizeStr) {
		Integer rowAccessWindowSize = Integer.valueOf(1);

		if (!StringUtils.isEmpty(rowAccessWindowSizeStr)) {
			try {
				rowAccessWindowSize = Integer.valueOf(Integer
						.parseInt(rowAccessWindowSizeStr));
			} catch (NumberFormatException e) {
				rowAccessWindowSize = Integer.valueOf(1);
			}
		}

		return rowAccessWindowSize;
	}

	public class CrudInfo {
		private String ftlFolder;
		private BaseCrudManager manager;

		public CrudInfo(String ftlFolder, BaseCrudManager manager) {
			this.ftlFolder = ftlFolder;
			this.manager = manager;
		}

		public String getFtlFolder() {
			return this.ftlFolder;
		}

		public void setFtlFolder(String ftlFolder) {
			this.ftlFolder = ftlFolder;
		}

		public BaseCrudManager getManager() {
			return this.manager;
		}

		public void setManager(BaseCrudManager manager) {
			this.manager = manager;
		}
	}
}