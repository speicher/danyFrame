var maxTab = false;//最大化
var dgSelectorOpts=null;//弹窗选择器
var All_CacheCode={};
$.ajax({
	  type: 'GET',
	  url: BasePath + '/initCache/all_standard_dtl',
	  dataType: "json",
	  data: null,
	  cache: false,
	  async : false,
	  success: function(result){
		  All_CacheCode=result;  					  
	  }
});

function parsePage(){
	buildSubSys_mps();
	InitLeftMenu('#leftMenu');

	$('#tabToolsFullScreen').click(function(){
		changeScreen();
	});
	
	$('#lnkDesk').click(function(){
		addTab({
		title: '系统桌面'
		});
	});
	$('#loading').remove();
	loadPortal();
}
/**
*根据JSON数据生成子系统
*/
function buildSubSys_mps(){
	var callback = function(result){
		buildSubSysCommon(result);
		$('.subSys').scrollmenu();
	};
	$.getJSON(BasePath+"/uc_sub_system.json",callback);
}

function loadPortal(){
	$('#pp').portal({
		border:false,
		fit:true
	});
	var p1 = $('#main_1');
	p1.panel({
		height:360,
		closable:false,
		collapsible:true,
		border:false
	});
	
	$('#pp').portal('add', {
		panel:p1,
		columnIndex:0
	});
	var p2=$("#remind_1");
	p2.panel({
		title:'合同提醒',
		iconCls:'icon-portal-undo',
		href:BasePath+'/remind/expire_remind',
		height:200,
		closable:false,
		collapsible:true,
		tools:[{iconCls:'icon-refresh',text:'刷新',handler:function(){p2.panel("refresh");}}]
	});
	$('#pp').portal('add', {
		panel:p2,
		columnIndex:1
	});
	$('#pp').portal("disableDragging",p2);
	
	var p3=$("#remind_2");
	p3.panel({
		title:'变价单异常提醒',
		href:BasePath+'/price_change_remind/remind',
		iconCls:'icon-portal-undo',
		height:169,
		closable:false,
		collapsible:true,
		tools:[{iconCls:'icon-refresh',text:'刷新',handler:function(){p3.panel("refresh");}}]
	});
	$('#pp').portal('add', {
		panel:p3,
		columnIndex:1
	});
	$('#pp').portal("disableDragging",p3);
	
}

//初始化左侧菜单
function InitLeftMenu(obj) {
	 $.getJSON(BasePath+"/uc_user_tree.json", function(data){
		 buildMenuCommon(data[0].children);
	 });
}
//*********************************修改密码*************************************//
//打开修改密码窗口
function updatePassword(){
	var fromObj = $('#dataForm');
	fromObj.form('clear');
	$('#passwordDialog').show();
	$('#passwordDialog').window('open');
}
//校验保存
function savePassword(){
	//验证表单
	var fromObj = $('#dataForm');
	// 1.校验必填项
	var validateForm = fromObj.form('validate');
	if (validateForm == false) {
		return;
	}
	//两次输入密码一致性检验
	var newPwd = $("#newPwd").val();
	var newPwd2 = $("#newPwd2").val();
	if(newPwd != newPwd2){
		showWarn("两次密码输入不一致！");
		return;
	}
	// 2. 保存
	var v_save_url = BasePath + '/update_password';
	fromObj.form('submit', {
		url : v_save_url,
		success : function(data) {
			var result = jQuery.parseJSON(data);
			if(result.code == 200){
				showSuc('修改成功!');
				$('#passwordDialog').hide();
				$('#passwordDialog').window('close');
			}else{
				showWarn(result.message);
			}
			
		},
		error : function() {
			showError('修改失败,请联系管理员!');
		}
	});
}
//关闭窗口
function closeWindow(){
	$('#passwordDialog').hide();
	$('#passwordDialog').window('close');
}
//*********************************修改密码*************************************//
//全屏切换
function changeScreen() {
    if (maxTab) {
       // $('body').layout('show', 'west');
        $('body').layout('show', 'north');
        $('body').layout('show', 'south');
				if ($.util.supportsFullScreen) {
         	$.util.cancelFullScreen();
       	 }
        maxTab = false;
        $('#tabToolsFullScreen').linkbutton({
            iconCls: "icon-window-max",
            text: "全屏"
        });
    } else {
        $('body').layout('hidden', 'south');
       // $('body').layout('hidden', 'west');
        $('body').layout('hidden', 'north');
				
				if ($.util.supportsFullScreen) {
						$.util.requestFullScreen();
				} 
        maxTab = true;
        $('#tabToolsFullScreen').linkbutton({
            iconCls: "icon-window-min",
            text: "正常"
        });
    }
}

function setTimerSpan(){
	var timerSpan = $("#timerSpan"), 
	interval = function () { 
		timerSpan.text($.date.toLongDateTimeString(new Date()));
	};
	interval();
	window.setInterval(interval, 1000);
};