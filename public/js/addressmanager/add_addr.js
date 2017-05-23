
  /* 
   * settime:2016.8.22
   author:chenying
   describe:添加地址
   */
  $(function(){
  	$("#saveBtn").tap(function(){
  		var user_name = $("#user_name").val();//收货人姓名
  		var addr = $("#addr").val();//收货地址
  		if(user_name == ""){
  			Global.tool.toast("请输入收货人姓名");
  		}else if(addr ==""){
  			Global.tool.toast("请输入收货地址");
  		}else{
  			/*todo 数据验证成功提交数据*/
  		}
  	})
  })
