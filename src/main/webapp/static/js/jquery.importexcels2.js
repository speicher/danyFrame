/**
 * Excel 导入
 * 变价单、月商场排、合同扣率 —— 多面板界面中有导入按钮时，全屏会出现部分留空白的问题，此类界面导入用此方法
 */
(function($) {
	var defaults = {
		submitUrl : '',
		templateName : '',
		params : {},
		success:function(result){},
		error:function(){}
	};
	var importExcel = {
		opts : {},
		dialog : null,
		open : function(o) {
			opts = o;
			var $uploadForm = null;
			var $errorInfo = null;
			var $typeDiv = null;
			var $scopeList = null;
			dialog = ygDialog({
				isFrame: true,
				cache : true,
				title : '导入',
				modal : true,
				showMask: false,
				width:'500',
				height:'175',
				href : BasePath + "/shared_method/import",
				buttons:[{
					text:'上传',
					iconCls:'icon-upload',
					handler:function(self){
						var type = $typeDiv.find("input[name=type]:checked").val();//标识- 追加导入or覆盖导入
						$.messager.progress({msg:'处理中',interval:1000}); //进度条

						var dataList = new Object();
						var uploadUrl = o.submitUrl + '?importParams=' + JSON.stringify(o.importParams)+'&importType=' + type;
						
						if(o.importParams.scopeExist == 1){
							dataList = $scopeList;
							var uploadParams = o.importParams;
							var reg = new RegExp("scopeList");
							for(i in uploadParams){
								if(reg.test(i))
									delete uploadParams[i];		
							}
							uploadUrl = o.submitUrl + '?importParams=' + JSON.stringify(uploadParams)+'&importType=' + type;
						}
						$uploadForm.form('submit',{
							url : uploadUrl,
							onSubmit: function(param){
								if(typeof dataList != 'undefined'){
									if(typeof dataList["inserted"]){
										param.scopeI = dataList["inserted"];
									}
									
									if(typeof dataList["deleted"]){
										param.scopeD = dataList["deleted"];
									}
									
									if(typeof dataList["updated"]){
										param.scopeU = dataList["updated"];
									}
								}
								//验证文件是否符合要求
								var uploadFile = $uploadForm.find('#uploadFile').val();
								var fileListType = "xlsx";
								if(uploadFile == ""){
									$.messager.progress('close');
									$errorInfo.find('#info').html("请选择{0}文件".format(fileListType));
								 	$.importExcel.expand(500,360);
									 return false;
								}
								var destStr = uploadFile.substring(uploadFile.lastIndexOf(".")+1,uploadFile.length);
								if(fileListType != destStr){
									$.messager.progress('close');
									$errorInfo.find('#info').html("只允许上传{0}文件".format(fileListType));
									 $.importExcel.expand(500,360);
									 return false;
								}
							},
							success: function(data, status){
								$.messager.progress('close');
								data = eval('(' + data + ')'); 
					        	if (typeof (data.error) != 'undefined') {
					                if (data.error != '') {
					                	$errorInfo.find('#info').html(data.error);
					                	$.importExcel.expand(500,360);
					                } else {
					                	var html="导入总记录："+data.totalCount+"&nbsp;  有效记录："+data.validCount+"<br/>";

					                	if(data.existDatas!= ''&& data.importType=='append'){
					                		html = data.existDatas;
					                		$errorInfo.find('#info').html(html);
						                	$.importExcel.expand(500,360);
					                	} else{
//					                		importExcel.close();
					                	}
					                	o.success(data, $errorInfo);
					                }
					            }
							},
					        //服务器响应失败处理函数
					        error: function (data, status, e){
					        	$.messager.progress('close');
					        	alert(e); 
					        }
						});
					}
				},{
					text:'下载模板',
					iconCls:'icon-download',
					handler:function(){
						window.location.href=BasePath + '/download?fileName='+ encodeURIComponent(o.templateName);
					}
				}],
				onLoad:function(win, dialog){
					dialog.$('#type_div').find("input[name=type]:eq(0)").attr("checked",'checked');//默认选中追加导入
					//月商场排名、合同条款登记 等界面的导入不需要覆盖导入，隐藏radio button
					if(o.importParams.hideType==1){
						dialog.$('#type_div').hide();
					} else{
						dialog.$('#type_div').show();
					}
					$uploadForm  = dialog.$('#uploadForm');
					$typeDiv = dialog.$('#type_div');
				    $errorInfo = dialog.$('#import-info');
				    $scopeList = o.importParams.scopeList;
					dialog.$('#import-info').panel({    
						  width:488,    
						  height:200,
						  title: '提示信息',
						  collapsible : true,
						  onCollapse:function(){
							  $.importExcel.shrink(500,212);
						  },
						  onBeforeExpand:function(){
							  $.importExcel.expand(500,360);
						  }
					}); 
				}
			});
		},
		
		shrink : function(_width,_height){
			$.messager.progress('close');
			$(dialog).dialog('resize',{
				width: _width,
				height: _height
		    });
		},
		
		expand : function(_width,_height){
			$.messager.progress('close');
			$(dialog).dialog('resize',{
				width: _width,
				height: _height
		    });
		},
		
		close : function(){
			$.messager.progress('close');
			$('#uploadFile').val('');
			dialog.panel('close');
		},
		success : function(result){
			$.messager.progress('close');
			opts.success.call(this,result);
		},
		error : function(e){
			$.messager.progress('close');
			opts.error.call(this,e);
		}
	};
	
	$.importExcel = function(options) {
		$.fn.importExcel.open(options);
	};

	$.importExcel.open = function(options) {
		var opts = $.extend({}, defaults, options);
		importExcel.open(opts);
	};

	$.importExcel.shrink = function(_width,_height) {
		return importExcel.shrink(_width,_height);
	};
	
	$.importExcel.expand = function(_width,_height) {
		return importExcel.expand(_width,_height);
	};
	
	$.importExcel.success = function(result){
		return importExcel.success(result);
	};
	
	$.importExcel.error = function(e){
		return importExcel.error(e);
	};
	
	$.importExcel.colse = function(){
		return importExcel.close();
	};
})(jQuery);