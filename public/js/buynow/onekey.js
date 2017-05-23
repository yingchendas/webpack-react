 /* 
   * settime:2016.8.22
   author:chenying
   describe:填写投保车辆
   */
  $(function(){
	/*显示实例图片*/
	$(".eg_show").tap(function(){
		$(".cover").show(300);
	});
	/*关闭实例图片*/
	$(".close").tap(function(){
		$(".cover").hide(100);
	})
	/*数据验证并提交数据*/
	$("#saveBtn").tap(function(){
		var classNumber = $("#classNumber").val();//品牌型号
		var discernNumber = $("#discernNumber").val();//车辆识别代号
		var powerNumber = $("#powerNumber").val();//发动机号码
		var date = $("#date").val();//注册日期
		if(classNumber ==''){
			Global.tool.toast("请输入品牌型号");
		}else if(discernNumber == ""){
			Global.tool.toast("请输入车辆识别代号");
		}else if(powerNumber == ""){
			Global.tool.toast("请输入发动机号码");
		}else if(date == ""){
			Global.tool.toast("请选择注册日期");
		}else{
			/*todo 数据验证成功提交数据*/
			setTimeout(function(){
				window.location.href="buynow/choose_car.html";
			},500)
			
		}
	})
})