/*
 * settime:2016.7.18
 * author:chenying
 * describe:创建项目全局插件
 * 注：引入该js前需先引入jq/zepto
 */
//定义命名空间函数
var Global = {};
Global.namespace = function (str) {
    var arr = str.split("."), o = Global;
    for (i = (arr[0] = "Global") ? 1 : 0; i < arr.length; i++) {
        o[arr[i]] = o[arr[i]] || {};
        o = o[arr[i]];
    }
}
Global.namespace("Global.tool");
Global.namespace("Global.String");
Global.namespace("Global.method");
Global.namespace("Global.tagCommon");
Global.namespace("Global.cart");
//示例:Global.namespace("A.Cat");A.Car.name="Tom";A.Cat.move=function(){...}
/*判断是否是微信打开*/
Global.method.iswexin = function () {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

/*
 以下为一些公用工具函数
 */
//提示信息
/*修改原始等待框*/
Global.tool.waiting = function () {
    plus.nativeUI.closeWaiting();
    plus.nativeUI.showWaiting("加载中...", {
        padding: "0",
        loading: {height: "30px", icon: 'images/load.jpg', display: "block", interval: "200"},
        background: "rgba(0,0,0,0.3)",
        round: "10px",
        padlock: true
    });
};
/*显示加载框*/
Global.tool.loade = function () {
    var html = '';
    html += '<div class="lodeContainner">' +
        '<div id="floatingCirclesG">' +
        '<div class="f_circleG" id="frotateG_01"></div>' +
        '<div class="f_circleG" id="frotateG_02"></div>' +
        '<div class="f_circleG" id="frotateG_03"></div>' +
        '<div class="f_circleG" id="frotateG_04"></div>' +
        '<div class="f_circleG" id="frotateG_05"></div>' +
        '<div class="f_circleG" id="frotateG_06"></div>' +
        '<div class="f_circleG" id="frotateG_07"></div>' +
        '<div class="f_circleG" id="frotateG_08"></div>' +
        '</div>' +
        '</div>'
    $("body").append(html);
    //获取浏览器的宽度
    var bodyHeight = document.body.clientHeight;
    var bodyWidth = document.body.clientWidth;
    $(".lodeContainner").css({"top": "200px", "left": bodyWidth / 2 - 40});
}
/*关闭加载框*/
/*time===定义等待框显示时间
 * 默认1000ms
 * el==需要移除的dom节点//关闭微信加载框传“weLoading”，关闭自定义传"lodeContainner"
 */
Global.tool.closeLoade = function (time, el) {
    setTimeout(function () {
        $("." + el).remove();
    }, time || 1000);

}
/*交互弹框*/
Global.tool.alert = function (title, text) {
    $(".weui_dialog_alert").remove();
    var html = '';
    html = '<div class="weui_dialog_alert" >' +
        '<div class="weui_mask"></div>' +
        '<div class="weui_dialog" style="margin-top:0px">' +
        '<div class="weui_dialog_hd"><strong class="weui_dialog_title">' + title + '</strong></div>' +
        '<div class="weui_dialog_bd">' + text + '</div>' +
        '<div class="weui_dialog_ft">' +
        '<a href="javascript:void(0)" class="weui_btn_dialog primary sure">确定</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    $("body").append(html);
}
/*核保提示框*/
Global.tool.checkedAlert = function (text,src) {
    $(".checkedAlert").remove();
    var html = '';
    html = '<div class="weui_dialog_alert checkedAlert" >' +
        '<div class="weui_mask"></div>' +
        '<div class="weui_dialog" style="margin-top:0px">' +
        '<div class="weui_dialog_hd"><img src="'+src+'" width="60px"/></div>' +
        '<div class="weui_dialog_bd">' + text + '</div>' +
        '<div class="weui_dialog_ft">' +
        '<a href="javascript:void(0)" class="weui_btn_dialog primary _checkedSure c_1ea" style="color:#1EA7F8;">好</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    $("body").append(html);
}
/*核保失败框*/
Global.tool.checkedFalse1 = function (text,src) {
    $(".checkedFalse1").remove();
    var html = '';
    html = '<div class="weui_dialog_alert checkedFalse1" >' +
        '<div class="weui_mask"></div>' +
        '<div class="weui_dialog" style="margin-top:0px">' +
        '<div class="weui_dialog_hd"><img src="'+src+'" width="60px"/></div>' +
        '<div class="weui_dialog_bd">' + text + '</div>' +
        '<div class="weui_dialog_ft">' +
        '<a href="javascript:void(0)" class="weui_btn_dialog primary _checkedFalse1 c_1ea" style="color:#1EA7F8;">好</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    $("body").append(html);
}
Global.tool.checkedFalse2 = function (text, src) {
    $("#dialog2").remove();
    var html = '';
    html = '<div class="weui_dialog_confirm" id="dialog2" >' +
        '<div class="weui_mask"></div>' +
        '<div class="weui_dialog">' +
        '<div class="weui_dialog_hd"><img src="'+src+'" width="60px"/></div>' +
        '<div class="weui_dialog_bd">' + text + '</div>' +
        '<div class="weui_dialog_ft">' +
        ' <a href="javascript:void(0);" class="weui_btn_dialog default checkedFalse2_cancel">关闭</a>' +
        ' <a href="javascript:void(0);" class="weui_btn_dialog primary checkedFalse2_sure" style="color:#1EA7F8;">等待人工核保</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    $("body").append(html);
}
/*交互弹框*/
Global.tool.dialog = function (title, text) {
    $("#dialog1").remove();
    var html = '';
    html = '<div class="weui_dialog_confirm" id="dialog1" >' +
        '<div class="weui_mask"></div>' +
        '<div class="weui_dialog">' +
        '<div class="weui_dialog_hd"><strong class="weui_dialog_title">' + title + '</strong></div>' +
        '<div class="weui_dialog_bd">' + text + '</div>' +
        '<div class="weui_dialog_ft">' +
        ' <a href="javascript:void(0);" class="weui_btn_dialog default _cancel">取消</a>' +
        ' <a href="javascript:void(0);" class="weui_btn_dialog primary _sure">确定</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    $("body").append(html);
}
/*交互弹框*/
Global.tool.dialog1 = function (title, text) {
    $("#dialog1").remove();
    var html = '';
    html = '<div class="weui_dialog_confirm" id="dialog1" >' +
        '<div class="weui_mask"></div>' +
        '<div class="weui_dialog">' +
        '<div class="weui_dialog_hd"><strong class="weui_dialog_title">' + title + '</strong></div>' +
        '<div class="weui_dialog_bd">' + text + '</div>' +
        '<div class="weui_dialog_ft">' +
        ' <a href="javascript:void(0);" class="weui_btn_dialog default _btnCancel">取消</a>' +
        ' <a href="javascript:void(0);" class="weui_btn_dialog primary _btnSure">确定</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    $("body").append(html);
}
/*交互弹框*/
Global.tool.alertDialog = function (title, text) {
    $(".weui_dialog_confirm").remove();
    var html = '';
    html = '<div class="weui_dialog_confirm" id="dialog1" >' +
        '<div class="weui_mask"></div>' +
        '<div class="weui_dialog">' +
        '<div class="weui_dialog_hd  c_666" ><strong class="weui_dialog_title">' + title + '</strong></div>' +
        '<div class="weui_dialog_bd f14">' + text + '</div>' +
        '<input type="text" class="f16 tc _number weui_input" style="padding:1rem;border-top:none;box-shadow: none; border:1px solid #e3e3e3;margin-top:10px;width:85% !important;" placeholder="请输入优惠码" />' +
        '<div class="weui_dialog_ft">' +
        ' <a href="javascript:void(0);" class="weui_btn_dialog default _cancel" style="padding:.3rem">取消</a>' +
        ' <a href="javascript:void(0);" class="weui_btn_dialog  _sure c_1ea"style="padding:.3rem;color:#1EA7F8;">兑换</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    $("body").append(html);
}
/*输入身份证交互框*/
Global.tool.idcarDialog = function (text, staus) {
    $(".weui_dialog_confirm").remove();
    var html = '';
    html = '<div class="weui_dialog_confirm" id="dialog1" >' +
        '<div class="weui_mask"></div>' +
        '<div class="weui_dialog">' +
        '<div class="weui_dialog_hd  c_666" ><strong class=" f18">温馨提示</strong></div>' +
        '<div class="weui_dialog_bd  c_333 f14">' + text + ':</div>' +
        '<div class="_box" style="border-top:1px solid #e3e3e3;padding:.3rem">' +
        ' <div class="weui_cell weui_cell_select weui_select_before" style="width:100%;">' +
        '<label class="weui_label f14 c_c22" style="margin-left: -10px;width:48%;margin-right:0 !important;">*请选择客户类型:</label>' +
        '<select class="weui_select _custom c_999 f14" style="width:50%;padding-left:0 !important;" name="select2">' +
        '<option value="01">个人</option>' +
        '</select>' +
        '<span class="iconfont icon-xiajiantou pa c_999" style="right:7%;top:12px;"></span>' +
        '</div>' +
        ' <div class="weui_cell weui_cell_select weui_select_before pr" style="width:100%;">' +
        '<label class="weui_label f14 c_c22" style="margin-left: -10px;width:48%;margin-right:0 !important;">*请选择证件类型:</label>' +
        '<select class="weui_select _select c_999 f14" style="width:50%;padding-left:0 !important;" name="select2">' +
        '<option value="01">身份证</option>' +
        '<option value="02"> 驾驶证</option>' +
        '<option value="03">军人证</option>' +
        '<option value="04"> 护照</option>' +
        '<option value="05">临时身份证</option>' +
        '<option value="06"> 港澳通行证</option>' +
        '<option value="07">台湾通行证</option>' +
        '<option value="21">组织机构代码 </option>' +
        '<option value="22">税务登记证</option>' +
        '<option value="23">营业执照(三证合一)</option>' +
        '<option value="24">其他证件</option>' +
        '</select>' +
        '<span class="iconfont icon-xiajiantou pa c_999" style="right:7%;top:12px"></span>' +
        '</div>' +
        '<input type="text" class="f14 tc _number weui_input" style="padding:1rem;border-top:none;box-shadow: none; border:1px solid #e3e3e3;margin-top:10px;width:85% !important;" placeholder="请输入证件号" />' +


        '</div>' +
        '<div class="_checkbox clearfix" style="margin-top:15px;width:95%;padding-left:"2rem">' +
        '<span class="c_999 fl" style="margin-left:1rem">是否为运营车辆：</span>' +
        '<div class="fr">' +
        '<span class="_shi c_999 "><i class="iconfont icon-iconfontkuangcopy _chooseStatus fl" style="display: inline-block;margin-right:5px ;"></i><span class="fl">是</span></span>' +
        '<span class="_fou c_999" style="margin-left:10px"><i class="iconfont icon-gou2 _chooseStatus fl" style="display: inline-block;margin-right:5px ;margin-left:10px"></i><span class="fl">否</span></span>' +
        '</div>' +
        '</div>' +
        '<div class="weui_dialog_ft">' +
        ' <a href="javascript:void(0);" class="weui_btn_dialog default _cancel" style="padding:.3rem">取消</a>' +
        ' <a href="javascript:void(0);" class="weui_btn_dialog primary _sure"style="padding:.3rem">确认</a>' +
        '</div>' +
        '</div>' +
        '</div>'
    $("body").append(html);


    if (staus == -3) {
        $("._checkbox").hide();
    } else if (staus == -4) {
        $("._box").hide();
    }
    $("select").css("direction", "rtl");
    $(".icon-iconfontkuangcopy").css("font-size", "1rem");
    $(".icon-iconfontkuangcopy").css("margin-top", "3px")
    $(".icon-gou2").css("font-size", "1.2rem");
//		  $(".icon-gou2").css("padding-top","5px")
    $(".icon-gou2").css("color", "#04be02");
    $("._shi").on("click", function () {
        $(this).find(".iconfont").addClass("icon-gou2");
        $(this).find(".iconfont").css("font-size", "1.2rem");
        $(this).find(".iconfont").removeClass("icon-iconfontkuangcopy")
        $(this).find(".iconfont").css("color", "#04be02");
        $(this).find(".iconfont").css("margin-top", "0");
        $(this).next("._fou").find(".iconfont").addClass("icon-iconfontkuangcopy");
        $(this).next("._fou").find(".iconfont").removeClass("icon-gou2");
        $(this).next("._fou").find(".iconfont").css("font-size", "1rem");
        $(this).next("._fou").find(".iconfont").css("color", "#ccc");
        $(this).next("._fou").find(".iconfont").css("margin-top", "0px")
    })
    $("._fou").on("click", function () {
        $(this).find(".iconfont").addClass("icon-gou2");
        $(this).find(".iconfont").css("font-size", "1.2rem");
        $(this).find(".iconfont").removeClass("icon-iconfontkuangcopy")
        $(this).find(".iconfont").css("color", "#04be02");
        $(this).find(".iconfont").css("margin-top", "-2px");
        $(this).prev("._shi").find(".iconfont").addClass("icon-iconfontkuangcopy");
        $(this).prev("._shi").find(".iconfont").removeClass("icon-gou2");
        $(this).prev("._shi").find(".iconfont").css("font-size", "1rem");
        $(this).prev("._shi").find(".iconfont").css("color", "#ccc");
        $(this).next("._shi").find(".iconfont").css("margin-top", "3px")
    })

}
/*微信加载框*/
Global.tool.weiLoade = function (text) {
    var html = '';
    html = '<div id="loadingToast" class="weui_loading_toast weLoading" >' +
        '<div class="weui_mask_transparent"></div>' +
        '<div class="weui_toast">' +
        '<div class="weui_loading">' +
        '<div class="weui_loading_leaf weui_loading_leaf_0"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_1"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_2"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_3"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_4"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_5"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_6"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_7"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_8"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_9"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_10"></div>' +
        '<div class="weui_loading_leaf weui_loading_leaf_11"></div>' +
        '</div>' +
        '<p class="weui_toast_content">' + (text || '数据加载中...') + '</p>' +
        '</div>' +
        '</div>'
    $("body").append(html);

}

Global.tool.weiLoadeClose = function () {
    $("#loadingToast").remove()
}

/*自动消失toast*/
/*

 * time==设置显示时间默认1000ms
 * */
Global.tool.success = function (time) {
    var html = '';
    html = '<div id="toast" class="autoToast" >' +
        '<div class="weui_mask_transparent"></div>' +
        '<div class="weui_toast">' +
        '<i class="weui_icon_toast"></i>' +
        '<p class="weui_toast_content">完成</p>' +
        '</div>' +
        '</div>'
    $("body").append(html);
    setTimeout(function () {
        $(".autoToast").hide(300);
    }, time || 1000)
}
/*自定义toast

 * text==自定义内容
 * */
Global.tool.toast = function (text) {
    var html = '';
    html = '<div class="my_toast" style="position: fixed;width:45%;z-index:10003; background: rgba(0,0,0,0.5);bottom: 45%;left: 25%;border-radius: 5px;color: #fff;">' +
        '<p class="toast_text" style="padding: 1rem;text-align: center;">' + text + '</p>' +
        '</div>'
    $("body").append(html);
    setTimeout(function () {
        $(".my_toast").remove();
    }, 2000);
}

/*自定义toast

 * text==自定义内容
 * url==提示框消失后跳转页面
 * */
Global.tool.toastJump = function (text, url) {
    var html = '';
    html = '<div class="my_toast" style="position: fixed;width:45%;z-index:10003; background: rgba(0,0,0,0.5);bottom: 45%;left: 25%;border-radius: 5px;color: #fff;">' +
        '<p class="toast_text" style="padding: 1rem;text-align: center;">' + text + '</p>' +
        '</div>'
    $("body").append(html);
    setTimeout(function () {
        $(".my_toast").remove();
        window.location.href = url;
    }, 1000);
}
/*
 * 三位一逗号数���处理
 * eg:2,000,000
 * 
 */
Global.tool.formatNum = function (strNum) {
    if (strNum.length <= 3) {
        return strNum;
    }
    if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
        return strNum;
    }
    var a = RegExp.$1,
        b = RegExp.$2,
        c = RegExp.$3;
    var re = new RegExp();
    re.compile("(\\d)(\\d{3})(,|$)");
    while (re.test(b)) {
        b = b.replace(re, "$1,$2$3");
    }
    return a + "" + b + "" + c;
}
/*
 * 日期format
 *  alert(new Date().Format("yyyy年MM月dd日")); 
 alert(new Date().Format("MM/dd/yyyy"));
 alert(new Date().Format("yyyyMMdd"));
 alert(new Date().Format("yyyy-MM-dd hh:mm:ss"));
 *
 */
Date.prototype.Format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

/**保留小数位数**/
Global.tool.toFixed = function (num, fix) {
    return parseFloat(num, 10).toFixed(fix);
}
/*手机号验证
 * phoneNumber 手机号码
 * */
Global.tool.checkedPhone = function (phoneNumber) {
    var mobilereg = /^1\d{10}$/;
    if (phoneNumber == '') {
        Global.tool.toast('手机号不能为空！');
        return false;
    } else if (!mobilereg.test(phoneNumber)) {
        Global.tool.toast('请输入有效的手机号！');
        return false;
    } else {
        return true;
    }
}

/*获取链接上参数*/
/*

 * $name==参数名
 * */
Global.method.getUrlParameter = function ($name) {
    var reg = new RegExp("(^|&)" + $name + "=([^&]*)(&|$)", "i"),
        r = window.location.search.substr(1).match(reg);
    if (r !== null) return (r[2]);
    return null;
};
/*返回函数*/
$(".com_back").on("click", function () {
    history.go(-1);
})
$(function () {
//  if (Global.method.iswexin()) {
//      $(".comm_headerTitle").css("display", "none");
////         $(".container").css("margin-top","0px")
//  } else {
//      $(".comm_headerTitle").css("display", "block");
//      $(".container").css("margin-top", "45px")
//  }
    /*菜单事件*/
       var list_con = $(".com_man");
        list_con.on("click", function () {
            $(".menu_list").toggle();
            $("body").on("click", function () {
                $(".menu_list").hide()
            });
            return false
        });
        
})
