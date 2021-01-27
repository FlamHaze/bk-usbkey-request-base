type CrossRequestType = 'GET' | 'get' | 'POST' | 'post';

/**
 * 跨域发送数据
 */
export interface CrossSendData {
    // url
    url: string
    // 方法名称签名·
    nameSign: string
    // 超时时间
    timeOut?: number
    // 参数
    data?: any
    //访问方式
    method?: CrossRequestType
}

/**
 * 跨域返响应数据
 */
export interface CrossResponseData {
    jsonData: object | undefined
    strData: string | undefined
}

/**
 * 响应数据异常.
 */
export interface CrossResponseError {
    isErr: boolean
    code: string | number
    msg: string,
    nameSign: string
    data?: any
}

/**
 * 跨域请求响应
 */
export interface CrossResponse {
    name: string
    data: CrossResponseData
    err?: CrossResponseError
}

/**
 * 跨域响应Map
 */
export interface CrossResponseMap<T> {

    length: number

    [name: string]: T | number
}

/**
 * 响应异常
 */
export interface CrossResponseErr {
    // 错误编码
    code: string | number
    // 消息
    message: string
    // 错误的方法签名
    errNameSign?: string
    // 错误的Json数据
    jsonData?: any
    // 错误的strData
    strData?: any
    // 成功的条数
    successLength?: number
    // 总共操作的条数
    totalOperateLength?: number,
    // 错误消息
    msg?: string
}