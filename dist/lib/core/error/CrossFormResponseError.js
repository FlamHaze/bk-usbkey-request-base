"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var CrossFormResponseError = /** @class */ (function (_super) {
    __extends(CrossFormResponseError, _super);
    function CrossFormResponseError(err) {
        var _this = _super.call(this, err.message) || this;
        _this.name = "CrossFormRequestSendError";
        _this.code = err.code;
        _this.errNameSign = err.errNameSign;
        _this.successLength = err.successLength;
        _this.totalOperateLength = err.totalOperateLength;
        _this.jsonData = err.jsonData;
        _this.strData = err.strData;
        return _this;
        // 解决this指向为当前
        // Object.setPrototypeOf(this, CrossFormResponseError.prototype);
    }
    return CrossFormResponseError;
}(Error));
exports["default"] = CrossFormResponseError;
