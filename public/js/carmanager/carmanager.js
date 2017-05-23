$(function(){
	//删除车辆
	$(".delBtn").tap(function(){
		var item = $(this);
		item.parent().remove();
	})
})
