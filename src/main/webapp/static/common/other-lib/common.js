var commonValidRule =  {};

/**
 * 验证是否是中文
 */
commonValidRule.isChineseChar = function(str){
	var reg = /^[\u4e00-\u9fa5]+$/gi;
	if(reg.test(str)){
		return true;
	}
	return false;
};

/**
 * 不能包含中文验证
 */
commonValidRule.vnChinese = {
		vnChinese: {    
	        validator: function(value, param){
	        	for(var i=0;i<value.length;i++){
	        		if(commonValidRule.isChineseChar(value[i])){
	        			return false;
	        		}
	        	}
	            return true;    
	        },    
	        message: '{0}'   
	    }  
};

voidChar = ['<','>','input'];
function isValidString(szStr){
	if(szStr!=null&&szStr!=''){
		   for(var i=0;i<voidChar.length;i++){
			   if(szStr.indexOf(voidChar[i]) > -1){
				      return false;
			  }
		   }
		   
	}
  return true;
}

commonValidRule.isValidText = {
		isValidText: {    
	        validator: function(value, param){
	        	
	            return isValidString(value);    
	        },    
	        message: '包含非法字符(<,>,input)'   
	    }  
};

/**
 * 长度验证
 */
commonValidRule.vLength = {
		vLength: {
	        validator: function(value, param){
	        	var chineseCharLength = param[3] || 3;
	        	var tempLength = 0;
	        	
	        	for(var i=0;i<value.length;i++){
	        		if(commonValidRule.isChineseChar(value[i])){
	        			tempLength += chineseCharLength;
	        		}else{
	        			tempLength += 1;
	        		}
	        	}
	        	if(tempLength<param[0] || tempLength>param[1]){
	        		return false;
	        	}
	            return true;    
	        },    
	        message: '{2}'   
	    }  
};

//验证电话号码
commonValidRule.validateInputTel = {
	validateInputTel: {
		validator: function(value, param){
			var v_regex = /^([0-9]|[-])+$/g;
			return v_regex.exec(value);
		},
		message: '无效的电话号码,请重新输入！'
	}
};

//验证身份证号码
commonValidRule.validateIdNumber = {
	validateIdNumber: {
		validator: function(value, param){
			// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
			var v_regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			return v_regex.exec(value);
		},
		message: '无效的身份证号码,请重新输入！'
	}
};

$(document).ready(function(){
	$.extend($.fn.validatebox.defaults.rules,commonValidRule.vnChinese); 
	$.extend($.fn.validatebox.defaults.rules,commonValidRule.vLength);
	$.extend($.fn.validatebox.defaults.rules,commonValidRule.validateInputTel);
	$.extend($.fn.validatebox.defaults.rules,commonValidRule.isValidText);
	$.extend($.fn.validatebox.defaults.rules,commonValidRule.validateIdNumber);
});

parseParam=function(param){
    var paramStr="";
   {
        $.each(param,function(i){
        	paramStr+='&'+i+'='+param[i];
        });
    }
return paramStr.substr(1);
}; 

/**
 * 基础资料的导出
 * @param dataGridId  导出数据的表格ID
 * @param exportUrl 导出数据的URL   基础资料一般都是 /模块名/do_export.htm     *如机构:/store/do_export 
 * @param excelTitle excel文件名
 * @param checkFlag 导出数据的表格是否有复选框(有复选框后台自动去掉该列)  0--无  1--有
 * @param reduceColnumName 不用导出的列名
 * @param isTotal 如果传递true，则导出所有，否则导出当页
 * @param maxExportCount  最大导出数量 默认50000
 */
function exportExcelBaseInfo(dataGridId,exportUrl,excelTitle,checkFlag,reduceColnumName,isTotal,maxExportCount){
	var $dg = $("#"+dataGridId+"");
	var exportCount=maxExportCount||50000;
	if($dg.datagrid("getData").total>exportCount){
		showWarn("单次导出数量不能超过"+exportCount+",请缩小查询范围");
		return;
	}
	var params=$dg.datagrid('options').queryParams;
	var columns=$dg.datagrid('options').columns;
	var v_pageNumber = $dg.datagrid('options').pageNumber;//当前页号
	var v_pageSize = $dg.datagrid('options').pageSize;//每页多少行记录
	
	var columnsNew = [];
	$.each(columns,function(index,item){
		var dataArray = [];
		$.each(item,function(rowIndex,rowData){
			var v_object = {};
			v_object.field = rowData.field;
			v_object.title = rowData.title;
			dataArray[rowIndex] = v_object;
		});
		columnsNew[index] = dataArray;
	});
	
	var exportColumns=JSON.stringify(columnsNew);
	
	var url=BasePath+exportUrl;
	
	var dataRow=$dg.datagrid('getRows');

	$("#exportExcelForm").remove();
	
	$("<form id='exportExcelForm'  method='post'></form>").appendTo("body"); ;
	
	var fromObj=$('#exportExcelForm');
	
	if(dataRow.length>0){
	    fromObj.form('submit', {
			url: url,
			onSubmit: function(param){
				
				param.exportColumns=exportColumns;
				param.fileName=excelTitle;
				param.checkFlag=checkFlag;
				param.reduceColnumName=reduceColnumName;
				param.quartzcenter4Export=currentQuartzcenterNo;
				
				if(isTotal){
					var options = $dg.datagrid('getPager').data("pagination").options;
				    var total = options.total;
				    param.pageNumber = 1;
					param.pageSize = total;
				}else{
					param.pageNumber = v_pageNumber;
					param.pageSize = v_pageSize;
				}
				
				if(params!=null&&params!={}){
					$.each(params,function(i){
						param[i]=params[i];
					});
				}
				
			},
			success: function(){
				
		    }
	   });
	}else{
		alert('查询记录为空，不能导出!',1);
	}
}
//导出 （自定义列）
function exportCustomColumns(dataGridId, exportUrl, excelTitle, columnJsonStr, isLimit, isTotal){
	var $dg = $("#"+dataGridId+"");
	if(isLimit){
		
	} else{
		if($dg.datagrid("getData").total > 50000){
			showWarn("单次导出数量不能超过50000,请缩小查询范围");
			return;
		}
	}
	
	
	var dataRow = $dg.datagrid('getRows');
	var url = BasePath + exportUrl;
	var params = $dg.datagrid('options').queryParams;
	var columns = $dg.datagrid('options').columns;
	var v_pageNumber = $dg.datagrid('options').pageNumber;//当前页号
	var v_pageSize = $dg.datagrid('options').pageSize;//每页多少行记录
	
	$("#exportExcelForm").remove();	
	$("<form id='exportExcelForm'  method='post'></form>").appendTo("body");	
	var fromObj = $('#exportExcelForm');
	
	if(dataRow.length > 0){
	    fromObj.form('submit', {
			url: url,
			onSubmit: function(param){				
				param.exportColumns = columnJsonStr;
				param.fileName = excelTitle;
				param.checkFlag = '0';
				param.reduceColnumName = '';
				
				if(isTotal){
					var options = $dg.datagrid('getPager').data("pagination").options;
				    var total = options.total;
				    param.pageNumber = 1;
					param.pageSize = total;
				} else{
					param.pageNumber = v_pageNumber;
					param.pageSize = v_pageSize;
				}
				
				if(params!=null && params!={}){
					$.each(params, function(i){
						param[i] = params[i];
					});
				}				
			},
			success: function(){}
	   });
	} else{
		alert('查询记录为空，不能导出!', 1);
	}
}

/**
 * 订单功能的导出
 * @param dataGridId  表格ID
 * @param sysNo  品牌库的ID
 * @param preColNames  前面显示业务列 公用查询动态生成的参数
 * @param endColNames  后面显示的业务列
 * @param sizeTypeFiledName 
 * @param excelTitle excel文件名
 */
function exportExcelBill(dataGridId,sysNo,preColNames,endColNames,sizeTypeFiledName,excelTitle){
	
	var url=BasePath+'/initCache/do_export.htm';
	
	var $dg = $("#"+dataGridId+"");
	
	$("#exportExcelForm").remove();
	
	$("<form id='exportExcelForm'  method='post'></form>").appendTo("body"); ;
	
	var fromObj=$('#exportExcelForm');
	
	var dataRow=$dg.datagrid('getRows');
	
	if(dataRow.length>0){
	    fromObj.form('submit', {
			url: url,
			onSubmit: function(param){
				
				param.sysNo=sysNo;
				param.preColNames=JSON.stringify(preColNames);
				param.endColNames=JSON.stringify(endColNames);
				param.sizeTypeFiledName=sizeTypeFiledName;
				param.fileName=excelTitle;
				param.dataRow=JSON.stringify(dataRow);
			},
			success: function(){
				
		    }
	   });
	}else{
		alert('数据为空，不能导出!',1);
	}
	
	
}
/**
 * 下单下单公用方法
 * @param dataGridId
 * @param rowIndex
 * @param type  1--上单 2--下单
 * @param callBack  回调函数名
 */
function preBill(dataGridId,rowIndex,type,callBack){
	var $dg = $("#"+dataGridId+"");
	var curRowIndex=rowIndex;
	
	var options = $dg.datagrid('getPager').data("pagination").options;
	var currPage= options.pageNumber;
	var total = options.total;
	var max = Math.ceil(total/options.pageSize);
	var lastIndex=Math.ceil(total%options.pageSize);
	var pageSize=options.pageSize;
	var rowData=[];
	if(type==1){
		if(curRowIndex!=0){
			curRowIndex=curRowIndex-1;
			$dg.datagrid('unselectAll');
			$dg.datagrid('selectRow', curRowIndex);
			var rows = $dg.datagrid('getRows');
			if(rows){
				rowData=rows[curRowIndex];
			}
			
			callBack(curRowIndex,rowData);
		}else{ //跳转到上一页的最后一行
			if(currPage<=1){
				$dg.datagrid('unselectAll');
		    	$dg.datagrid('selectRow', curRowIndex);
				callBack(curRowIndex,null);
			}else{
				$dg.datagrid('getPager').pagination({pageSize:options.pageSize,pageNumber:(currPage-1)});
				$dg.datagrid('getPager').pagination('select', currPage-1);  
				
				curRowIndex=pageSize-1;
				$dg.datagrid({
				        onLoadSuccess:function(data){
							    if(type==1){
							    	$dg.datagrid('unselectAll');
							    	$dg.datagrid('selectRow', curRowIndex);
									var rows = $dg.datagrid('getRows');
									if(rows){
										rowData=rows[curRowIndex];
									}
									callBack(curRowIndex,rowData);
							    }
								
							
				       }
			     });
			
			}
		}
	}else if(type==2){
		
		if(curRowIndex!=(pageSize-1)){
			if(currPage==max&&lastIndex!=0&&curRowIndex==(lastIndex-1)){
				$dg.datagrid('unselectAll');
		    	$dg.datagrid('selectRow', curRowIndex);
				callBack(curRowIndex,null);
			}else{
				curRowIndex=curRowIndex+1;
				$dg.datagrid('unselectAll');
				$dg.datagrid('selectRow', curRowIndex);
				var rows = $dg.datagrid('getRows');
				if(rows){
					rowData=rows[curRowIndex];
				}
				
				callBack(curRowIndex,rowData);
			}
			
			
		}else{
			
			if(currPage>=max){
				$dg.datagrid('unselectAll');
		    	$dg.datagrid('selectRow', curRowIndex);
				callBack(curRowIndex,null);
			}else{
				$dg.datagrid('getPager').pagination({pageSize:options.pageSize,pageNumber:(currPage+1)});
				$dg.datagrid('getPager').pagination('select', currPage+1);  
				
				curRowIndex=0;
				$dg.datagrid({
			        onLoadSuccess:function(data){
						    if(type==2){
						    	
						    	$dg.datagrid('unselectAll');
						    	$dg.datagrid('selectRow', curRowIndex);
								var rows = $dg.datagrid('getRows');
								if(rows){
									rowData=rows[curRowIndex];
								}
								callBack(curRowIndex,rowData);
						    }
							
						
			       }
		     });
			}
		}
		
	}
	
	
}
//它将jquery系列化后的值转为name:value的形式。
function convertArray(o) { 
	var v = {};
	for ( var i in o) {
		if (typeof (v[o[i].name]) == 'undefined')
			v[o[i].name] = o[i].value;
		else
			v[o[i].name] += "," + o[i].value;
	}
	return JSON.stringify(v);
}

checkExistFun = function(url,checkColumnJsonData){
	var checkExist=false;
 	$.ajax({
		  type: 'get',
		  url: url,
		  data: checkColumnJsonData,
		  cache: true,
		  async:false, // 一定要
		  success: function(totalData){
			  totalData = parseInt(totalData,10);
			  if(totalData>0){
				  checkExist=true;
			  }
		  }
     });
 	return checkExist;
};

//浮点数加法运算  
function FloatAdd(arg1,arg2){  
  var r1,r2,m;  
  try{
	  r1=arg1.toString().split(".")[1].length;
   }catch(e){
	   r1=0;
   } 
  try{
	  r2=arg2.toString().split(".")[1].length;
   }catch(e){
	   r2=0;
   }  
  m=Math.pow(10,Math.max(r1,r2)) ; 
  return (arg1*m+arg2*m)/m  ;
 }  

function trimBlank(thisObj){
	 var value=$(thisObj).val();
	  value=jQuery.trim(value);
	  $(thisObj).val(value);  	 	
}  

function accAdd(arg1, arg2) {
	 var r1, r2, m;
	 try {
	  r1 = arg1.toString().split(".")[1].length;
	 } catch (e) {
	  r1 = 0;
	 }
	 try {
	  r2 = arg2.toString().split(".")[1].length;
	 } catch (e) {
	  r2 = 0;
	 }
	 m = Math.pow(10, Math.max(r1, r2));
	 return accDiv((arg1 * m + arg2 * m) , m);
}

//js 除法函数
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
function accDiv(arg1, arg2) {
var t1 = 0, t2 = 0, r1, r2;
try {
t1 = arg1.toString().split(".")[1].length;
} catch (e) {
}
try {
t2 = arg2.toString().split(".")[1].length;
} catch (e) {
}
with (Math) {
r1 = Number(arg1.toString().replace(".", ""));
r2 = Number(arg2.toString().replace(".", ""));
return (r1 / r2) * pow(10, t2 - t1);
}
}

//格式化 - 金额千分位
function commafy(num) {
	num = num+""; 
	var v_regex = /(-?\d+)(\d{3})/;
	while(v_regex.test(num)){
		num=num.replace(v_regex,"$1,$2");
	} 
	return num;
}

//当前月初日期
function firstDayOfMonth(){
	var returnV;
	//yyyy-MM-dd格式的时候  
	var a = new Date();
	returnV = (a.getFullYear()) + "-"
	+ ((a.getMonth()+1)<10?'0':'') + (a.getMonth()+1) + "-" +  "01"; 
	return returnV;
}
//当前月底日期
function lastDayOfMonth(){ 
	var d = new Date(); //获取当前时间
	var vYear = d.getFullYear(); //获取当前年份
	var vMon  = d.getMonth() + 1; //获取当前月份
	var isrun = vYear%400==0||(vYear%4==0&vYear%100!=0); // 是否闰年
	var ddate = 30;                                      //月末日期,默认30号
	if(vMon==1||vMon==3||vMon==5||vMon==7||vMon==8||vMon==10||vMon==12){
	   ddate=31;                                         //大月31号
	}
	else if(vMon==2){     //二月
	  ddate=isrun?29:28;  //闰年29号,平年28号
	}	
	return (vYear + "-"+ (vMon<10?'0':'') + vMon + "-" + ddate);
}

function closeWindow(menuName){
    var tab = parent.$('#mainTabs').tabs('getSelected');
    var index = parent.$('#mainTabs').tabs('getTabIndex',tab);
    parent.$('#mainTabs').tabs('close',index);
    
}

// 公用弹出框
function alert(msg,type){
  //info-0,warning-1,error-2,question-3 ,success-4 
   var typeStr="info";
   if(type==1){
       typeStr='warning';
        $.messager.alert('提示框',msg,typeStr); 
   }else if(type==2){
       typeStr='error';
        $.messager.alert('提示框',msg,typeStr); 
   }else if(type==3){
       typeStr='question';
        $.messager.alert('提示框',msg,typeStr); 
   }else if(type==4){
       typeStr='success';
       $.messager.alert('提示框',msg,typeStr);
   }else{
       typeStr='info';
        $.messager.alert('提示框',msg,typeStr); 
   }
  
}
 
function checkPowerJS(powerValue,index){
        var flag=false;
        var  temp =parseInt(Math.pow(2,index));
          var result = powerValue&temp;
            if(result== temp){
                 flag=true;
            }
        return flag;
 }

//打开新的窗口
function openNewPane(url,modeId,noteText){
 	var t = parent.$('#mainTabs');
	//var url=BasePath+'/receipt/tms_bill_truck_info/list?quartzcenterNo='+currentQuartzcenterNo+'&truckNo='+item.truckNo;
	if(url.indexOf('?')>0){
	   url+='&moduleId='+modeId;
	}else{
	   url+='?moduleId='+modeId;
	}
 	if(!t.tabs('exists',noteText)){
 		top.addBlankTab({title:noteText,href:url,closable: true})
 	}else{
 		t.tabs('close',noteText);
 		top.addBlankTab({title:noteText,href:url,closable: true})
 	}
 	
}

//清除所有表单的验证提示信息
function clearAllValidateHintMsg(){
	$('.validatebox-tip').remove();
}

/**
 * 多选列表选择器对话框
 * @author jin.jd 2014.7.16
 */
function dgChecked(opts){
	var _url=opts.href || '';
	var _title=opts.title;
	var _w=opts.width || null;
	var _h=opts.height || null;
	var iframe=opts.isFrame;
	if(typeof iframe=="undefined"){
		iframe=true;
	}
	top.dgSelectorOpts=opts;
	
	ygDialog({
		title:_title,
		href:_url,
		width:_w,
		height:_h,
		isFrame:iframe,
		modal:true,
		showMask: true,
		onLoad:function(win, content){
				var tb=content.tbgrid;
				var _this=$(this);
				
				if(tb==null){
					tb=opts.tbGrid || $('#dialog_SearchDataGrid');
				}
				
				if(opts.queryUrl!=null){
					var searchBtn=$('#dgSelectorSearchBtn');
					var clearBtn=$('#dgSelectorClearBtn');
					
					if(opts.params != null){
						var form=$('#dialog_SarchForm');
						var ipt;
						var obj = opts.params;
						for(i in obj){   
							ipt = $("<input type=\"hidden\" name=\""+i+"\" id=\""+i+"\" value=\""+obj[i]+"\" />");
							ipt.appendTo(form);			
						}
					}
					if(opts.authorQuery){
						var targetForm=$('#dialog_SarchForm');
						tb.datagrid('options').queryParams = targetForm.form('getData');
						tb.datagrid('options').url = opts.queryUrl;
						tb.datagrid('load');
					}
					
					searchBtn.click(function(){
									var targetForm=$('#dialog_SarchForm');
									tb.datagrid('options').queryParams = targetForm.form('getData');
									tb.datagrid('options').url = opts.queryUrl;
									tb.datagrid('load');
					});
					
					clearBtn.click(function(){
							$('#dialog_SarchForm').form('clear');
							$("input[data-type='clear']").val("");
						});
				}
								
				tb.datagrid({
					onDblClickRow:function(rowIndex, rowData){
						if(typeof top.dgSelectorOpts.fn=="function"){
							if(opts.remark==true){
								rowData.remark=$("#remark").val();
							}
							var row = [rowData];
							top.dgSelectorOpts.fn(row);
						}
						win.close();
					},
					onLoadSuccess:function(){
						$('input[name=optsel]',_this.contents()).on('click',function(){
							var _idx=$('input[name=optsel]',_this.contents()).index(this);
							var row=tb.datagrid('getRows')[_idx];
							if(typeof top.dgSelectorOpts.fn=="function"){
								var rows = [row];
								top.dgSelectorOpts.fn(rows);
							}
							win.close(); 
						});
					}
					
				}); 
				
				var div = $('div[class=dialog-button]');
				var a = $("<a id=\"info_ok\" ></a>").linkbutton({ plain: false, iconCls: "icon-ok", text: "确定" }); 
				a.click(function(){
					var checkedRows = tb.datagrid("getChecked");
					if (checkedRows.length < 1) {
						alert('请选择记录!', 1);
						return;
					}
					
					var row = [];
					$.each(checkedRows, function(index, item) {
						if(opts.remark==true){
							item.remark=$("#remark").val();
						}						
						row.push(item);
					});
					
					if(typeof top.dgSelectorOpts.fn=="function"){
						top.dgSelectorOpts.fn(row);
					}
					win.close();
				});
				a.insertBefore($('div[class=dialog-button]>a'));
				if(opts.remark==true){
					var span = $("<span style=\"float:left\">备注：</span><span style=\"float:left;color:red\">（在此编辑表格中的备注）</span>");
					var ipt = $("<input class=\"easyui-validatebox ipt\" style=\"width:250px;float:left\" name=\"remark\" id=\"remark\"" +
					"data-options=\"validType:['vLength[0,255,\'最多只能输入255个字符\']','isValidText[\'包含无效字符\']']\">");
			        ipt.appendTo(div); 
			        span.insertBefore(ipt);
				}
			}
	});
	return false;
}

/**
 * 单选列表选择器对话框 - 确认按钮
 * @author jin.jd 2014.10.08
 */
function dgSelectOne(opts){
	var _url=opts.href || '';
	var _title=opts.title;
	var _w=opts.width || null;
	var _h=opts.height || null;
	var iframe=opts.isFrame;
	if(typeof iframe=="undefined"){
		iframe=true;
	}
	top.dgSelectorOpts=opts;
	
	ygDialog({
		title:_title,
		href:_url,
		width:_w,
		height:_h,
		isFrame:iframe,
		modal:true,
		showMask: true,
		onLoad:function(win, content){
				var tb=content.tbgrid;
				var _this=$(this);
				
				if(tb==null){
					tb=opts.tbGrid || $('#dialog_SearchDataGrid');
				}
				
				if(opts.queryUrl!=null){
					var searchBtn=$('#dgSelectorSearchBtn');
					var clearBtn=$('#dgSelectorClearBtn');
					
					if(opts.params != null){
						var form=$('#dialog_SarchForm');
						var ipt;
						var obj = opts.params;
						for(i in obj){   
							ipt = $("<input type=\"hidden\" name=\""+i+"\" id=\""+i+"\" value=\""+obj[i]+"\" />");
							ipt.appendTo(form);			
						}
					}
					
					if(opts.formSet != null){ 
						var obj = opts.formSet;
						for(i in obj){   
							$("#dialog_SarchForm #"+i).val(obj[i]);
						}
					}	
					
					if(opts.authorQuery){
						var targetForm=$('#dialog_SarchForm');
						tb.datagrid('options').queryParams = targetForm.form('getData');
						tb.datagrid('options').url = opts.queryUrl;
						tb.datagrid('load');
					}
					
					searchBtn.click(function(){
									var targetForm=$('#dialog_SarchForm');
									tb.datagrid('options').queryParams = targetForm.form('getData');
									tb.datagrid('options').url = opts.queryUrl;
									tb.datagrid('load');
					});
					
					clearBtn.click(function(){
							$('#dialog_SarchForm').form('clear');
						});
				}
								
				tb.datagrid({
					onDblClickRow:function(rowIndex, rowData){
						if(typeof top.dgSelectorOpts.fn=="function"){
							top.dgSelectorOpts.fn(rowData);
						}
						win.close();
					},
					onLoadSuccess:function(){
						$('input[name=optsel]',_this.contents()).on('click',function(){
							var _idx=$('input[name=optsel]',_this.contents()).index(this);
							var row=tb.datagrid('getRows')[_idx];
							if(typeof top.dgSelectorOpts.fn=="function"){
								top.dgSelectorOpts.fn(row);
							}
							win.close(); 
						});
					}
					
				}); 
				
				var a = $("<a id=\"info_ok\" ></a>").linkbutton({ plain: false, iconCls: "icon-ok", text: "确定" });				
				a.click(function(){
					var row = tb.datagrid("getSelected"); 
					if (row ==null ) {
						alert('请选择记录!', 1);
						return;
					}
					if(typeof top.dgSelectorOpts.fn=="function"){
						top.dgSelectorOpts.fn(row);
					}
					win.close();
				}); 
				a.insertBefore($('div[class=dialog-button]>a'));
			}
	});
	return false;
}

/**
 * 商品选择器对话框
 * @author lu.j
 */
function dgSelectGoods(opts){
	var _url=opts.href || '';
	var _title=opts.title;
	var _w=opts.width || null;
	var _h=opts.height || null;
	var iframe=opts.isFrame;
	if(typeof iframe=="undefined"){
		iframe=true;
	}
	var getTimestamp=new Date().getTime();
	ygDialog({
		title:_title,
		href:_url+"?_="+getTimestamp,
		width:_w,
		height:_h,
		isFrame:iframe,
		modal:true,
		showMask: true,
		enableCloseButton:false,
		onOpen:function(){
			if(typeof select_goods!="undefined"){
				select_goods.load_flag=false;
			}
		},
		onLoad:function(win, content){
			console.log("开始common初始化");
			$.easyui.loading({
				topMost: true,
				msg: "努力加载中..."
			});
			var iID = setInterval(function(){
				if(typeof select_goods=="undefined"){
					
				}else{
					if(!select_goods.load_flag || typeof select_goods.end == 'undefined'){
						
					}else{
						console.log("common初始化");
						clearInterval(iID);
						var groupNo = opts.groupNo;
						var groupFlag = opts.groupFlag;
						var cateGroryIds = opts.cateGroryIds;
			        	var otherIds = opts.otherIds;
			        	var supplerIds = opts.supplerIds;
			        	if(groupFlag == 0){//策略
			        		if(cateGroryIds != '' || otherIds != '' || supplerIds != ''){
			        			select_goods.data_index = 0;
			        			groupNo = "";
			        		}else{
			        			select_goods.data_index = 2;
			        		}
			        	}else{//明细
			        		select_goods.data_index = 2;
			        	}
						$('#groupFlag').val(groupFlag);
						$('#brands').val(opts.brands);
						$("#zoneNo").val(opts.zoneNo);
						//添加点击事件  -- 切换
						var tabs = $("#goods_tabs li");
					    tabs.each(function(i,v){
					        var self = $(this);
					        self.bind('click', function(){
					            var idx = tabs.index(self);
					            select_goods.data_index = idx;
					            tabs.removeClass('current');
					            tabs.eq(idx).addClass('current');
					            if(select_goods.data_index == 0){
					            	select_goods.initData(cateGroryIds,otherIds,supplerIds,'');
					            }else{
					            	select_goods.initData('','','',groupNo);
					            }
					            //暂时写死
					            for(var i = 0;i<4;i++){
					            	$("#div-"+i).hide();
					            }
					            //$("#content div").hide();
					            $("#div-"+idx).show();
					        });
					    }).eq(select_goods.data_index).trigger('click');
						$("#finishGoods").click(function(){
							 var invertSelection = $("#invertSelection").val();
							 var price1 = $("#price1").combobox("getValue");
							 var price2 = $("#price2").combobox("getValue");
							 var priceOrganLevel = $("#priceOrganLevel").combobox("getValue");
							 var priceOrganNo = $("#priceOrganNo").val();
							 if(price1 != ''){
								 if(price1 == 1 || price1 == 2 || price1 == 4){
									 if(priceOrganLevel == ''){
										 alert("请选择机构级别");
										 return;
									 }else{
										 if(priceOrganNo == ''){
											 alert("请选择机构");
											 return;
										 }
									 }
									 
								 }
							 }
							 if(price2 != ''){
								 
								 if(price2 == 1 || price2 == 2 || price2 == 4){
									 if(priceOrganLevel == ''){
										 alert("请选择机构级别");
										 return;
									 }else{
										 if(priceOrganNo == ''){
											 alert("请选择机构");
											 return;
										 }
									 }
									 
								 }
							 }
							//如果只选择了一个商品组 则直接返回商品组
							if($(this).attr('class').indexOf('goods_button_disable') > 0){
								return;
							}
							if(select_goods.result_count == 0){
								//没有选择条件
								if(select_goods.save_times != 0){
									var data = {
										groupNo: $("#groupNo").val(),
										groupName:$("#groupName").val()
									};
									$.easyui.loading({
										topMost: true,
										msg: "努力加载中..."
									});
									//保存商品组
									var url = BasePath + '/item_group/group/finish';
									$.ajax({
									  type: 'post',
									  url: url,
									  contentType:"application/json;charset=UTF-8",
									  dataType: "json",
									  data: JSON.stringify(data),
									  cache: false,
									  success: function(result){
										 top.$.easyui.loaded();
										 if(typeof opts.fn=="function"){
											opts.fn(result);
										 }
									  },
									  error:function(){
										 top.$.easyui.loaded();
									  }
								    });
								}else{
									if(typeof opts.fn=="function"){
										opts.fn(select_goods.result_bak);
									}
								}
								
								win.close();  
							}else{
								//var $dg = $('#dataGridDivGroups');
								//var $dg_item = $('#dataGridDivGoods');
								//var checkedGroups = $dg.datagrid("getChecked");
								var checked=select_goods.myGrid.getCheckedRows(0);
					    		//将字符对象按逗号分隔成数组对象
								var checkedGroups = [];
					    		var arry = checked.split(",");
					    		for(var i = 0;i < arry.length;i++){
					    			var rowId = arry[i];
					    			if(rowId != ''){
					    				checkedGroups.push(rowId);
					    			}
					    		}
								if(select_goods.result_count == 1 && invertSelection == 0 && checkedGroups.length == 1 && select_goods.goods_count == 0 && select_goods.save_times == 0){
									if(typeof opts.fn=="function"){
										var groups = {};
										groups.groupNo = checkedGroups[0];
										groups.groupName = select_goods.myGrid.cells(groups.groupNo,2).getValue();
						 				opts.fn(groups);
									 }
									
									 win.close(); 
								}else{
									//0-暂存  1-完成
									select_goods.saveGroup(1,function(result){
										if(result.groupFlag == 1){//如果是明细的话需要判断数量
											if(result.count <= 0){
												showWarn("没有符合要求的商品，请重新设置！");
												return;
											}
										}
										//if(result.count > 0){
										if(result.resultFlag == "success"){
											if(typeof opts.fn=="function"){
								 				opts.fn(result);
											 }
											 win.close();  
										}else{
											showWarn("保存商品组出错！");
										} 
										//}else{
											//showWarn("没有符合要求的商品，请重新设置！");
					    					//select_goods.clearData();
										//}
									});
								}
							}
					    });
						$("#cancle").click(function(){
							 win.close();  
						});
						$("#clearAll").click(function(){
							$("#resultCount").html("");
							$("#groupNo").val("");
							$("#groupName").val("");
							$("#groupFlag").val("");
							$("#gatherType").val("");
							select_goods.save_times = 0;
							select_goods.clearData();
						});
						$('#allGoods').click(function(){
							var data = {
								groupNo: '-1',
								groupName:''
							};
							if(typeof opts.fn=="function"){
				 				opts.fn(data);
							}
							
							win.close();  
						});
					}
				};
			},100);
		}
	});
	return false;
}

//表格列自由拖拽
function dragDataGridColumn(dataGridId){
	var $dg = $("#"+dataGridId+"");
	$dg.datagrid("getPanel").find(".datagrid-header td[field]:not(td[field='id'])").draggable({  
        revert:true,
        proxy:function(source){  
            var proxyEl = $("<div></div>");            
            proxyEl.addClass("dg-proxy dg-proxy-error");              
            proxyEl.html($(source).html());              
            proxyEl.appendTo($("body"));  
              
            return proxyEl;
        }  
    }).droppable({  
        accept:"td[field]",
        onDrop:function(e,source){
              
            var toIndex   = $(this).index(), toField = $(this).attr('field');     //目标列index
            var fromIndex = $(source).index(),fromField = $(source).attr('field');//源idex
            
            var sourceCol = new Array();
            
            $.each($dg.datagrid("getPanel").find(".datagrid-body tr"),function(index,obj){  
                var sourceTd = $(obj).children("td:eq(" + fromIndex + ")");
                sourceCol.push(sourceTd);
            });
            var prev = fromIndex > toIndex;
            toIndex = $(this).index();  
            //将后面的列拖拽到前面
            if(prev){  
                $(this).before($(source));  
            } else{//将前面的列拖拽到后面
                $(this).after($(source));  
            }            
            
            $.each($dg.datagrid("getPanel").find(".datagrid-body tr"),function(index,obj){  
                var thisTd = $(obj).children("td:eq(" + toIndex + ")");  
                //将后面的列拖拽到前面
                if(prev){  
                    thisTd.before(sourceCol[index]);  
                } else{  //将前面的列拖拽到后面
                    thisTd.after(sourceCol[index]);  
                }  
            });
            
            //交换columns中列的位置
            var columns = $dg.datagrid('options').columns;
            var cc = columns[0];
            var fromTemp;
            
            for(var i=0 ; i<cc.length ; i++){
            	if(cc[i].field == fromField){
            		fromTemp = cc[i];
            	}
            } 
            cc.splice(fromIndex,1);//删除原指针的column
        	cc.splice(toIndex,0,fromTemp);//将原column插入到目标指针位置
        	
        }  
    });
}

function redHighLightSyler(value,row,index){
    return 'color:red;';
};