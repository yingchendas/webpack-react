/**
 * Created by Lein on 16/9/6.
 */
"use strict";

let Pay = function (body, order_no, fee, ip, cb_url, openid, wx_conf, trade_type) {
    if ((trade_type != 'APP' && body && order_no && ip && cb_url && openid && typeof fee === 'number' && fee >= 1) || (body && order_no && ip , typeof fee === 'number' && fee >= 1)) {
        this.appid = wx_conf.appid;
        this.mch_id = wx_conf.mch_id;
        this.nonce_str = String.uuid();
        this.body = body;
        this.out_trade_no = order_no;
        this.total_fee = ~~fee;
        this.spbill_create_ip = ip;
        this.notify_url = cb_url;
        this.trade_type = trade_type
        this.openid = openid;
    }else {
        throw new Error('参数错误')
    }
};

let QueryOrder = function (order_no,wx_conf) {
    if (order_no) {
        this.appid = wx_conf.appid;
        this.mch_id = wx_conf.mch_id;
        this.nonce_str = String.uuid();
        this.out_trade_no = order_no;
    } else {
        throw new Error('参数错误')
    }
};


exports.Pay = Pay;
exports.QueryOrder = QueryOrder;

