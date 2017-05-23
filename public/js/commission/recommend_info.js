
mui.init({
	pullRefresh: {
		container: '#good-list',
		up: {
			contentrefresh: '正在加载...',
			
			contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: randerpage
			
		}
	}
});
setTimeout(function(){
	mui('#good-list').pullRefresh().pullupLoading();
	
},300);

//页面数据请求函数
function randerpage(){
//	mui('#good-list').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
}
