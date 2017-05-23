/**
 * Created by lein on 2016/12/27.
 */
"use strict";

const code = {
    Z1: {
        name: '车损险',
        des: '车子发生碰撞，赔偿自己爱车损失的费用。比如车子撞了护拦或别人车，自己车子受损。',
        bjmp: {
            code: 'B1'
        }
    },
    Z2: {
        name: '盗抢险',
        des: '赔偿全车被盗窃、抢劫、抢夺造成的车辆损失。比如车子放在露天停车场被盗。',
        bjmp: {
            code: 'B2'
        }
    },
    Z3: {
        name: '三者险',
        des: '若发生保险事故，保险公司可按条款替您对第三方受到的损失（人或财产）进行赔偿。例如不小心撞坏了别人的车，或不小心撞到别人造成伤亡。',
        bjmp: {
            code: 'B3'
        },
        range: {
            Amount: [{
                display: '5万',
                param: '50000'
            }, {
                display: '10万',
                param: '100000'
            }, {
                display: '15万',
                param: '150000'
            }, {
                display: '20万',
                param: '200000'
            }, {
                display: '30万',
                param: '300000'
            }, {
                display: '50万',
                param: '500000'
            }, {
                display: '100万',
                param: '1000000'
            }, {
                display: '150万',
                param: '1500000'
            }, {
                display: '200万',
                param: '2000000'
            }]
        }
    },
    Z4: {
        name: '座位险（司机）',
        des: '发生车险事故时，赔偿车内司机的伤亡和医疗赔偿费用。比如意外事故中，车上驾驶员不幸受伤。专家建议至少保2万/座。',
        bjmp: {
            code: 'B4'
        },
        range: {
            Amount: [{
                display: '1万',
                param: '10000'
            }, {
                display: '2万',
                param: '20000'
            }, {
                display: '3万',
                param: '30000'
            }, {
                display: '4万',
                param: '40000'
            }, {
                display: '5万',
                param: '50000'
            }, {
                display: '10万',
                param: '100000'
            }, {
                display: '15万',
                param: '150000'
            }, {
                display: '20万',
                param: '200000'
            }]
        }
    },
    Z5: {
        name: '座位险（乘客/座）',
        des: '发生车险事故时，赔偿车内乘客的伤亡和医疗赔偿费用。比如意外事故中，车上乘客不幸受伤。专家建议至少保2万/座。',
        bjmp: {
            code: 'B5'
        },
        range: {
            Amount: [{
                display: '1万',
                param: '10000'
            }, {
                display: '2万',
                param: '20000'
            }, {
                display: '3万',
                param: '30000'
            }, {
                display: '4万',
                param: '40000'
            }, {
                display: '5万',
                param: '50000'
            }, {
                display: '10万',
                param: '100000'
            }, {
                display: '15万',
                param: '150000'
            }, {
                display: '20万',
                param: '200000'
            }]
        }
    },
    F1: {
        name: '划痕险',
        des: '负责无碰撞痕迹的车身表面油漆单独划伤的损失。比如车子停放期间，被人用钥匙、小刀等尖锐物恶意划伤。',
        bjmp: {
            code: 'B7'
        },
        range: {
            Amount: [{
                display: '2000',
                param: '2000'
            }, {
                display: '5000',
                param: '5000'
            }, {
                display: '1万',
                param: '10000'
            }, {
                display: '2万',
                param: '20000'
            }]
        }
    },
    F2: {
        name: '玻碎险',
        des: '负责赔偿保险车辆在使用过程中，发生车窗、挡风玻璃的单独破碎损失。比如车子在高速上行驶被飞石击碎车窗、挡风玻璃。',
        range: {
            Amount: [{
                display: '进口',
                param: '20'
            }, {
                display: '国产',
                param: '10'
            }]
        }
    },
    F5: {
        name: '自燃险',
        des: '赔偿车子因电器、线路、运载货物等自身原因引发火灾造成的损失。比如夏季高温时期，车子因线路故障引发自燃。',
        bjmp: {
            code: 'B8'
        }
    },
    F8: {
        name: '涉水发动机损坏险',
        des: '涉水行驶损失险可以通俗的理解为发动机损失险，责任赔偿车辆因遭水淹或因涉水行驶造成的发动机损坏。比如在积水路面涉水行驶、在水中启动造成发动机损坏。',
        bjmp: {
            code: 'B11'
        }
    },
    F3: {
        name: '指定专修厂特约条款',
        des: '按照车损险条款约定，“投保人在投保时要求车辆在出险后可自主选择具有被保险机动车辆专修资格的修理厂进行修理，并愿意为此选择支付相应的保险费。相反，如果车主没有选择该条款，那么车辆出险之后，由被保险人与保险公司协商确定修理方式和费用。“指定专修厂特约条款”是作为机动车损失险的附加条款来使用的。说得通俗点，也就是如果车主投保了特约险，就可以到4S店维修，修理费用由保险公司承担；如果没有投保此险种，车主一定要到4S店维修，那么超出估价范围就要自行承担了。',
    },
    F12: {
        name: '机动车损失保险无法找到第三方特约险',
        des: '按照车损险条款约定，“被保险机动车的损失应当由第三方负责赔偿，无法找到第三方的，实行30%的绝对免赔率”。如果发生上述情形，保险公司将从赔付金额中扣除30%。但如果车主在投保车损险的同时，投保了“机动车损失保险无法找到第三方特约险”，就可以在此附加险项下得到本应由自身承担的30%的赔付。',
    },
    J1: {
        name: '交强险',
        des: '交强险'
    },
    CCS: {
        name: '车船税',
        des: '车船税'
    }
};

exports.existCodes = (codes) => {
    let exist = {}

    codes.filter(c => /^(?!B)/.test(c.Code)).forEach(c => {
        if (code[c.Code]) {
            exist[c.Code] = {
                info: code[c.Code],
                detail: c
            }
        }
    });
    codes.filter(c => /^B/.test(c.Code)).forEach(c => {
        for (let cc in code) {
            if (code[cc].bjmp && code[cc].bjmp.code === c.Code) {
                if (exist[cc])
                    exist[cc].detail.bjmp = true
                break;
            }
        }
    });

    return exist;
};


exports.getBjmp = () => {
    let bjmp = [];
    for (let c in code) {
        if(code[c].bjmp){
            bjmp.push(c)
        }
    }
    return bjmp
};

exports.code = code;

let getName = function (c) {
    let t = code[c]
    if(t)
        return t.name;
    else{
        for(let i in code){
            if(code[i].bjmp && code[i].bjmp.code == c){
                return code[i].name + '不计免陪'
            }
        }
        return null;
    }
}

exports.getName = getName;
