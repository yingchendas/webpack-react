 /* 
   * settime:2016.8.23
   author:chenying
   describe:上传资料
   */
$(function(){
	/*获取验证码*/
	$(".get").tap(function(){
		var phoneNum = $("#phoneNum").val();
		var timer =null;
		var item = $(this);
		if(Global.tool.checkedPhone(phoneNum)){
			var i=20;
			$(".btn_cover").css("display","block");
			item.text(""+i+"s");
			timer=setInterval(function(){
				
				i--;
				item.text(""+i+"s");
				if(i==0){
					clearInterval(timer);
					item.text("获取验证码");
					$(".btn_cover").css("display","none");
					i=20;
				}
			},1000);
			/*todo数据请求*/
			
		}
	})
	
})