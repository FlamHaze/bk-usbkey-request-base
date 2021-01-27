"use strict";
exports.__esModule = true;
exports.operateForm = exports.operate = exports.addForm = exports.subOneFormCalc = exports.addFormCalc = exports.addIframe = exports.FORM_NAME_PRE = exports.FORM_CLASSNAME = exports.IFRAME_NAME = exports.IFRAME_ID = void 0;
var domExtends_1 = require("./domExtends");
var utils_1 = require("./error/utils");
/**
 * 跨域请求表单计数器.
 */
var FORM_CALC_ID = "BK_CROSS_FORM_REQUEST_FORM_CALC_ID";
/**
 * 操作状态ID.
 */
var OPERATE_STATE_ID = "BK_CROSS_FORM_REQUEST_FORM_OPERATE_STATE_ID";
/**
 * iframeId
 */
exports.IFRAME_ID = "BK_CROSS_FORM_REQUEST_IFRAME_ID";
/**
 * iframeName
 */
exports.IFRAME_NAME = "BK_CROSS_FORM_REQUEST_IFRAME_NAME";
/**
 * 跨域表单Class
 */
exports.FORM_CLASSNAME = "BK_CROSS_FORM_REQUEST_FORM_CLASSNAME";
/**
 * 跨域表单名称
 */
exports.FORM_NAME_PRE = "BK_CROSS_FORM_REQUEST_FORM_NAME";
/**
 * 跨域表单方法签名key
 */
var FORM_NAME_SIGN = "name-sign";
var FORM_REQUEST_TIMEOUT_FLAG = "BK_CROSS_FORM_REQUEST_FORM_REQUEST_TIMEOUT_FLAG";
/**
 * 添加iframe
 */
function addIframe() {
    var formName;
    var formCalcEle = document.getElementById(FORM_CALC_ID);
    if (formCalcEle) {
        var nowNumber = parseInt(formCalcEle.value);
        formName = "" + exports.FORM_NAME_PRE + nowNumber;
    }
    else {
        formName = exports.FORM_NAME_PRE + "0";
    }
    if (document.getElementById(exports.IFRAME_ID)) {
        return formName;
    }
    var body = document.body;
    var iframe = document.createElement("iframe");
    iframe.id = exports.IFRAME_ID;
    iframe.name = exports.IFRAME_NAME;
    iframe.style.display = "none";
    body.appendChild(iframe);
    return formName;
}
exports.addIframe = addIframe;
/**
 * 添加全局Form计数器
 * @return 新增之后的数字
 */
function addFormCalc() {
    var formCalcEle = document.getElementById(FORM_CALC_ID);
    if (formCalcEle) {
        var nowNumber = parseInt(formCalcEle.value);
        formCalcEle.value = (nowNumber +
            1);
        return nowNumber + 1;
    }
    else {
        var input = document.createElement("input");
        input.id = FORM_CALC_ID;
        input.style.display = "none";
        input.value = "1";
        document.body.appendChild(input);
        return 1;
    }
}
exports.addFormCalc = addFormCalc;
/**
 * 去除全局计数器.
 */
function subOneFormCalc() {
    var formCalcEle = document.getElementById(FORM_CALC_ID);
    if (formCalcEle) {
        var nowNumber = parseInt(formCalcEle.value);
        if (nowNumber == 0) {
            document.removeChild(formCalcEle);
            return;
        }
        formCalcEle.value = (nowNumber -
            1);
    }
}
exports.subOneFormCalc = subOneFormCalc;
/**
 * 向页面加入表单.
 * @param params 参数
 * @param formName
 */
function addForm(params, formName) {
    var form = document.createElement("form");
    form.action = params.url;
    form.method = params.method.toUpperCase();
    form.style.display = "none";
    for (var key in params.data) {
        if (key == "crosFlag") {
            continue;
        }
        var input_1 = document.createElement("input");
        input_1.name = key;
        input_1.value = params.data[key];
        form.appendChild(input_1);
    }
    var input = document.createElement("input");
    input.name = "crosFlag";
    input.value = "1";
    form.appendChild(input);
    form.className = exports.FORM_CLASSNAME;
    form.name = formName;
    form.setAttribute(FORM_NAME_SIGN, params.nameSign);
    form.setAttribute("index", addFormCalc().toString());
    form.setAttribute(FORM_REQUEST_TIMEOUT_FLAG, params.timeOut.toString());
    // form.dataset["index"] = addFormCalc().toString();
    document.body.appendChild(form);
}
exports.addForm = addForm;
/**
 * 具体操作.
 */
function operate(errorJudgeFun, formName, isNoFirst) {
    if (errorJudgeFun === void 0) { errorJudgeFun = function () { return true; }; }
    if (isNoFirst === void 0) { isNoFirst = true; }
    return operateForm(errorJudgeFun, formName, isNoFirst);
}
exports.operate = operate;
/**
 * 操作Form跨域表单
 */
function operateForm(errorJudgeFun, formName, isNoFirst, result) {
    if (errorJudgeFun === void 0) { errorJudgeFun = function () { return false; }; }
    if (result === void 0) { result = { length: 0 }; }
    var iframe = document.getElementById(exports.IFRAME_ID);
    if (!iframe) {
        // throw new CrossFormResponseError("未找到访问目标，请刷新页面后重新尝试!");
        return new Promise(function (resolve, reject) {
            reject(utils_1.createCrossResponseError({
                code: "NO_REQUEST_TARGET_IFRAME",
                message: "目标iframe有可能已被删除,请刷新页面后重新尝试"
            }));
        });
    }
    if (document.getElementById(OPERATE_STATE_ID)) {
        if (!isNoFirst) {
            return null;
        }
        else {
            return new Promise(function (resolve, reject) {
                var timeId = setInterval(function () {
                    var promise = operate(errorJudgeFun, formName, false);
                    if (promise == null) {
                        return;
                    }
                    clearInterval(timeId);
                    promise
                        .then(function (value) {
                        resolve(value);
                    })["catch"](function (err) {
                        console.log("内部异常");
                        reject(err);
                    });
                }, 1000);
            });
        }
    }
    var operateStateFlag = document.createElement("div");
    operateStateFlag.style.display = "none";
    operateStateFlag.id = OPERATE_STATE_ID;
    document.body.appendChild(operateStateFlag);
    return crossOperate(formName, iframe, operateStateFlag, result, errorJudgeFun);
}
exports.operateForm = operateForm;
/**
 * 获取表单元素
 * @return 表单元素
 */
function getFormEles(formName) {
    return document.getElementsByName(formName);
}
/**
 * 跨域操作
 * @param formName 表单名称
 * @param iframe iframe
 * @param operateStateFlag 操作状态标识
 * @param result 结果
 * @param errorJudgeFun
 */
function crossOperate(formName, iframe, operateStateFlag, result, errorJudgeFun) {
    var forms = getFormEles(formName);
    var formsLength = forms.length;
    if (formsLength <= 0) {
        document.removeChild(operateStateFlag);
        return null;
    }
    var formsArray = [];
    if (formsLength == 1) {
        forms[0].target = iframe.name;
        formsArray.push(forms[0]);
    }
    else {
        for (var i = 0; i < formsLength; i++) {
            forms[i].target = iframe.name;
            formsArray.push(forms[i]);
        }
        formsArray.sort(function (e1, e2) {
            var e1Num = parseInt(e1.getAttribute("index"));
            var e2Num = parseInt(e2.getAttribute("index"));
            if (e1Num > e2Num) {
                return 1;
            }
            else if (e1Num == e2Num) {
                return 0;
            }
            else {
                return -1;
            }
        });
    }
    return new Promise(function (resolve, reject) {
        var timeId = undefined;
        domExtends_1.elementRemoveEvent(window, "message");
        domExtends_1.elementAddEvent(window, "message", function (e) {
            if (timeId) {
                clearTimeout(timeId);
            }
            var event = e;
            var strData, jsonData;
            var data = event.data;
            if (typeof data === "string") {
                strData = data;
                try {
                    jsonData = JSON.parse(data);
                }
                catch (e) {
                    jsonData = undefined;
                }
            }
            else {
                try {
                    strData = JSON.stringify(data);
                }
                catch (e) {
                    strData = undefined;
                }
                jsonData = data;
            }
            var nameSign = iframe.getAttribute(FORM_NAME_SIGN);
            if (typeof errorJudgeFun === "function") {
                var isErr = errorJudgeFun(jsonData, strData);
                if (isErr) {
                    domExtends_1.removeElementsByName(formName);
                    domExtends_1.elementRemoveEvent(window, "message");
                    document.body.removeChild(document.getElementById(OPERATE_STATE_ID));
                    reject(utils_1.createCrossResponseError({
                        code: "CUSTOM_ERROR",
                        message: "响应数据处理错误！",
                        jsonData: jsonData,
                        strData: strData,
                        errNameSign: nameSign,
                        successLength: result.length,
                        totalOperateLength: formsArray.length + result.length + 1
                    }));
                    return;
                }
            }
            result.length += 1;
            result[nameSign] = {
                name: nameSign,
                data: {
                    jsonData: jsonData,
                    strData: strData
                }
            };
            if (formsArray.length > 0) {
                timeId = formSubmit(iframe, formsArray, result.length, reject);
            }
            else {
                domExtends_1.elementRemoveEvent(window, "message");
                document.body.removeChild(document.getElementById(OPERATE_STATE_ID));
                resolve(result);
            }
        });
        timeId = formSubmit(iframe, formsArray, 0, reject);
    });
}
/**
 * 表单提交
 * @param iframe iframe
 * @param formsArray 一次性要请求的表单数据
 * @param resultLength 结果长度
 * @param reject 错误回调
 */
var formSubmit = function (iframe, formsArray, resultLength, reject) {
    var form = formsArray.splice(0, 1);
    var nameSign = form[0].getAttribute(FORM_NAME_SIGN);
    var strTimeOut = form[0].getAttribute(FORM_REQUEST_TIMEOUT_FLAG);
    var formName = form[0].name;
    var numberTimeOut;
    try {
        numberTimeOut = parseInt(strTimeOut);
    }
    catch (e) {
        numberTimeOut = 5000;
    }
    var timeOutId = startTimeOut(numberTimeOut, formName, nameSign, resultLength, resultLength + formsArray.length + 1, reject);
    iframe.setAttribute(FORM_NAME_SIGN, nameSign);
    form[0].submit();
    document.body.removeChild(form[0]);
    return timeOutId;
};
/**
 * 开启定时器
 * @param timeOut 超时事件
 * @param formName 表单名称
 * @param nameSign 调用函数签名
 * @param successLength 成功的长度
 * @param totalOperateLength 一共要执行的长度
 * @param reject 错误回调
 */
var startTimeOut = function (timeOut, formName, nameSign, successLength, totalOperateLength, reject) {
    if (timeOut <= 0) {
        return;
    }
    var timeOutId = setTimeout(function () {
        clearTimeout(timeOutId);
        domExtends_1.removeElementsByName(formName);
        domExtends_1.elementRemoveEvent(window, "message");
        document.body.removeChild(document.getElementById(OPERATE_STATE_ID));
        // reject(createCrossResponseError({
        //     code: "REQUEST_TIMEOUT",
        //     message: "客户端访问超时",
        //     msg: "客户端访问超时",
        //     errNameSign: nameSign,
        //     successLength,
        //     totalOperateLength
        // }))
        var jsonData = {
            code: "REQUEST_TIMEOUT",
            msg: "客户端访问超时"
        };
        reject(utils_1.createCrossResponseError({
            code: jsonData.code,
            message: jsonData.msg,
            errNameSign: nameSign,
            strData: JSON.stringify(jsonData),
            jsonData: jsonData,
            successLength: successLength,
            totalOperateLength: totalOperateLength
        }));
    }, timeOut);
    return timeOutId;
};
