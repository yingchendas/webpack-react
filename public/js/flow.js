	/*关闭弹框*/
	function closeAlert() {
		$(".sure").on("click", function() {
			$(".weui_dialog_alert").remove();

		})
	}
	/*图片缩小*/
	function scale(o){
        var maxW = $("._imgBox").width();
        //限制的最高长宽
        var maxH = $("._imgBox").height();
        var width = o.offsetWidth;
        var height = o.offsetHeight;
        var wdh = width/height;
        var hdw = height/width;
        //本来这里还要加个if(o.complete)来判断图片是不是已经加载完，但是在我的IE里每次都是false，所以就没加，但是好像对结果没什么影响，待检测！
        if(width>maxW){width = maxW;height = width*hdw;}
        if(height>maxH){height = maxH;width = height*wdh;}o.width = width;o.height = height;
    }
	/*是否是运营车*/
    function carType(item) {

        var name = $(item).attr('name');
        var t = $('input[name=' + name + ']')
        t.parent().siblings().find(".iconfont").removeClass("icon-yuan");
        t.parent().siblings().find(".iconfont").removeClass("c_1ea");
        t.parent().siblings().find(".iconfont").addClass("icon-iconfontwancheng");
        t.parent().siblings().find(".iconfont").addClass("c_999");
        $(item).next().eq(0).find(".iconfont").addClass("icon-yuan");
        $(item).next().eq(0).find(".iconfont").addClass("c_1ea");
        $(item).next().eq(0).find(".iconfont").removeClass("icon-iconfontwancheng");
        $(item).next().eq(0).find(".iconfont").removeClass("c_999");
    }

	/*车主信息*/
	/*投保人与被保人change函数*/
	var toubaoFlag = 1,
		beiFlag = 1; //投保人与被保人标志为1为默认为车主同人0其他人
	var transferFlag = 0; //是否是过户车标志0否1是
	var daikuanFlag=0;
	function poftType(el) {
		var item = $(el);
		if(item[0].checked) {
			item.next("i").addClass("icon-yuan");
			item.next("i").addClass("c_1ea");
			item.next("i").removeClass("icon-iconfontwancheng");
			item.next("i").removeClass("c_999");
			if(item.attr("flag") == "01") {
				toubaoFlag = 1;
			} else {
				beiFlag = 1;
			}
		} else {
			item.next("i").removeClass("icon-yuan");
			item.next("i").removeClass("c_1ea");
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
				"top": "7px",
				"left": "23px"
			});
			obj.next().text("投保");
			obj.parent().parent().prev().find("input")[0].checked = true;
		} else {
			obj.next().css({
				"top": "7.5px",
				"left": "38px"
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
                "top": "7px",
                "left": "23px"
            });
            if(obj.next().text()=="不交税"){
               obj.next().text("交税"); 
            }else{
                obj.next().text("投保"); 
            }
            
        } else {
            obj.next().css({
                "top": "7.5px",
                "left": "38px"
            });
            if(obj.next().text()=="交税"){
               obj.next().text("不交税"); 
            }else{
                obj.next().text("不投保"); 
            }
        }
    }
	function transChangeType(item) {
        var item = $(item);
        var yesOrNo = item.attr("id")
        if(item[0].checked) {
            if(yesOrNo == "guohuyes") {
                transferFlag = 1;
                item.next().eq(0).find(".iconfont").addClass("icon-yuan");
                item.next().eq(0).find(".iconfont").addClass("c_1ea");
                item.next().eq(0).find(".iconfont").removeClass("icon-iconfontwancheng");
                item.next().eq(0).find(".iconfont").removeClass("c_999");
                item.parent().next().eq(0).find(".iconfont").removeClass("icon-yuan");
                item.parent().next().eq(0).find(".iconfont").removeClass("c_1ea");
                item.parent().next().eq(0).find(".iconfont").addClass("icon-iconfontwancheng");
                item.parent().next().eq(0).find(".iconfont").addClass("c_999");
                item.parent().parent().next(".guohu_dates").css("display", "block");
            }else if(yesOrNo=="daikuanyes"){
                daikuanFlag=1;
                item.next().eq(0).find(".iconfont").addClass("icon-yuan");
                item.next().eq(0).find(".iconfont").addClass("c_1ea");
                item.next().eq(0).find(".iconfont").removeClass("icon-iconfontwancheng");
                item.next().eq(0).find(".iconfont").removeClass("c_999");
                item.parent().next().eq(0).find(".iconfont").removeClass("icon-yuan");
                item.parent().next().eq(0).find(".iconfont").removeClass("c_1ea");
                item.parent().next().eq(0).find(".iconfont").addClass("icon-iconfontwancheng");
                item.parent().next().eq(0).find(".iconfont").addClass("c_999");
                item.parent().parent().next(".guohu_dates").css("display", "block");
            }else if(yesOrNo =="daikuanno"){
                daikuanFlag=0;
                item.next().eq(0).find(".iconfont").addClass("icon-yuan");
                item.next().eq(0).find(".iconfont").addClass("c_1ea");
                item.next().eq(0).find(".iconfont").removeClass("icon-iconfontwancheng");
                item.next().eq(0).find(".iconfont").removeClass("c_1ea");
                item.parent().prev().find(".iconfont").removeClass("icon-yuan");
                item.parent().prev().find(".iconfont").removeClass("c_1ea");
                item.parent().prev().find(".iconfont").addClass("icon-iconfontwancheng");
                item.parent().prev().find(".iconfont").addClass("c_999");
                item.parent().parent().next(".guohu_dates").hide();
            }
            else {
                transferFlag = 0;
                item.next().eq(0).find(".iconfont").addClass("icon-yuan");
                item.next().eq(0).find(".iconfont").addClass("c_1ea");
                item.next().eq(0).find(".iconfont").removeClass("icon-iconfontwancheng");
                item.next().eq(0).find(".iconfont").removeClass("c_999");
                item.parent().prev().find(".iconfont").removeClass("icon-yuan");
                item.parent().prev().find(".iconfont").removeClass("c_1ea");
                item.parent().prev().find(".iconfont").addClass("icon-iconfontwancheng");
                item.parent().prev().find(".iconfont").addClass("c_999");
                item.parent().parent().next(".guohu_dates").hide();
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
			item.removeClass("c_ff3");

		} else {
			item.removeClass("c_666");
			item.addClass("c_ff3");
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

	//		mui.init({
	//		  gestureConfig:{
	////		   tap: true, //默认为true
	//		   drag: true, //默认为true
	//		  }
	//		});

	$(function() {
//	    Global.tool.checkedFalse1("很遗憾，您的保单核保未通过，请修改xxx后再次提交。","../images/flase.png");
//	    Global.tool.checkedFalse2("很遗憾，您的保单核保未通过，请修改xxx后再次提交。","../images/flase.png")
	       /*核保提示框关闭*/
	      $("body").on("click","._checkedSure",function(){
	          $(".checkedAlert").remove();
	      })
	      $("body").on("click",".checkedFalse1",function(){
              $(".checkedFalse1").remove();
          })
			/*打开保险详情*/
			$(".question").on("tap", function() {
				var title = $(this).find(".policyName").text();
				var msg = $(this).attr("msg");
				Global.tool.alert(title, msg);
				closeAlert();

			});
			 if($(".comm_headerTitle").css("display")=="block"){
                $("._policyBox").css("margin-top","3rem");
//                      $("#good-list").css("margin-top","6rem");
            }
			  /*返回顶部*/
            $("body").on("click", ".goTop", function () {
                $("body").animate({scrollTop: '0px'}, 1800);
            })
			$(".guohu").on("tap", function() {
//              var title = $(this).find(".policyName").text();
                var msg = $(this).attr("msg");
                Global.tool.alert("温馨提示", msg);
                closeAlert();

            });
			/*打开交强*/
			$(".jiaoqiang").on("tap", function() {
				var title = $(this).find(".policyName").text();
				var msg = "机动车交通事故责任强制保险是对被保险机动车发生道路交通事故造成受害人（不包括本车人员和被保险人）的人身伤亡、财产损失，在责任限额内予以赔偿的强制性责任保险。交强险是强制保险制度。";
				Global.tool.alert(title, msg);
				closeAlert();
			})
			$(".bord").on("tap", function() {
				var title = $(this).find(".policyName").text();
				var msg = "车船税是指对在我国境内应依法办理登记的车辆、船舶，根据其种类，按照规定的计税依据和年税额标准计算征收的一种财产税。机动车需要在投保交强险时缴纳车船税。";
				Global.tool.alert(title, msg);
				closeAlert();
			})

			/*关闭弹框*/
			


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
			$('#carHost_name').on("focus",function(){
			    $(this).val("");
			})
			$('#carInfo_number').on("focus",function(){
                $(this).val("");
            })
			$('.dateTime').on('focus', function() {
//				$(this).parent().show();
				$(this).mobiscroll().date({
					theme: "default", // Specify theme like: theme: 'ios' or omit setting to use default 
					mode: "mixed", // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
					display: "bottom", // Specify display mode like: display: 'bottom' or omit setting to use default 
					lang: "zh",// Specify language like: lang: 'pl' or omit setting to use default 
					dateFormat: 'yy-mm-dd',
				});
			});
			/*====================================================================车辆信息jsbegin============================================*/
			$(".chooseCar").on("tap", function() {
					$(".carListCover").show();
					/*动态改编按钮位置*/
					var btnTop = $(".carListCover>.scrollBox").height() + Number($(".carListCover>.scrollBox").css("top").split("p")[0]) + 5;
					$(".btnList").css("top", btnTop + "px");
					/*确定选择车辆*/
					$(".carInfo_surebtn").on("click", function() {
							var _item = $(this);
							var nowTime = new Date().getTime();
							var tapTime = _item.attr("ctime");
							if(tapTime != 'undefined' && (nowTime - tapTime < 1100)) {
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
					$('._closeBtn').on("click", function() {
                        $(this).parent().parent().hide();
                    })
				})
				/*车辆信息点击下一步*/
			$("#carInfo_nextBtn").on("tap",function() {
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
					 var s_top =$("#carHost_name").offset().top-50;
                        $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
					return false;
				}
				if(hostIdNum == '') {
					$('#carInfo_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*证件号不能为空！</p>');
					var s_top =$("#carInfo_number").offset().top;
                        $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
					return false;
				} else {
					if(carInfo_IdClass == "01" || carInfo_IdClass == "05") {
						var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
						if(!reg.test(hostIdNum)) {
							$('#carInfo_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*请重新输入正确的18位身份证号码！</p>');
							var s_top =$("#carInfo_number").offset().top;
                            $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
							return false;
						}
					}
				}
				/*车主信息验证结束*/
				/*投保人信息验证begin*/
				if(toubaoFlag == 0) {
					if(toubao_name == '') {
						$('#toubao_name').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*姓名不能为空！</p>');
						var s_top =$("#toubao_name").offset().top-50;
                        $("body").animate({scrollTop: ''+s_top+'px'}, 1000);
						return false;
					}

					if(toubao_number == '') {
						$('#toubao_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*证件号不能为空！</p>');
						var s_top =$("#toubao_number").offset().top;
                        $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
						return false;
					} else {
						if(toubao_select == "01" || toubao_select == "05") {
							var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
							if(!reg.test(toubao_number)) {
								$('#toubao_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*请重新输入正确的18位身份证号码！</p>');
								var s_top =$("#toubao_number").offset().top;
                                $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
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
						var s_top =$("#beibao_name").offset().top;
                        $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
						return false;
					}

					if(beibao_number == '') {
						$('#beibao_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*证件号不能为空！</p>');
						var s_top =$("#beibao_number").offset().top;
                        $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
						return false;
					} else {
						if(beibao_select == "01" || beibao_select == "05") {
							var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
							if(!reg.test(beibao_number)) {
								$('#beibao_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*请重新输入正确的18位身份证号码！</p>');
								var s_top =$("#beibao_number").offset().top;
                                $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
								return false;
							}
						}
					}
				}
				if(daikuanFlag==1){
                    if($("#daikuan_bank").val()==''){
                        Global.tool.toast("请输入贷款银行");
                        return;
                    }
                }
				/*验证*/
				if(frame_number == '') {
					$('#frame_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*车架号不能为空！</p>');
					var s_top =$("#frame_number").offset().top;
                        $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
					return false;
				}
				if(power_number == '') {
					$('#power_number').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*发动机号不能为空！</p>');
					var s_top =$("#power_number").offset().top;
                        $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
					return false;
				}
				if(zhuce_date == '') {
					$('#zhuce_date').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*注册日期不能为空！</p>');
					var s_top =$("#zhuce_date").offset().top;
                        $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
					return false;
				}
				if(transferFlag == 1) {
					if(guohu_date == '') {
						$('#guohu_date').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*过户日期不能为空！</p>');
						var s_top =$("#guohu_date").offset().top;
                        $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
						return false;
					}
				}

				/*验证成功后处理事件*/
				$(".poftPlan").addClass("btnActive").removeAttr("disabled");
				var s_top =$(this).parent().offset().top-100;
				$("body").animate({scrollTop: ''+s_top+'px'},1000);
                $("#policyPlan").css("display","block");
                window.location.href="#policyPlan";
                $(".tileTwo").addClass("_active")
                $(".tileTwo").find("._num").addClass("_activeBr");
                $(".tileTwo").find("._line").addClass("_activeBg");
                $(this).parent().hide();
			})

			/*车辆信息js end*/

			/*=======================================================保险方案JS begin====================================================*/

			/*tab切换*/
			$(".policyBtn").on("tap", function() {
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
			   
                $.each($(".businessRisksList .weui_cells:visible"),function(i){
                   var id = $(this).attr("id");
                   var item = $(".self-selection .weui_switch[name="+id+"]")[0];
                   if(item){
                       item.checked=true;
                        selfType(item);
                   }
                        
                })
                $.each($(".businessRisksList .weui_cells:visible .buji:visible"),function(i){
                   var id = $(this).attr("id");
                   var item =  $(".self-selection .weui_check[name="+id+"]")[0];
                    if(item){
                         item.checked=true;
                    }
                 })
//                  selfType(this);
                $(".weui_select").val("1000")
                $("#changePlan").hide();
                 $('.selfBtn').addClass("planActive").siblings().removeClass("planActive");
                $('.self-selection').show();
                $(".businessRisksList").hide();
			})
//			$(".policyListSure").on("tap", function() {
//				$(".policyListCover").hide();
//				$('.selfBtn').addClass("planActive").siblings().removeClass("planActive");
//				$('.self-selection').show();
//				$(".businessRisksList").hide();
//				/*渲染自选tab*/
//			})
//			$(".policyListCancel").on("tap", function() {
//				$(".policyListCover").hide();
//			})
        $("body").on("click","._more",function(){
            $(".moreAddr").toggle();
        })

			/*保险方案下一步函数*/
			$("#policyPlan_nextBtn").on("tap", function() {
					var forcePolicy_time = $("#forcePolicy_time").val();//强制险起保时间
					var busPolicy_time = $("#busPolicy_time").val();//商业险起保时间
					if(forcePolicy_time==''){
						Global.tool.toast("强制险起保时间不能为空！");
						var s_top =$("#carInfo").height()+20; 
						$("body").animate({scrollTop: ''+s_top+'px'}, 1000);
						return;
					}
					if(busPolicy_time==''){
						Global.tool.toast("商业险起保时间不能为空！");
						var s_top =$("#carInfo").height()+20; 
						$("body").animate({scrollTop: ''+s_top+'px'}, 1000);
						return;
					}
					$(".countPrice").addClass("btnActive").removeAttr("disabled");
					
					var nextHeight = $(window).height();
					$('#companyPrice').height(nextHeight);
					var s_top =$(this).parent().offset().top-100;
					if($(".comm_headerTitle").css("display")=="block"){
                       s_top = s_top-45;
                    }
					$("body").animate({scrollTop: ''+s_top+'px'}, 1000);
					$("#companyPrice").show();
					window.location.href="#companyPrice";
					$(".tileThree").addClass("_active")
                    $(".tileThree").find("._num").addClass("_activeBr");
                    $(".tileThree").find("._line").addClass("_activeBg");
					$(this).parent().hide();
					
					
					/*todo*/
				})
				/*保险方案js end*/

			/*========================================================算保费js========================================================*/
			/*报价*/
			$(".youhui").on("tap", function(e) {
				e.stopPropagation();
				var item = $(this);
				lookPeice(item);
			})
			/*再次报价*/
			/*再次报价*/
            $(".aginLookPrice").on("tap",function(){
                var item = $(this).parent().parent().parent();
                    item.prev().show();
                    item.hide();
                    item.prev().find(".company_info").find(".loseBtn").css({"background":"#ff7700","color":"#fff"})
                    var el = item.prev().find(".company_info").find(".loseBtn");
                    lookPeice(el);
            })
			/*去核保*/
			$('.goChecked').on("click",function(){
			    /*显示提示框*/
			    Global.tool.checkedAlert("您好，我们需要30~60秒来为您完成核保工作，请耐心等待...","../images/load.png");
//			     var nextHeight = $(window).height();
//              $('#checkedPolicy').height(nextHeight);
                //$("#checkedPolicy").hide();
                
//			   $(this).parent().parent().parent().parent().parent().hide();
//              $(this).parent().parent().parent().parent().parent().prev().show(); 
			  var items =  $(this)
			     /*收起保险详情tab*/
			    setTimeout(function(){
//			          var s_top =items.parent().offset().top-160;
//			        var s_top = items.parent().parent().parent().parent().parent().offset().top
                    var s_top = $("#policyPlan").height()+$("#carInfo").height()+$("#companyPrice").height()+50;
//                  if($(".comm_headerTitle").css("display")=="block"){
//                     s_top = s_top-45;
//                  }
                    $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
                    $("#checkedPolicy").show();
                    location.href="#checkedPolicy";
                    $(".tileFour").addClass("_active")
                    $(".tileFour").find("._num").addClass("_activeBr");
                    $(".tileFour").find("._line").addClass("_activeBg");
			    },1000)
			})
			//====================================================核保及支付JS==========================================================
			//删除资料图片
			$("body").on("tap",".delImg",function(){
				var _delItem = $(this);
				_delItem.parent().hide();
			})
			//新增地址
			$("body").on("tap",".addAddrBtn",function(){
				$("._addAddr").show();
				 var list =  $(".addrChecked");
                for(var i=0;i<list.length;i++){
                     list[i].checked=false;   
                }
                $(".addrChecked").next().find(".icon").removeClass("weui_icon_success");
                $(".addrChecked").next().find(".icon").addClass("weui_icon_circle");
			})
			/*获取验证码*/
			$("body").on("tap",".get",function(){
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
			//关闭核保信息
			$("body").on("tap",".closeChecked_btn",function(){
				$('#checkedPolicy').hide();
			})
			
			
			
			/*投保时间提醒*/
			$(".timeInfo").on("tap", function() {
				var nowTime = new Date().getTime();
				var tapTime = $(this).attr("ctime");
				if(tapTime != 'undefined' && (nowTime - tapTime < 1100)) {
					return false;
				} else {
					$(this).attr("ctime", nowTime);
					var types = $(this).attr("types");
					if(types == "1") {
						Global.tool.alert("提示", "为确保您的强制险起保时间与您上一次投保时间吻合，我们的客服人员会在出单前与您取得联系是否同意校正。");
					} else {
						Global.tool.alert("提示", "为确保您的商业险起保时间与您上一次投保时间吻合，我们的客服人员会在出单前与您取得联系是否同意校正。");
					}

					$(".sure").on("tap", function() {
						$(".weui_dialog_alert").remove();
					})
				}
			})
			
			
			/*再次报价*/
			$("body").on("tap",".aginBtn",function(e) {
                e.stopPropagation()
                $(this).text("正在报价...")
                var item = $(this).parent().parent().parent().parent().find(".youhui");
                lookPeice(item,$(this));
            })
			
		})
		/*==================================================报价函数=======================================================*/
	   function lookPeice(item) {
        var item = item;
        item.html("正在报价...");
         item.parent().parent().parent().parent().find(".weui_progress").show();
        var parentBox = item.parent().parent().parent().parent();
        var companyName = item.attr("companyName"); //公司名字
        var imgSrc = item.parent().parent().prev().find(".img").attr("src"); //logo路劲
        /*进度条显示*/
        var progressTimer = null;
        if (item.hasClass('weui_btn_disabled')) {
            return;
        }

        item.addClass('weui_btn_disabled');
        item.attr("disabled","disabled");

        var progress = 0;
        var $progress = parentBox.find('.js_progress');

        function next() {
            $progress.css({width: progress + '%'});
            progress = ++progress % 100;
        }
        progressTimer = setInterval(function(){
             next();
        },30);
       
        setTimeout(function() {
            var html = "";
            /*ajax请求成功后关闭进度条*/
            clearInterval(progressTimer);
            item.parent().parent().parent().parent().find(".weui_progress").hide();
            /*显示*/
            parentBox.html("");
            html += '<div class="company_info clearfix" style="padding: 1rem 0;width: 100%;" >' +
                '<div class="clearfix" style="width: 35%;">' +
                '<img class="fl img" src=' + imgSrc + ' alt="Logo" width="40px"/>' +
                '<h5 class="fl f15 b400">' + companyName + '</h5>' +
                '</div>' +
                '<div class="fr" style="width: 65%;">' +
                '<div class="clearfix pr">' +
                '<button class="c_fff  reBtn pa">再次报价</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="pr priceInfo">' +
                '<p class="c_999 f14" style="padding: .5rem;">失败原因：未通过保险公司核保，建议你选择其他保险公司或调整投保方案，重新进行报价。</p>' +
                '<p class="clearfix c_333" style="padding: .3rem;"><span>强制险</span><span class="fr c_ff3" style="margin-right: .8rem;">￥12345</span></p>' +
                '<p class="clearfix c_333" style="padding: .3rem;"><span>商业险<span class="f14 c_999">（折扣率7.5折）</span></span><span class="fr c_ff3" style="margin-right: .8rem;">￥12345</span><span class="f12 fr c_999 oldPrice mt5" style="margin-top:2px;">原价：￥123434566545</span> </p>' +
                '<p class="clearfix c_999" style="padding: .3rem;"><span>本单推广奖励<span class="f14 c_999">（成功出单后可提现）</span></span><span class="fr c_ff3" style="margin-right: .8rem;">￥12345</span></p>' +
                '<div class="tc">' +
                '<span class="iconfont icon-zhankai c_1ea f12" style="font-size:.5rem"></span>' +
                '</div>' +
                '<div class="tc">' +

                '<button class="c_fff lookInfo">查看明细</button>' +
                '</div>' +
                '</div>'+
                '<div class="weui_progress pa" style="bottom: 0px;width: 100%;">'+
                '<div class="weui_progress_bar">'+
                '<div class="weui_progress_inner_bar js_progress" style="width: 0%;"></div>'+
                '</div>'+
                '</div>'
            parentBox.html(html);
            parentBox.addClass("showBtn");
            /*再次报价*/
            $(".reBtn").on("tap", function(e) {
                    e.stopPropagation()
                    var item = $(this);
                    lookPeice(item);
                })
                /*投保详情todo*/

            $(".lookInfo").on("tap", function() {
                var _companyIntem = $(this)
                _companyIntem.parent().parent().parent().next().slideDown();
                _companyIntem.parent().parent().parent().slideUp();
                /*新增修改*/
                setTimeout(function(){
                    $('#companyPrice').height("auto");
                },1000)
                /*新增修改*/
                $(".shouBtn").on("tap", function() {
                        $(this).parent().parent().slideUp();
                        $(this).parent().parent().prev().slideDown();
                    })
                    /*兑换优惠码*/
                $(".youhuiBtn").on("tap", function(e) {
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
                            //                                  
                            //                                  /*todo*/
                            $(".weui_dialog_confirm").remove();
                            _item.parent().parent().next("._dikou").show();
                            _item.parent().parent().hide();
                        })
                    })
                    /*不使用优惠码*/
                $(".alredYouhui").on("tap", function() {
                    var _item = $(this);
                    _item.parent().parent().prev().show();
                    _item.parent().parent().hide();
                })
            })

            /*投保时间提醒*/
            $(".timeInfo").on("tap", function() {
                var nowTime = new Date().getTime();
                var tapTime = $(this).attr("ctime");
                if(tapTime != 'undefined' && (nowTime - tapTime < 1100)) {
                    return false;
                } else {
                    $(this).attr("ctime", nowTime);
                    var types = $(this).attr("types");
                    if(types == "1") {
                        Global.tool.alert("提示", "为确保您的强制险起保时间与您上一次投保时间吻合，我们的客服人员会在出单前与您取得联系是否同意校正。");
                    } else {
                        Global.tool.alert("提示", "为确保您的商业险起保时间与您上一次投保时间吻合，我们的客服人员会在出单前与您取得联系是否同意校正。");
                    }

                    $(".sure").on("tap", function() {
                        $(".weui_dialog_alert").remove();
                    })
                }
            })
        }, 1000)
    }
	

/*去支付*/
function test1(){
    var phoneNum = $("#phoneNum").val();//联系人电话
    var checkedNum = $("#checkedNum").val();//验证码
    var tocuhman = $("#man").val();//收货人姓名
    var addr = $("#addr").val();//收获详细地址
    var mobilereg = /^1\d{10}$/;
//  if(tapTime != 'undefined' && (nowTime - tapTime < 1100)) {
//      return false;
//  } else {
        var addrFlag = 1;//地址选择标志
        if(phoneNum == ""){
            Global.tool.toast("请输入手机号码！");
             $('#phoneNum').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*请输入手机号码！</p>');
            var s_top =$("#phoneNum").offset().top-90;
            $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
            return;
        }
        if(!mobilereg.test(phoneNum)){
            Global.tool.toast("请输入有效的手机号码！");
             $('#phoneNum').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*请输入有效的手机号码！</p>');
            var s_top =$("#phoneNum").offset().top-90;
            $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
           
            return; 
        }
        if(checkedNum==""){
            Global.tool.toast("请输入验证码！");
             $('#checkedNum').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*请输入验证码！</p>');
            var s_top =$("#phoneNum").offset().top-90;
            $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
            return;
        }
        if($(".addrChecked").length==0){
            $("._addAddr").show();
//                      return;
        }else{
            for(var i = 0; i < $(".addrChecked").length; i++) {
                if($(".addrChecked")[i].checked) {
                    addrFlag += 1;
                }
            }
            if(addrFlag==1&&$("._addAddr").css("display")=="none"){
                Global.tool.toast("请选择联系地址或新增地址！");
                var s_top =$("#phoneNum").offset().top-90;
                $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
                return;
            }else{
//                          $("._addAddr").slideUp("slow");
            }
        }
        if(addrFlag==1){
            if(tocuhman ==""){
                $('#man').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*请输入联系人姓名！</p>');
                var s_top =$("#phoneNum").offset().top-10;
                $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
               return;
            }
            if(addr == ""){
                $('#addr').parent().parent().after('<p class="f14 c_c22 bg_f8 noticeTxt" style="padding:0 1rem;">*请输入详细地址！</p>');
                 var s_top =$("#phoneNum").offset().top-10;
                $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
                return;
            }
        }
        
        
//  }
                var s_top = $("#policyPlan").height()+$("#carInfo").height()+$("#companyPrice").height()+$("#checkedPolicy").height()+50;
                    $("body").animate({scrollTop: ''+s_top+'px'}, "slow");
        $("#payWay").css("display","block");
        location.href="#payWay";
        $(".tileFive").addClass("_active")
        $(".tileFive").find("._num").addClass("_activeBr");
    
}