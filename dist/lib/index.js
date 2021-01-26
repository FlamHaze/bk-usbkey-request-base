"use strict";
exports.__esModule = true;
var domUtils_1 = require("./core/domUtils");
var utils_1 = require("./core/error/utils");
var domExtends_1 = require("./core/domExtends");
/**
 * 对外暴露入口
 * @param params 请求参数
 * @param errorJudgeFun 错误回调
 */
function default_1(params, errorJudgeFun) {
    var formName = domUtils_1.addIframe();
    if (params instanceof Array) {
        for (var i = 0; i < params.length; i++) {
            var returnErr = addOneForm(params[i], formName);
            if (returnErr) {
                return returnErr;
            }
        }
    }
    else {
        var returnErr = addOneForm(params, formName);
        if (returnErr) {
            return returnErr;
        }
    }
    return domUtils_1.operate(errorJudgeFun, formName);
}
exports["default"] = default_1;
/**
 * 添加一个表单
 * @param param 参数
 * @param formName 表单名称
 */
var addOneForm = function (param, formName) {
    if (!param.nameSign) {
        domExtends_1.removeElementsByName(formName);
        return new Promise(function (resolve, reject) {
            reject(utils_1.createCrossResponseError({
                code: "ERR_nameSign",
                message: "未找到正确的方法签名"
            }));
        });
    }
    param.method = param.method || "post";
    param.timeOut = param.timeOut || 5000;
    domUtils_1.addForm(param, formName);
    return;
};
