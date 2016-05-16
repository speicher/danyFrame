<#--
  分两个table来装载不同的参数控件类型
-->
<#macro param plist>
       <table id="general"></table>
	   <table id="vip"></table>
	   <#assign paramName = ""/>
	   <#assign widgetType = ""/>
	   <#list plist as p>
	      <#--用于拼接行数据--> 
	      <#if p.isvalid = 0>
	            <#-- 
	            <#if paramName != ''>
	                <#if paramName != p.paramName>
	                       <#if p.widgetType == 1>
		                      <script type="text/javascript">
		                           var table = $("#general");  
				                   table.append("<tr><td>&nbsp;</td></tr>");  
					           </script>
				            </#if>
	                </#if>
	            </#if>
	            <#assign paramName = p.paramName/>
	            <#assign widgetType = p.widgetType/>
	            -->
	            <#assign trStr = ""/>
	            <#assign trStr = trStr + '<tr><td>'/>
	           <#-- 判断控件类型   0=复选框-->
	           <#if p.widgetType = 0> 
	                <#assign trStr = trStr +"<input type='checkbox' name='"+ p.paramName +"' id='"+p.paramNo+"' value='"+p.paramNo +"'" />
	               <#--是否默认选中-->
	               <#if p.ischecked = 0>
	                    <#assign trStr = trStr +'checked' />
	               </#if>
	                <#assign trStr = trStr +'/>&nbsp;&nbsp;' />
	           <#--1=单选框-->
	           <#elseif p.widgetType = 1> 
	            <#assign trStr = trStr +"<input type='radio' name='"+ p.paramName +"' id='"+p.paramNo+"' value='"+p.paramNo +"'" />
	               <#--是否默认选中-->
	               <#if p.ischecked = 0>
	                     <#assign trStr = trStr +'checked' />
	               </#if>
	              <#assign trStr = trStr +'/>&nbsp;&nbsp;' />
	           <#--2=文字-->
	           <#elseif p.widgetType = 2>   
	                <#assign trStr = trStr +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" />
	           </#if>
	           <#--remak部分
	                                        先判断输入框类型  0=文本框 1=下拉框  
	                                        暂时只支持两个输入框   可以拓展   
	           -->
	           <#if p.inputType = 0>
	               <#assign remark = p.remark?replace("@","<input type='text'  id='${p.paramNo + 1}' value='${p.inputValue1}' placeholder='不限' class='parameter_input ipt2' onkeypress='return IsNum2(event)'>",'f')/>
	               <#if remark?contains('@')>
	                   <#assign trStr = trStr + remark?replace("@","<input type='text' id='${p.paramNo + 2}' value='${p.inputValue2}' placeholder='不限' class='parameter_input ipt2' onkeypress='return IsNum2(event)'>",'f') />
	               <#else>
	                   <#assign trStr = trStr + remark />
	               </#if>
	           <#elseif p.inputType = 1>
	               <#--下拉框    选项类容暂时写死 去掉<option value='4'>促销前价</option>-->    
	               <#assign trStr = trStr + p.remark?replace("@","<select class='ipt' style='height:20px' id='${p.paramNo + 1}' data-type='1'><option value='1' selected>牌价</option><option value='2'>现价</option><option value='3'>折后价</option><option value='4'>促销前价</option></select>",'f')/>
	           <#elseif p.inputType = 2>
	               <#--选择框-->    
	               <#assign inputStr =  "<input type='text' id='noCoupon' class='easyui-iptsearch ipt' data-options='width:300,clickFn:sales.step2.property.events.searchNoCoupon' />"/>
	               <#assign inputStr = inputStr + "<input type='hidden' id='cateGroryIds_c'/>"/>
	               <#assign inputStr = inputStr + "<input type='hidden' id='otherIds_c'/>"/>
	               <#assign inputStr = inputStr + "<input type='hidden' id='supplerIds_c'/>"/>
	               <#assign inputStr = inputStr + "<input type='hidden' data-type='groupFlag_c' id='groupFlag_c'/>"/>
	               <#assign inputStr = inputStr + "<input type='hidden' data-type='parameters' name='share_coupon_rule_category' id='P015' value=''/>"/>
	               <#assign trStr = trStr + "<div style='float:left;'>" +p.remark?replace("@","</div><div style='float:left;'>"+inputStr+"</div>",'f')/>
	           <#elseif p.inputType = 3>
	               <#--下拉框    选项类容暂时写死-->    
	               <#assign trStr = trStr + p.remark?replace("@","<select class='ipt' style='height:20px' id='${p.paramNo + 1}' data-type='1'><option value='1' selected>牌价</option><option value='2'>现价</option><option value='4'>促销前价</option></select>",'f')/>
	           <#else>
	               <#assign trStr = trStr + p.remark />
	           </#if>
	           <#assign trStr = trStr + '</td></tr>'/>
	           <#--动态添加行   根据不同的类型添加到不同的table--> 
	            <script type="text/javascript">
	            <#if p.paramType = 0>
	                  var table = $("#general");  
			    <#elseif p.paramType = 1>
	                  var table = $("#vip");  
			    </#if>
                      table.append("${trStr}");  
	           </script>
	        </#if>
	   </#list>
</#macro>