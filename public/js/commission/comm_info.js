mui.init();
//阻尼系数
var deceleration = mui.os.ios ? 0.002 : 0.0008;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});
mui.ready(function() {
	//循环初始化所有下拉刷新，上拉加载。
	mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
		mui(pullRefreshEl).pullToRefresh({
//			down: {
//				callback: function() {
//					var self = this;
//
//					setTimeout(function() {
//						var ul = self.element.querySelector('.mui-table-view');
//						var type = $(ul).parent().attr("type");
//						pullDown(ul, type, self);
//						self.endPullDownToRefresh();
//					}, 1000);
//				}
//			},
			up: {
				callback: function() {
					 var self = this;

					setTimeout(function() {
						var ul = self.element.querySelector('.mui-table-view');
						var type = $(ul).parent().attr("type");
						createFragment(ul, type, self);
						self.endPullUpToRefresh();
					}, 1000);
				},
				 auto: true,
			}
		});
		
		
	});

});
/*
 * ul==刷新内容需要添加的盒子
 * type==数据类型/赚取明细/兑换明细
 * self==刷新主体
 * */
/*上拉加载函数*/
var createFragment = function(ul, type, self) {
	console.log(type);
	switch(type) {
		case "1":
			self.endPullUpToRefresh(true);
			self.endPullDownToRefresh();
			break;
		case "2":
			self.endPullUpToRefresh(true);
			self.endPullDownToRefresh();
			break;	
	}

};
//var pullDown = function(ul, type, self) {
//	$(ul).empty();
//	switch(type) {
//		case "1":
//			self.endPullUpToRefresh(true);
//			self.endPullDownToRefresh();
//			break;
//		case "2":
//			self.endPullUpToRefresh(true);
//			self.endPullDownToRefresh();
//			break;
//	}
//}