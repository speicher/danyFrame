<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta charset="utf-8">
<title>Please Login In Dany's Shop</title>
<#include "/WEB-INF/ftl/common/header.ftl" >
<link href="${base}/static/css/styles/login/login.css" rel="stylesheet" />
<link href="${base}/static/css/styles/login/base.css" rel="stylesheet" />
<script src="${base}/static/js/authority_module.js" type="text/javascript"></script>
<script>
    $(document).ready(function(){
	     if (window != top) 
	         top.location.href = location.href;
    });
</script>
</head>
<body class="bdy" >
<div class="lgn-bd">
    <div class="wrap rel" >
        <div class="lgn-form">
             <form id="dataForm" action="${base}/login/" method="post" >
                <input type="hidden" name="cookieFlag" id="cookieFlag" value='0'>
                <div class="lgn-form-con">
                    <p>
                        <input type="text" class="lgn-ipt" value="" id="memberId" name="memberId" placeholder="请输入用户名" class="easyui-validatebox" required="true" missingMessage='请输入用户名!' style="font-size:14px;font-weight:900" />
                    </p>
                    <p class="mt20">
                        <input type="password" class="lgn-ipt" value="" id="memberPwd" name="memberPwd" placeholder="请输入密码" class="easyui-validatebox" required="true" missingMessage='请输入密码!' style="font-size:14px;font-weight:900" />
                    </p>
                    <p class="clearfix mt20">
                        <i class="lgn-rmb-chk fl jsChk">&nbsp;</i>
                        <span class="fl ml3 mt3 jsChk">记住密码</span>
                        &nbsp;&nbsp;<span><font size="+2" color="red" style="font-size:9p">${error}</font></span>
                    </p>
                    <p class="clearfix mt20">
                        <span class="fl">
                        <input type="button" id="btn-search"  name="btn-search" class="lgn-sbmt-btn" value="" onclick="authority_module.checkForm" />
                        </span>
                        <span class="fl ml10">
                        <input type="reset" class="lgn-reset-btn" value="" />
                        </span>
                    </p>
                </div>
            </form>
        </div>
    </div>
</div>
<script>
document.onkeydown = function(e) {
    var e = e || window.event;
    var keyCode = e.keyCode || e.which;
    var tg = e.srcElement || e.target;
    if(keyCode == 13){
        checkForm();
    }
}

</script>
</body>
</html>
