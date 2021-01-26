declare type CrossRequestType = 'GET' | 'get' | 'POST' | 'post';
/**
 * 跨域发送数据
 */
export interface CrossSendData {
    url: string;
    nameSign: string;
    timeOut?: number;
    data?: any;
    method?: CrossRequestType;
}
/**
 * 跨域返响应数据
 */
export interface CrossResponseData {
    jsonData: object | undefined;
    strData: string | undefined;
}
/**
 * 响应数据异常.
 */
export interface CrossResponseError {
    isErr: boolean;
    code: string | number;
    msg: string;
    nameSign: string;
    data?: any;
}
/**
 * 跨域请求响应
 */
export interface CrossResponse {
    name: string;
    data: CrossResponseData;
    err?: CrossResponseError;
}
/**
 * 跨域响应Map
 */
export interface CrossResponseMap<T> {
    length: number;
    [name: string]: T | number;
}
/**
 * 响应异常
 */
export interface CrossResponseErr {
    code: string | number;
    message: string;
    errNameSign?: string;
    jsonData?: any;
    strData?: any;
    successLength?: number;
    totalOperateLength?: number;
    msg?: string;
}
export {};
