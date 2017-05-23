   /*
    * settime:2016.8.23
    * author:chenying
    * describe:兑换佣金
   */
  $(function(){
  	 /*验证输入信息,验证成功后提交数据*/
  	$("#subtn").tap(function(){
  		var weiAcount = $("#weiAcount").val();//微信账号
  		var owerName = $("#owerName").val();//车辆管理者
  		var ex_money = $("#ex_money").val();//兑换金额
  		var ex_number = $("#ex_number").val();//验证码
  		if(weiAcount==""){
  			Global.tool.toast("请输入微信账号");
  		}else if(owerName ==""){
  			Global.tool.toast("请输入管理者姓名");
  		}else if(ex_money ==""){
  			Global.tool.toast("请输入兑换金额");
  		}else if(ex_number ==""){
  			Global.tool.toast("请输入验证码");
  		}else{
  			//验证成功后提交数据
  		}
  	})
  })
