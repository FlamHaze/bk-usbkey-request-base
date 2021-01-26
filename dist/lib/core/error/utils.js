"use strict";
exports.__esModule = true;
exports.createCrossResponseError = void 0;
var CrossFormResponseError_1 = require("./CrossFormResponseError");
function createCrossResponseError(err) {
    return new CrossFormResponseError_1["default"](err);
}
exports.createCrossResponseError = createCrossResponseError;
