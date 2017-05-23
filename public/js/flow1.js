/*关闭弹框*/
function closeAlert() {
	$(".sure").on("click", function() {
		$(".weui_dialog_alert").remove();

	})
}

/*车主信息*/
/*投保人与被保人change函数*/
var toubaoFlag = 1,
	beiFlag = 1; //投保人与被保人标志为1为默认为车主同人0其他人
var transferFlag = 0; //是否是过户车标志0否1是
function poftType(el) {
	var item = $(el);
	if(item[0].checked) {
		item.next("i").addClass("icon-yuan");
		item.next("i").addClass("c_099");
		item.next("i").removeClass("icon-iconfontwancheng");
		item.next("i").removeClass("c_999");
		if(item.attr("flag") == "01") {
			toubaoFlag = 1;
		} else {
			beiFlag = 1;
		}
	} else {
		item.next("i").removeClass("icon-yuan");
		item.next("i").removeClass("c_099");
		item.next("i").addClass("icon-iconfontwancheng");
		item.next("i").addClass("c_999");
		if(item.attr("flag") == "01") {
			toubaoFlag = 0;
		} else {
			beiFlag = 0;
		}
	}
	item.parent().parent().parent().parent().next(".carInfo_infoList").toggle();
}
/*选择车辆*/
/*单选*/
function oneChoose(item) {

	var item = $(item);

	if(item[0].checked) {
		item.next().eq(0).find(".icon").addClass("weui_icon_success");
		item.next().eq(0).find(".icon").removeClass("weui_icon_circle");

	} else {
		item.next().eq(0).find(".icon").removeClass("weui_icon_success");
		item.next().eq(0).find(".icon").addClass("weui_icon_circle");
	}
	item.parent().siblings().find("input[type=checkbox]").attr("checked", false)
	item.parent().siblings().find("input[type=checkbox]").next().find(".icon").removeClass("weui_icon_success");
	item.parent().siblings().find("input[type=checkbox]").next().find(".icon").addClass("weui_icon_circle");

}

/*投保与不投保开关change函数*/
function changeType(item) {
	var obj = $(item);
	if(item.checked) {
		obj.next().css({
			"top": "8px",
			"left": "23px"
		});
		obj.next().text("投保");
		obj.parent().parent().prev().find("input")[0].checked = true;
	} else {
		obj.next().css({
			"top": "8px",
			"left": "35px"
		});
		obj.next().text("不投保");
		obj.parent().parent().prev().find("input")[0].checked = false;
	}
	//			alert(item.checked);
}
/*是否是过户车改变函数*/
function transChangeType(item) {
	var item = $(item);
	var yesOrNo = item.attr("id")
	if(item[0].checked) {
		if(yesOrNo == "guohuyes") {
			transferFlag = 1;
			item.next().eq(0).find(".iconfont").addClass("icon-yuan");
			item.next().eq(0).find(".iconfont").addClass("c_099");
			item.next().eq(0).find(".iconfont").removeClass("icon-iconfontwancheng");
			item.next().eq(0).find(".iconfont").removeClass("c_999");
			item.parent().next().eq(0).find(".iconfont").removeClass("icon-yuan");
			item.parent().next().eq(0).find(".iconfont").removeClass("c_099");
			item.parent().next().eq(0).find(".iconfont").addClass("icon-iconfontwancheng");
			item.parent().next().eq(0).find(".iconfont").addClass("c_999");
			$(".guohu_dates").css("display", "block");
		} else {
			transferFlag = 0;
			item.next().eq(0).find(".iconfont").addClass("icon-yuan");
			item.next().eq(0).find(".iconfont").addClass("c_099");
			item.next().eq(0).find(".iconfont").removeClass("icon-iconfontwancheng");
			item.next().eq(0).find(".iconfont").removeClass("c_999");
			item.parent().prev().find(".iconfont").removeClass("icon-yuan");
			item.parent().prev().find(".iconfont").removeClass("c_099");
			item.parent().prev().find(".iconfont").addClass("icon-iconfontwancheng");
			item.parent().prev().find(".iconfont").addClass("c_999");
			$(".guohu_dates").hide();
		}

	}

}
/*select下拉change函数*/
function flagChecked(e) {
	var index = e.selectedIndex;
	var item = $(e);
	if(e.options[index].value == -1) {
		item.parent().parent().prev().find("input")[0].checked = false;
		item.addClass("c_666");
		item.removeClass("c_04b");

	} else {
		item.removeClass("c_666");
		item.addClass("c_04b");
		item.parent().parent().prev().find("input")[0].checked = true;
	}

}
/*不计免赔选择函数*/
function _mianpei(item) {
	var item = $(item);
	if(item[0].checked) {
		var noticeMsg = item.parent().parent().parent().parent().prev().find(".question").find(".policyName").text();
		var selectFlag = item.parent().parent().parent().parent().next().find(".weui_select").val();
		var inputFlag = item.parent().parent().parent().parent().next().find(".weui_switch").attr("checked");
		if(selectFlag == undefined) {

			if(!inputFlag || inputFlag == "false") {
				Global.tool.alert("温馨提示", "需先购买" + noticeMsg + "后才能选择不计免赔");
				item[0].checked = false;
				closeAlert();
			} else {
				item.removeClass("c_666");
				item.addClass("c_04b");
			}
		} else if(selectFlag == -1) {
			Global.tool.alert("温馨提示", "需先购买" + noticeMsg + "后才能选择不计免赔");
			item[0].checked = false;
			closeAlert();
		} else {
			item.removeClass("c_666");
			item.addClass("c_04b");
		}
	}
}

//		mui.init({
//		  gestureConfig:{
////		   tap: true, //默认为true
//		   drag: true, //默认为true
//		  }
//		});

$(function() {
		/*初始化菜单栏*/
		if($(window).scrollTop() > 0) {
			$(".headerTitle").addClass("headerbox");
		} else {
			$(".headerTitle").removeClass("headerbox");
		}
		/*打开保险详情*/
		$(".question").on("click", function() {
			var title = $(this).find(".policyName").text();
			var msg = $(this).attr("msg");
			Global.tool.alert(title, msg);
			closeAlert();

		});
		/*打开交强*/
		$(".jiaoqiang").on("click", function() {
			var title = $(this).find(".policyName").text();
			var msg = "机动车交通事故责任强制保险是对被保险机动车发生道路交通事故造成受害人（不包括本车人员和被保险人）的人身伤亡、财产损失，在责任限额内予以赔偿的强制性责任保险。交强险是强制保险制度。";
			Global.tool.alert(title, msg);
			closeAlert();
		})
		$(".bord").on("click", function() {
			var title = $(this).find(".policyName").text();
			var msg = "车船税是指对在我国境内应依法办理登记的车辆、船舶，根据其种类，按照规定的计税依据和年税额标准计算征收的一种财产税。机动车需要在投保交强险时缴纳车船税。";
			Global.tool.alert(title, msg);
			closeAlert();
		})

		/*关闭弹框*/
		$('._closeBtn').on("click", function() {
			$(this).parent().parent().hide();
		})

		//			FastClick.attach(document.getElementById("carInfo"));
		/*页面滚动时改编header样式*/
		$('body')[0].addEventListener("drag", function() {
			if($(window).scrollTop() > 0) {
				$(".headerTitle").addClass("headerbox");
			} else {
				$(".headerTitle").removeClass("headerbox");
			}
		});
		//						

		/*时间选择插件函数*/
		$('.dateTime').on('focus', function() {
			$(this).parent().show();
			$(this).mobiscroll().date({
				theme: "default", // Specify theme like: theme: 'ios' or omit setting to use default 
				mode: "mixed", // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
				display: "bottom", // Specify display mode like: display: 'bottom' or omit setting to use default 
				lang: "zh" // Specify language like: lang: 'pl' or omit setting to use default 
			});
		});

/*====================================================================================车辆信息jsbegin===========================================*/
		$(".chooseCar").on("click", function() {
				$(".carListCover").show();
				/*动态改编按钮位置*/
				var btnTop = $(".carListCover>.scrollBox").height() + Number($(".carListCover>.scrollBox").css("top").split("p")[0]) + 5;
				$(".btnList").css("top", btnTop + "px");
				/*确定选择车辆*/
				$(".carInfo_surebtn").on("click", function() {
						var _item = $(this);
						var nowTime = new Date().getTime();
						var clickTime = _item.attr("ctime");
						if(clickTime != 'undefined' && (nowTime - clickTime < 1100)) {
							return false;
						} else {
							_item.attr("ctime", nowTime);
							var flag = 1
							for(var i = 0; i < $(".checkChild").length; i++) {
								//						alert($(".checkChild")[i].checked)
								if($(".checkChild")[i].checked) {
									var item = $(".checkChild").eq(i).next(".checkLabel");
									var carName = item.find(".carName").text();
									var pailiang = item.find(".pailiang").text();
									var yearTime = item.find(".yearTime").text();
									var seatNum = item.find(".seatNum").text();
									var carPrice = item.find(".carPrice").text();
									var carImg = item.find(".carImg").attr("src");
									flag += 1;
								}
							}
							if(flag == 1) {
								Global.tool.toast("请选车辆");
							} else {
								$("._pailiang").text(pailiang);
								$("._carName").text(carName);
								$(".carInfo_carname").text(carName);
								$("._yearTime").text(yearTime);
								$("._seatNum").text(seatNum);
								$("._carPrice").text(carPrice);
								$("._carImg").attr("src", carImg)
								$(".carListCover").hide();

								/*todo*/
							}
						}
					})
					/*关闭弹框*/
				$(".carInfo_cancelbtn").on("click", function() {
					$(".carListCover").hide();
				})
			})
			/*车辆信息点击下一步*/
		$("#carInfo_nextBtn").on("click", function() {
			$(".noticeTxt").remove(); //移除所有提示消息
			var carHost_name = $('#carHost_name').val(); //车主姓名
			var carInfo_IdClass = $("._select").val(); //车主证件类型;
			var hostIdNum = $("#carInfo_number").val(); //车主证件号;
			var toubao_name = $("#toubao_name").val(); //投保人姓名;
			var toubao_select = $(".toubao_select").val(); //投保人证件类型;
			var toubao_number = $("#toubao_number").val(); //投保人证件号;
			var beibao_name = $("#beibao_name").val(); //被保人姓名;
			var beibao_select = $(".beibao_select").val(); //被保人证件类型;
			var beibao_number = $("#beibao_number").val(); //被保人证件号;
			var frame_number = $("#frame_number").val(); //车架号;
			var power_number = $("#power_number").val(); //发动机号;
			var zhuce_date = $("#zhuce_date").val(); //注册日期;
			var guohu_date = $("#guohu_date").val(); //过户日期；
			/*车主信息验证begin*/
			if(carHost_name == "") {
				$('#carHost_name').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*车主姓名不能为空！</p>');
				document.getElementsByTagName('body')[0].scrollTop = 0;
				return false;
			}
			if(hostIdNum == '') {
				$('#carInfo_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*证件号不能为空！</p>');
				document.getElementsByTagName('body')[0].scrollTop = 0;
				return false;
			} else {
				if(carInfo_IdClass == "01" || carInfo_IdClass == "05") {
					var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
					if(!reg.test(hostIdNum)) {
						$('#carInfo_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*请重新输入正确的18位身份证号码！</p>');
						document.getElementsByTagName('body')[0].scrollTop = 0;
						return false;
					}
				}
			}
			/*车主信息验证结束*/
			/*投保人信息验证begin*/
			if(toubaoFlag == 0) {
				if(toubao_name == '') {
					$('#toubao_name').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*姓名不能为空！</p>');
					document.getElementsByTagName('body')[0].scrollTop = 0;
					return false;
				}

				if(toubao_number == '') {
					$('#toubao_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*证件号不能为空！</p>');
					document.getElementsByTagName('body')[0].scrollTop = 0;
					return false;
				} else {
					if(toubao_select == "01" || toubao_select == "05") {
						var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
						if(!reg.test(toubao_number)) {
							$('#toubao_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*请重新输入正确的18位身份证号码！</p>');
							document.getElementsByTagName('body')[0].scrollTop = 0;
							return false;
						}
					}
				}
			}
			/*投保人信息验证结束*/
			/*被保人验证开始*/
			if(beiFlag == 0) {
				if(beibao_name == '') {
					$('#beibao_name').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*姓名不能为空！</p>');
					document.getElementsByTagName('body')[0].scrollTop = 0;
					return false;
				}

				if(beibao_number == '') {
					$('#beibao_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*证件号不能为空！</p>');
					document.getElementsByTagName('body')[0].scrollTop = 200;
					return false;
				} else {
					if(beibao_select == "01" || beibao_select == "05") {
						var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
						if(!reg.test(beibao_number)) {
							$('#beibao_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*请重新输入正确的18位身份证号码！</p>');
							document.getElementsByTagName('body')[0].scrollTop = 200;
							return false;
						}
					}
				}
			}
			/*验证*/
			if(frame_number == '') {
				$('#frame_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*车架号不能为空！</p>');
				document.getElementsByTagName('body')[0].scrollTop = 300;
				return false;
			}
			if(power_number == '') {
				$('#power_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*发动机号不能为空！</p>');
				document.getElementsByTagName('body')[0].scrollTop = 300;
				return false;
			}
			if(zhuce_date == '') {
				$('#zhuce_date').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*注册日期不能为空！</p>');
				document.getElementsByTagName('body')[0].scrollTop = 400;
				return false;
			}
			if(transferFlag == 1) {
				if(guohu_date == '') {
					$('#guohu_date').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*过户日期不能为空！</p>');
					document.getElementsByTagName('body')[0].scrollTop = 400;
					return false;
				}
			}

			/*验证成功后处理事件*/
			$(".poftPlan").addClass("btnActive").removeAttr("disabled");
			$("#policyPlan").show();
			$(".headerTitle").removeClass("headerbox");
			document.getElementsByTagName('body')[0].scrollTop = 0;
			$("#carInfo").hide();
			//				alert(toubaoFlag)
		})

		/*车辆信息js end*/

/*===================================================================保险方案JS begin======================================================*/

		/*tab切换*/
		$(".policyBtn").on("click", function() {
			var item = $(this);
			item.addClass("planActive").siblings().removeClass("planActive");
			var status = $(this).attr("status");
			if(status == "4") {
				$('.self-selection').show();
				$(".businessRisksList").hide();
			} else {
				$('.self-selection').hide();
				$(".businessRisksList").show();
			}
		})
		$("#changePlan").on("click", function() {
			$(".policyListCover").show();
			/*动态改编按钮位置*/
			var btnTop = $(".policyListCover>.scrollBox").height() + Number($(".policyListCover>.scrollBox").css("top").split("p")[0]) + 5;
			$(".btnList").css("top", btnTop + "px")
		})
		$(".policyListSure").on("click", function() {
			$(".policyListCover").hide();
			$('.selfBtn').addClass("planActive").siblings().removeClass("planActive");
			$('.self-selection').show();
			$(".businessRisksList").hide();
			/*渲染自选tab*/
		})
		$(".policyListCancel").on("click", function() {
			$(".policyListCover").hide();
		})

		/*保险方案下一步函数*/
		$("#policyPlan_nextBtn").on("click", function() {
				$(".countPrice").addClass("btnActive").removeAttr("disabled");
				$("#policyPlan").hide();
				$(".headerTitle").removeClass("headerbox");
				/*todo*/
				$("#companyPrice").show();
			})
			/*保险方案js end*/

/*===========================================================================算保费js开始==================================================================*/

		$(".youhui").on("click", function(e) {
			e.stopPropagation()
			var item = $(this);
			lookPeice(item);

		})

		/*标题按钮函数*/
		$('.titleBtn').on("click", function() {
			var item = $(this);
			var nowTab = item.attr("type");
			var closeTab = item.siblings();
			item.next().removeClass("btnActive");
			item.next().attr("disabled", "disabled");
			$("#" + nowTab).show();
			for(var i = 0; i < closeTab.length; i++) {
				var close = closeTab.eq(i).attr("type");
				$("#" + close).hide();
			}

		})
	})
	/*报价函数*/
function lookPeice(item) {
	var item = item;
	var parentBox = item.parent().parent().parent().parent();
	var companyName = item.attr("companyName"); //公司名字
	var templatebox = item.attr("templatebox");//模板插入flag
	var imgSrc = item.parent().parent().prev().find(".img").attr("src"); //logo路劲
	//					parentBox.html("");
	//					item.parent().html("");		
	item.parent().html("<div class='bar mint active fr' style='z-index:999999' data-percent='100' data-skill='正在报价'></div>");
	setTimeout(function() {
		var html = "";
		/*显示加载条*/
		parentBox.html("");
		html += '<div class="company_info clearfix" style="padding: 1rem 0;width: 100%;" >' +
			'<div class="clearfix" style="width: 40%;">' +
			'<img class="fl img" src=' + imgSrc + ' alt="Logo" width="40px"/>' +
			'<h5 class="fl f15">' + companyName + '</h5>' +
			'</div>' +
			'<div class="fr" style="width: 60%;">' +
			'<div class="clearfix pr">' +
			'<button class="c_fff  reBtn pa"  companyName="平安车险">再次报价</button>' +
			'<button class="c_fff  loseBtn pa"  companyName="平安车险"> <span class="iconfont icon-iconfontgantanhao pa" style="left:3px;color:#ccc;top:5px"></span> 报价失败</button>' +
			'</div>' +
			'</div>' +
			//							'<span class="fr c_ffc f18 totalPrice" companyName=' + companyName + '>￥345.00</span>' +
			'</div>' +
			'<div class="pr priceInfo">' +
			'<p class="c_999 f14" style="padding: .5rem;">失败原因：未通过保险公司核保，建议你选择其他保险公司或调整投保方案，重新进行报价。</p>' +
			'<p class="clearfix c_333" style="padding: .3rem;"><span>强制险</span><span class="fr c_333" style="margin-right: .8rem;">￥12345</span></p>' +
			'<p class="clearfix c_333" style="padding: .3rem;"><span>商业险<span class="f14 c_099">（折扣率7.5折）</span></span><span class="fr c_333" style="margin-right: .8rem;">￥12345</span><span class="f12 fr c_999 oldPrice mt5" style="margin-top:2px;">原价：￥123434</span> </p>' +
			'<div class="tc">' +
			'<span class="iconfont icon-zhankai c_04b f12" style="font-size:.5rem"></span>' +
			'</div>' +
			'<div class="tc">' +

			'<button class="c_fff lookInfo">查看明细</button>' +
			'</div>' +
			'</div>'
		parentBox.html(html);
		parentBox.addClass("showBtn");
		/*投保详情todo*/
		var datas={
			companyName:"平安"
		}
		var templateHtml = template('comTemplate',datas);
		$('#'+templatebox+'').html(templateHtml);
		
		
		
		
		
		/*再次报价*/
		$(".reBtn").on("click", function(e) {
				e.stopPropagation()
				var item = $(this);
				lookPeice(item);
			})
			

		$(".lookInfo").on("click", function() {
			$(this).parent().parent().parent().next().show();
			$(this).parent().parent().parent().hide();
			$(".shouBtn").on("click", function() {
					$(this).parent().hide();
					$(this).parent().prev().show();
				})
				/*兑换优惠码*/
			$(".youhuiBtn").on("click", function(e) {
					e.stopPropagation()
					var _item = $(this);

					Global.tool.alertDialog("优惠码兑换", "温馨提示：使用优惠码后，商业险价格已享受平台补贴，不可再参与平台营销活动。");
					/*取消兑换*/
					$('._cancel').on("click", function() {
							$(".weui_dialog_confirm").remove();
						})
						/*确认兑换*/
					$('._sure').on('click', function() {
						var num = $("._number").val(); //优惠码
						/*todo*/
						
						/*使用成功后操作*/
						$(".weui_dialog_confirm").remove();
						_item.parent().parent().next("._dikou").show();
						_item.parent().parent().hide();
					})
				})
				/*不使用优惠码*/
			$(".alredYouhui").on("click", function() {
				var _item = $(this);
				_item.parent().parent().prev().show();
				_item.parent().parent().hide();
			})
		})

		/*投保时间提醒*/
		$(".timeInfo").on("click", function() {
			var nowTime = new Date().getTime();
			var clickTime = $(this).attr("ctime");
			if(clickTime != 'undefined' && (nowTime - clickTime < 1100)) {
				return false;
			} else {
				$(this).attr("ctime", nowTime);
				var types = $(this).attr("types");
				if(types == "1") {
					Global.tool.alert("提示", "为确保您的强制险起保时间与您上一次投保时间吻合，我们的客服人员会在出单前与您取得联系是否同意校正。");
				} else {
					Global.tool.alert("提示", "为确保您的商业险起保时间与您上一次投保时间吻合，我们的客服人员会在出单前与您取得联系是否同意校正。");
				}

				$(".sure").on("click", function() {
					$(".weui_dialog_alert").remove();
				})
			}
		})
	}, 1000)
}