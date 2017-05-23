/**
 * Created by lein on 2017/1/16.
 */
"use strict";
const common = require('../../utilities/common')
const Mongodb = require('../../utilities/event-mongodb-datasource');
module.exports = router => {

    router.post('/coupon/check', (req, res) => {
        common.validate(req.body, {
            price: 'number',
            code: 'notnull',
            q_price: 'notnull',
            company: 'notnull'
        });
        let coupon;
        let time = new Date()
        let db = new Mongodb('find', {
            find: {
                table: 'coupon',
                method: 'findOne',
                param: {
                    $where: "(this.count - (this.use|| 0))> 0",
                    code: req.body.code.toUpperCase(),
                    channel: req.session.channel._id,
                    company: req.body.company,
                    start_time: {
                        $lte: time
                    },
                    end_time: {
                        $gte: time
                    },
                },
                fun: (rs, go) => {
                    coupon = rs;
                    go();
                }
            }
        })

        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', () => {
            if (coupon) {

                if (coupon.quota_type === 1) {
                    // let price = ~~((~~(parseFloat(req.body.price) * 100) * (1 - coupon.quota))) / 100 + '';
                    // let d_price = ((~~(parseFloat(req.body.price) * 100) - ~~(parseFloat(price) * 100))) / 100 + '';
                    // let d_price_index = d_price.indexOf('.');
                    // let price_index = price.indexOf('.');
                    // d_price = d_price.substr(0, d_price_index === -1 ? d_price.length : d_price_index + 3);
                    // price = price.substr(0, price_index === -1 ? price.length : price_index + 3);
                    // let total_price = parseFloat(price) + parseFloat(req.body.q_price) + '';
                    // let total_price_index = total_price.indexOf('.');
                    // total_price = total_price.substr(0, total_price_index === -1 ? total_price.length : price_index + 3);

                    let price = parseFloat((parseFloat(req.body.price) * (1 - coupon.quota)).toFixed(2))
                    let d_price = parseFloat((parseFloat(req.body.price) - price).toFixed(2))
                    let total_price = parseFloat((parseFloat(price) + parseFloat(req.body.q_price)).toFixed(2));
                    res.push({
                        price: price,
                        message: '优惠码有效，你已成功抵扣' + d_price,
                        d_price: d_price,
                        total_price: total_price
                    })
                } else {
                    // let price = ~~((~~(parseFloat(req.body.price) * 100) - coupon.quota)) / 100 + '';
                    // let d_price = coupon.quota / 100 + '';
                    // let d_price_index = d_price.indexOf('.');
                    // let price_index = price.indexOf('.');
                    // d_price = d_price.substr(0, d_price_index === -1 ? d_price.length : d_price_index + 3);
                    // price = price.substr(0, price_index === -1 ? price.length : price_index + 3);

                    let price = parseFloat((parseFloat(req.body.price) - coupon.quota).toFixed(2))
                    let d_price = coupon.quota;
                    let total_price = parseFloat((parseFloat(price) + parseFloat(req.body.q_price)).toFixed(2));
                    res.push({
                        price: price,
                        message: '优惠码有效，你已成功抵扣' + d_price,
                        d_price: d_price,
                        total_price: total_price
                })
                }

            } else {
                process.nextTick(() => {
                    throw new Error('优惠码错误')
                })
            }
        });

        db.start();

    });
};