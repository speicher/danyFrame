var authority_module = {};

$(document).ready(function(){
	$('.jsChk').click(function(){
		var _this = $('.lgn-rmb-chk');
		if (_this.hasClass('chked')){
		    $('#cookieFlag').attr('value','0');
			_this.removeClass('chked');
		} else{
		    $('#cookieFlag').attr('value','1');
			_this.addClass('chked');
		}
	});
});

authority_module.checkForm = function(){

	var formObj = $('#dataForm');
	var validateForm = formObj.form('validate');
	 
    if (validateForm == false){
         return ;
    }
	     
	if ($('#memberId').val() == ''){
		$('#memberId').focus();
		return;
	}
	if ($('#memberPwd').val() == ''){
		$('#memberPwd').focus();
		return;
	}
	var url = BasePath + "/login/get_count.json";
	var dataJson = {
			"memberId":$('#memberId').val(),
			"memberPwd":$('#memberPwd').val()
			};
	if(checkExistFun(url, dataJson)){
		var queryUrl = BasePath + "/login/obj_get";
		formObj.form('submit', {
			url: queryUrl,
			onSubmit: function(param){
			},
			success: function(obj){
				window.location = BasePath +"/login/welcome";
		    }
	   });
	} else{
//		var errPage = BasePath +"/danyShop/";
//		return errPage;
		window.location = BasePath +"/danyShop/?errFlag=1";
	}
};

authority_module.save = function(id){
	
	//必须有确认当前新增的行已经结束编辑（endEdit），否则获取新增行datagrid('getChanges', "inserted")是不能获取到
	//正在编辑状态的那一行的
	var tempFlag = authority_module.endEdit(id);
	if(!tempFlag){
		alert('数据验证没有通过!',1);
		return;
	}
	
	var tempObj = $('#'+id);
	var chgSize = tempObj.datagrid('getChanges').length;
	if(chgSize<1){
		alert('没有数据改动!',1);
		return;
	}
	var inserted = tempObj.datagrid('getChanges', "inserted");
    if(inserted.length>0){
        var checkUrl=BasePath+'/authority_module/get_is_exist.json';
        var checkData={};
        for (var i = 0; i < inserted.length; i++) {
        	checkData.moduleName = inserted[i]['name'];
            if(authority_module.checkExistFun(checkUrl,checkData)){
        		alert('名称已经存在!',1);
        		return;
    	    }
        }
    }
    var deleted = tempObj.datagrid('getChanges', "deleted");
    var updated = tempObj.datagrid('getChanges', "updated");
    var effectRow = {
    		inserted:JSON.stringify(inserted),
    		deleted:JSON.stringify(deleted),
    		updated:JSON.stringify(updated),
    };
    $.post(BasePath+'/authority_module/save', effectRow, function(result) {
        if(result.success){
            alert('保存成功!',1);
            tempObj.datagrid('acceptChanges');
        }
    }, "JSON").error(function() {
    	alert('保存失败!',1);
    });
};