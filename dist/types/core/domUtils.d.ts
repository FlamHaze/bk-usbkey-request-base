import { CrossResponse, CrossResponseMap, CrossSendData } from "../types";
/**
 * iframeId
 */
export declare const IFRAME_ID = "BK_CROSS_FORM_REQUEST_IFRAME_ID";
/**
 * iframeName
 */
export declare const IFRAME_NAME = "BK_CROSS_FORM_REQUEST_IFRAME_NAME";
/**
 * 跨域表单Class
 */
export declare const FORM_CLASSNAME = "BK_CROSS_FORM_REQUEST_FORM_CLASSNAME";
/**
 * 跨域表单名称
 */
export declare const FORM_NAME_PRE = "BK_CROSS_FORM_REQUEST_FORM_NAME";
/**
 * 添加iframe
 */
export declare function addIframe(): string;
/**
 * 添加全局Form计数器
 * @return 新增之后的数字
 */
export declare function addFormCalc(): number;
/**
 * 去除全局计数器.
 */
export declare function subOneFormCalc(): void;
/**
 * 向页面加入表单.
 * @param params 参数
 * @param formName
 */
export declare function addForm(params: CrossSendData, formName: string): void;
/**
 * 具体操作.
 */
export declare function operate(errorJudgeFun: ((jsonData: any, strData: string) => boolean) | undefined, formName: string, isNoFirst?: boolean): Promise<CrossResponseMap<CrossResponse>> | null;
/**
 * 操作Form跨域表单
 */
export declare function operateForm(errorJudgeFun: ((jsonData: any, strData: string) => boolean) | undefined, formName: string, isNoFirst: boolean, result?: CrossResponseMap<CrossResponse>): Promise<CrossResponseMap<CrossResponse>> | null;
