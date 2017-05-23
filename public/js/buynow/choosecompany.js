/*
   settime:2016.8.22
   author:chenying
   describe:选择报价公司
 * */
$(function(){
	//单选
	 $(".goodSelect").on("click",function(){
	 	var item =$(this);
	 	chooseBox(item);
	 });
	 //全选
	 $("#all").on("click",function(){
	 	if($(this)[0].checked){
	 		
			$("input[type=checkbox]").each(function() {
				$(this)[0].checked = true;
			});
			$(this).next().eq(0).addClass("weui_icon_success");
			$(this).next().eq(0).removeClass("weui_icon_circle");
	 		$(".icon").addClass("weui_icon_success");
			$(".icon").removeClass("weui_icon_circle");
	 	}else{
	 		$(this).next().eq(0).removeClass("weui_icon_success");
			
			$("input[type=checkbox]").each(function() {
				$(this)[0].checked = false;
			});
			$(this).next().eq(0).addClass("weui_icon_circle");
	 		$(".icon").removeClass("weui_icon_success");
			$(".icon").addClass("weui_icon_circle");
	 	}
	 })
	 /*点击立即报价*/
	$("#priceBtn").on("click",function(){
		var flag = 0;//是否选择公司标志
		var checkedList = $(".checkChild");//所有check除全选
		for(var i=0;i<checkedList.length;i++){
			if(!checkedList[i].checked){
				flag+=1; 
			}else{
				//todo此处获取公司id进行后续查询
			}
		}
		if(flag==checkedList.length){
			Global.tool.toast("请选择报价公司");
		}else{
			setTimeout(function(){
				window.location.href="lookprice.html"
			})
		}
	})
})
/*选择函数*/
function chooseBox(item){
	if(item[0].checked){
	
		item.next().eq(0).find(".icon").addClass("weui_icon_success");
		item.next().eq(0).find(".icon").removeClass("weui_icon_circle");
	}else{
		item.next().eq(0).find(".icon").removeClass("weui_icon_success");
		item.next().eq(0).find(".icon").addClass("weui_icon_circle");
	}
	
	var checkFlag = 1 ;//全选标志1全选0非全选
	var checkAll =$("#all");//全选check;
	var checkedList = $(".checkChild");//所有check除全选
	for(var i=0;i<checkedList.length;i++){
		if(!checkedList[i].checked){
			checkFlag = 0; 
		}
	}
	if(checkFlag==1){
		checkAll[0].checked =true;
		checkAll.next().eq(0).addClass("weui_icon_success");
		checkAll.next().eq(0).removeClass("weui_icon_circle");
		console.log(13);
	}else{
		checkAll[0].checked =false;
		checkAll.next().eq(0).removeClass("weui_icon_success");
		checkAll.next().eq(0).addClass("weui_icon_circle");
	}
}
