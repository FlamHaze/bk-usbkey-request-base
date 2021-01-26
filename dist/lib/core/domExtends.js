"use strict";
exports.__esModule = true;
exports.removeElementsByName = exports.elementRemoveEvent = exports.elementAddEvent = exports.getElementsByClassName = void 0;
/**
 * Ie不支持通过className获取标签,以此扩展.
 * @param className className
 */
function getElementsByClassName(className) {
    var eles = document.getElementsByTagName("*");
    var eleLength = eles.length;
    var elements = [];
    for (var i = 0; i < eleLength; i++) {
        var oCls = eles[i].className || "";
        if (oCls.indexOf(className) < 0) {
            continue;
        }
        var oClsArr = oCls.split(/\s+/);
        var oClsArrLength = oClsArr.length;
        for (var j = 0; j < oClsArrLength; j++) {
            if (className == oClsArr[j]) {
                elements.push(eles[i]);
            }
        }
    }
    return elements;
}
exports.getElementsByClassName = getElementsByClassName;
/**
 * 添加事件,兼容IE
 * @param ele 元素
 * @param eventName 事件名称,不带on
 * @param handle 处理函数
 */
function elementAddEvent(ele, eventName, handle) {
    // @ts-ignore
    if (!ele.saveEventHandle) {
        // @ts-ignore
        ele.saveEventHandle = [];
    }
    // @ts-ignore
    ele.saveEventHandle[eventName] = handle;
    // @ts-ignore
    if (window.addEventListener) {
        // @ts-ignore
        ele.addEventListener(eventName, ele.saveEventHandle[eventName], false);
        // @ts-ignore
    }
    else if (window.attachEvent) {
        // @ts-ignore
        ele.attachEvent("on" + eventName, ele.saveEventHandle[eventName]);
    }
    else {
        // @ts-ignore
        ele["on" + eventName] = ele.saveEventHandle[eventName];
    }
}
exports.elementAddEvent = elementAddEvent;
/**
 * 解除事件,要解除的事件必须通过elementAddEvent进行绑定
 * @param ele 元素
 * @param event 事件名称
 */
function elementRemoveEvent(ele, event) {
    // @ts-ignore
    var handle = ele.saveEventHandle ? ele.saveEventHandle[event] : undefined;
    if (!handle) {
        return;
    }
    // @ts-ignore
    if (window.addEventListener) {
        ele.removeEventListener(event, handle, false);
        // @ts-ignore
    }
    else if (window.detachEvent) {
        // @ts-ignore
        ele.detachEvent("on" + event, handle);
    }
    else {
        // @ts-ignore
        ele["on" + event] = "";
    }
}
exports.elementRemoveEvent = elementRemoveEvent;
/**
 * 通过元素名称移除元素
 * @param name 名称
 */
function removeElementsByName(name) {
    var forms = document.getElementsByName(name);
    for (var i = forms.length - 1; i >= 0; i--) {
        try {
            document.body.removeChild(forms[i]);
        }
        catch (e) { }
    }
}
exports.removeElementsByName = removeElementsByName;
