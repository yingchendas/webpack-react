/**
 * Created by lein on 2017/5/2.
 */
"use strict";
const images = require('images');
const fs = require('fs');

module.exports = function (path, wh, originalname) {
    let fileName = path.substr(path.lastIndexOf('/') + 1);
    let writePath = path.substr(0, path.lastIndexOf('/'));
    let oi = originalname.lastIndexOf('.');
    let save = writePath + '/' + fileName + '_' + wh + (oi === -1 ? '.jpeg':originalname.substr(originalname.lastIndexOf('.')));
    images(path).size(wh).save(save);
    fs.renameSync(save, writePath + '/' + fileName + '_' + wh)
    return writePath + '/' + fileName + '_' + wh
}