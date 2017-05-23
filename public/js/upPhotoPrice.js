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
	/*选择联系地址*/
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
	/*交强险投保*/
	function selfType(item){
	    var obj = $(item);
        if(item.checked) {
            obj.next().css({
                "top": "8px",
                "left": "23px"
            });
            obj.next().text("投保");
        } else {
            obj.next().css({
                "top": "8px",
                "left": "35px"
            });
            obj.next().text("不投保");
        }
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
	/*选择联系地址*/
    function chooseAddr(item){
        var item = $(item);

        if(item[0].checked) {
            item.next().eq(0).find(".icon").addClass("weui_icon_success");
            item.next().eq(0).find(".icon").removeClass("weui_icon_circle");
            $("._addAddr").slideUp("slow");
        } else {
            item.next().eq(0).find(".icon").removeClass("weui_icon_success");
            item.next().eq(0).find(".icon").addClass("weui_icon_circle");
        }
         var list = item.parent().siblings().find("input[type=checkbox]");
                for(var i=0;i<list.length;i++){
                     list[i].checked=false;   
                };
                 var list1 = item.parent().parent().siblings().find("input[type=checkbox]");
                for(var i=0;i<list1.length;i++){
                     list1[i].checked=false;   
                };
        item.parent().siblings().find("input[type=checkbox]").next().find(".icon").removeClass("weui_icon_success");
        item.parent().siblings().find("input[type=checkbox]").next().find(".icon").addClass("weui_icon_circle");
        item.parent().parent().siblings().find("input[type=checkbox]").next().find(".icon").removeClass("weui_icon_success");
        item.parent().parent().siblings().find("input[type=checkbox]").next().find(".icon").addClass("weui_icon_circle");
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
	$(function() {
             $("body").on("click","._moreAddr",function(){
                $(".moreAddr").toggle();
            })
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


			/*时间选择插件函数*/
            function init(){
                $('.dateTime').mobiscroll().date({
                    theme: "default", // Specify theme like: theme: 'ios' or omit setting to use default 
                    mode: "mixed", // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
                    display: "bottom", // Specify display mode like: display: 'bottom' or omit setting to use default 
                    lang: "zh", // Specify language like: lang: 'pl' or omit setting to use default 
                    dateFormat: 'yy-mm-dd',
                });
            }
            init();
			$('.dateTime').on('focus', function() {
				$(this).parent().show();
				$(this).mobiscroll().date({
					theme: "default", // Specify theme like: theme: 'ios' or omit setting to use default 
					mode: "mixed", // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
					display: "bottom", // Specify display mode like: display: 'bottom' or omit setting to use default 
					lang: "zh" // Specify language like: lang: 'pl' or omit setting to use default 
				});
			});

			/*====================================================================照片信息jsbegin============================================*/
				/*照片信息击下一步*/
			$("#next_btn").on("click", function() {

				/*验证成功后处理事件*/
				$(".poftPlan").addClass("btnActive").removeAttr("disabled");
				var s_top =$("#imgInfo").height()+20; 
				$("body").animate({scrollTop: ''+s_top+'px'}, "slow");
				location.href="#policyPlan"
                $("#policyPlan").show();
			})

			/*车辆信息js end*/

			/*=======================================================保险方案JS begin====================================================*/

			/*tab切换*/
			$(".policyBtn").on("click", function() {
				var item = $(this);
				item.addClass("planActive").siblings().removeClass("planActive");
				var status = $(this).attr("status");
				if(status == "4") {
					$('.self-selection').show();
					$(".businessRisksList").hide();
					 $("#changePlan").hide();
				} else {
					$('.self-selection').hide();
					$(".businessRisksList").show();
					 $("#changePlan").show();
				}
			})
			$("#changePlan").on("click", function() {
			    $('.selfBtn').addClass("planActive").siblings().removeClass("planActive");
			    $('.self-selection').show();
                $(".businessRisksList").hide();
                $("#changePlan").hide();
			})

			/*保险方案下一步函数*/
			$("#policyPlan_nextBtn").on("click", function() {
					var forcePolicy_time = $("#forcePolicy_time").val();//强制险起保时间
					var busPolicy_time = $("#busPolicy_time").val();//商业险起保时间
					if(forcePolicy_time==''){
						Global.tool.toast("强制险起保时间不能为空！");
						var s_top =$("#imgInfo").height()+20; 
						$("body").animate({scrollTop: ''+s_top+'px'}, 1000);
						return;
					}
					if(busPolicy_time==''){
						Global.tool.toast("商业险起保时间不能为空！");
						var s_top =$("#imgInfo").height()+20; 
						$("body").animate({scrollTop: ''+s_top+'px'}, 1000);
						return;
					}
					$(".countPrice").addClass("btnActive").removeAttr("disabled");
					var nextHeight = $(window).height();
					$('#companyPrice').height(nextHeight);
					var s_top = $("#policyPlan").height()+$("#imgInfo").height()+40;
					$("body").animate({scrollTop: ''+s_top+'px'}, "slow");
					$("#companyPrice").show();
					location.href="#companyPrice";
//					/*滚动条改变改变导航显示*/
//					var menuTab = $("._policyBox>div");
//					window.onscroll = function(){
//				        var windowScrollTop = $("body").scrollTop(); // 获取鼠标滑动时的滚动条高度;
//				        for(var i=0;i<menuTab.length;i++){
//				            if((menuTab.eq(i).offset().top-90)<=windowScrollTop){  // 判断滚动条是否比当前div距离浏览器顶部的距离;
//				               $('.titleBtn').eq(i).addClass("btnActive");
//				               $('.titleBtn').eq(i).removeAttr("disabled");
//				               $('.titleBtn').eq(i).next().removeClass("btnActive")
//				                $('.titleBtn').eq(i).next().attr("disabled", "disabled");
//				            }
//				        }
//				    }
					/*todo*/
				})
				/*保险方案js end*/

			/*========================================================算保费js========================================================*/
			//新增地址
			$(".addAddrBtn").on("click",function(){
				$("._addAddr").slideDown("slow");
				 var list =  $(".addrChecked");
                for(var i=0;i<list.length;i++){
                     list[i].checked=false;   
                }
                $(".addrChecked").next().find(".icon").removeClass("weui_icon_success");
                $(".addrChecked").next().find(".icon").addClass("weui_icon_circle");
			})
			/*获取验证码*/
			$(".get").on("click",function(){
				var phoneNum = $("#phoneNum").val();
				var timer =null;
				var item = $(this);
				if(Global.tool.checkedPhone(phoneNum)){
					var i=60;
					$(".btn_cover").css("display","block");
					item.text(""+i+"s");
					timer=setInterval(function(){
						
						i--;
						item.text(""+i+"s");
						if(i==0){
							clearInterval(timer);
							item.text("获取验证码");
							$(".btn_cover").css("display","none");
							i=60;
						}
					},1000);
					/*todo数据请求*/
					
				}
			})
			$("#subOrder").on("click",function(){
				var _item = $(this);
				$(".noticeTxt").remove(); //移除所有提示消息
				var nowTime = new Date().getTime();
				var clickTime = _item.attr("ctime");
				var phoneNum = $("#phoneNum").val();//联系人电话
				var checkedNum = $("#checkedNum").val();//验证码
				var tocuhman = $("#man").val();//收货人姓名
				var addr = $("#addr").val();//收获详细地址
				var mobilereg = /^1\d{10}$/;
				if(clickTime != 'undefined' && (nowTime - clickTime < 1100)) {
					return false;
				} else {
					_item.attr("ctime", nowTime);
					var flag = 1;
					var addrFlag = 1;//地址选择标志
					for(var i = 0; i < $(".checkChild").length; i++) {
						if($(".checkChild")[i].checked) {
							flag += 1;
						}
					}
					if(flag == 1) {
						Global.tool.toast("请选择保险公司！");
						return;
					}
					if(phoneNum == ""){
						Global.tool.toast("请输入手机号码！");
						return;
					}
					if(!mobilereg.test(phoneNum)){
					   Global.tool.toast("请输入有效的手机号码！");
                        return; 
					}
					if(checkedNum==""){
						Global.tool.toast("请输入验证码！");
						return;
					}
					if($(".addrChecked").length==0){
						$("._addAddr").slideDown("slow");
//						return;
					}else{
						for(var i = 0; i < $(".addrChecked").length; i++) {
							if($(".addrChecked")[i].checked) {
								addrFlag += 1;
							}
						}
						if(addrFlag==1&&$("._addAddr").css("display")=="none"){
							Global.tool.toast("请选择联系地址或新增地址！");
							return;
						}else{
//							$("._addAddr").slideUp("slow");
						}
					}
					if(addrFlag==1){
						if(tocuhman ==""){
							$('#man').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*请输入联系人姓名！</p>');
							return;
						}
						if(addr == ""){
							$('#addr').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*请输入详细地址！</p>');
							return;
						}
					}
					
					
				}
				window.location.href="subsuccess.html"
			})
			
			/*标题按钮函数*/
//			$('.titleBtn').on("click", function() {
//				var item = $(this);
//				var nowTab = item.attr("type");
//				var closeTab = item.siblings();
//				item.next().removeClass("btnActive");
//				item.next().attr("disabled", "disabled");
//				if(nowTab=="carInfo"){
//					$("body").animate({scrollTop: '0px'}, "slow");
//				}else if(nowTab=='policyPlan'){
//                  var s_top =$("#imgInfo").height()+20; 
//                  $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
//              }else{
//                  var s_top =$("#imgInfo").height()+$("#policyPlan").height()+20; 
//                  $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
//              }
//				location.href="#"+ nowTab;
//			})
			
			
		})
