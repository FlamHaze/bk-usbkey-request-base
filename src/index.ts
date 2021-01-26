import {CrossResponse, CrossResponseMap, CrossSendData} from "./types";
import {addForm, addIframe, operate} from "./core/domUtils";
import {createCrossResponseError} from "./core/error/utils";
import {removeElementsByName} from "./core/domExtends";

/**
 * 对外暴露入口
 * @param params 请求参数
 * @param errorJudgeFun 错误回调
 */
export default function (params: CrossSendData | Array<CrossSendData>, errorJudgeFun?: (jsonData: any, strData: string) => boolean): Promise<CrossResponseMap<CrossResponse>> | null {
    const formName = addIframe();
    if (params instanceof Array) {
        for (let i = 0; i < params.length; i++) {
            const returnErr = addOneForm(params[i], formName);
            if (returnErr) {
                return returnErr;
            }
        }   
    } else {
        const returnErr = addOneForm(params, formName);
        if (returnErr) {
            return returnErr;
        }
    }
    return operate(errorJudgeFun, formName);
}

/**
 * 添加一个表单
 * @param param 参数
 * @param formName 表单名称
 */
const addOneForm = function (param: CrossSendData, formName: string): Promise<CrossResponseMap<CrossResponse>> | undefined {
    if (!param.nameSign) {
        removeElementsByName(formName);
        return new Promise<CrossResponseMap<CrossResponse>>((resolve, reject) => {
            reject(createCrossResponseError({
                code: "ERR_nameSign",
                message: "未找到正确的方法签名"
            }))
        })
    }
    param.method = param.method || "post";
    param.timeOut = param.timeOut || 5000;
    addForm(param, formName);
    return;
};