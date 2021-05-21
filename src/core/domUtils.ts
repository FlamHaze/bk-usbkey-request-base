import { CrossResponse, CrossResponseMap, CrossSendData } from "../types";
import {
  elementAddEvent,
  elementRemoveEvent,
  getElementsByClassName,
  removeElementsByName,
} from "./domExtends";
import { createCrossResponseError } from "./error/utils";

/**
 * 跨域请求表单计数器.
 */
const FORM_CALC_ID = "BK_CROSS_FORM_REQUEST_FORM_CALC_ID";

/**
 * 操作状态ID.
 */
const OPERATE_STATE_ID = "BK_CROSS_FORM_REQUEST_FORM_OPERATE_STATE_ID";

/**
 * iframeId
 */
export const IFRAME_ID = "BK_CROSS_FORM_REQUEST_IFRAME_ID";

/**
 * iframeName
 */
export const IFRAME_NAME = "BK_CROSS_FORM_REQUEST_IFRAME_NAME";

/**
 * 跨域表单Class
 */
export const FORM_CLASSNAME = "BK_CROSS_FORM_REQUEST_FORM_CLASSNAME";

/**
 * 跨域表单名称
 */
export const FORM_NAME_PRE = "BK_CROSS_FORM_REQUEST_FORM_NAME";

/**
 * 跨域表单方法签名key
 */
const FORM_NAME_SIGN = "name-sign";

const FORM_REQUEST_TIMEOUT_FLAG =
  "BK_CROSS_FORM_REQUEST_FORM_REQUEST_TIMEOUT_FLAG";

/**
 * 添加iframe
 */
export function addIframe(): string {
  let formName: string;
  const formCalcEle = document.getElementById(FORM_CALC_ID);
  if (formCalcEle) {
    const nowNumber = parseInt(
      (formCalcEle as unknown as HTMLInputElement).value
    );
    formName = `${FORM_NAME_PRE}${nowNumber}`;
  } else {
    formName = `${FORM_NAME_PRE}0`;
  }

  if (document.getElementById(IFRAME_ID)) {
    return formName;
  }

  const { body } = document;
  let iframe: HTMLIFrameElement = createElement("iframe", IFRAME_NAME);
  iframe.id = IFRAME_ID;
  iframe.name = IFRAME_NAME;
  iframe.style.display = "none";
  body.appendChild(iframe);
  return formName;
}

/**
 * 添加全局Form计数器
 * @return 新增之后的数字
 */
export function addFormCalc(): number {
  const formCalcEle = document.getElementById(FORM_CALC_ID);
  if (formCalcEle) {
    const nowNumber = parseInt(
      (formCalcEle as unknown as HTMLInputElement).value
    );
    (formCalcEle as unknown as HTMLInputElement).value = (nowNumber +
      1) as unknown as string;
    return nowNumber + 1;
  } else {
    const input = document.createElement("input");
    input.id = FORM_CALC_ID;
    input.style.display = "none";
    input.value = "1";
    document.body.appendChild(input);
    return 1;
  }
}

/**
 * 去除全局计数器.
 */
export function subOneFormCalc() {
  const formCalcEle = document.getElementById(FORM_CALC_ID);
  if (formCalcEle) {
    const nowNumber = parseInt(
      (formCalcEle as unknown as HTMLInputElement).value
    );
    if (nowNumber == 0) {
      document.body.removeChild(formCalcEle);
      return;
    }
    (formCalcEle as unknown as HTMLInputElement).value = (nowNumber -
      1) as unknown as string;
  }
}

/**
 * 向页面加入表单.
 * @param params 参数
 * @param formName
 */
export function addForm(params: CrossSendData, formName: string) {
  const form: HTMLFormElement = createElement("form", formName);

  form.action = params.url;
  form.method = (params.method as string).toUpperCase();
  form.style.display = "none";

  for (let key in params.data) {
    if (key == "crosFlag") {
      continue;
    }
    const input: HTMLInputElement = createElement("input", key);
    input.name = key;
    input.value = params.data[key];
    form.appendChild(input);
  }

  const input: HTMLInputElement = createElement("input", "crosFlag");
  input.name = "crosFlag";
  input.value = "1";
  form.appendChild(input);

  form.className = FORM_CLASSNAME;
  form.name = formName;
  form.setAttribute(FORM_NAME_SIGN, params.nameSign);
  form.setAttribute("index", addFormCalc().toString());
  form.setAttribute(
    FORM_REQUEST_TIMEOUT_FLAG,
    (params.timeOut as number).toString()
  );
  // form.dataset["index"] = addFormCalc().toString();
  document.body.appendChild(form);
}

/**
 * 具体操作.
 */
export function operate(
  errorJudgeFun: (jsonData: any, strData: string) => boolean = () => false,
  formName: string,
  isNoFirst: boolean = true
): Promise<CrossResponseMap<CrossResponse>> | null {
  return operateForm(errorJudgeFun, formName, isNoFirst);
}

/**
 * 操作Form跨域表单
 */
export function operateForm(
  errorJudgeFun: (jsonData: any, strData: string) => boolean = () => false,
  formName: string,
  isNoFirst: boolean,
  result: CrossResponseMap<CrossResponse> = { length: 0 }
): Promise<CrossResponseMap<CrossResponse>> | null {
  const iframe = document.getElementById(IFRAME_ID);
  if (!iframe) {
    // throw new CrossFormResponseError("未找到访问目标，请刷新页面后重新尝试!");
    return new Promise<CrossResponseMap<CrossResponse>>((resolve, reject) => {
      reject(
        createCrossResponseError({
          code: "NO_REQUEST_TARGET_IFRAME",
          message: "目标iframe有可能已被删除,请刷新页面后重新尝试",
        })
      );
    });
  }

  if (document.getElementById(OPERATE_STATE_ID)) {
    if (!isNoFirst) {
      return null;
    } else {
      return new Promise<CrossResponseMap<CrossResponse>>((resolve, reject) => {
        const timeId = setInterval(() => {
          const promise = operate(errorJudgeFun, formName, false);
          if (promise == null) {
            return;
          }
          clearInterval(timeId);
          promise
            .then((value) => {
              resolve(value);
            })
            .catch((err) => {
              console.log("内部异常");
              reject(err);
            });
        }, 1000);
      });
    }
  }

  const operateStateFlag = document.createElement("div");
  operateStateFlag.style.display = "none";
  operateStateFlag.id = OPERATE_STATE_ID;
  document.body.appendChild(operateStateFlag);

  return crossOperate(
    formName,
    iframe as unknown as HTMLIFrameElement,
    operateStateFlag,
    result,
    errorJudgeFun
  );
}

/**
 * 获取表单元素
 * @return 表单元素
 */
function getFormEles(formName: string): any {
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
function crossOperate(
  formName: string,
  iframe: HTMLIFrameElement,
  operateStateFlag: HTMLDivElement,
  result: CrossResponseMap<CrossResponse>,
  errorJudgeFun?: (jsonData: any, strData: string) => boolean
): Promise<CrossResponseMap<CrossResponse>> | null {
  const forms = getFormEles(formName);

  const formsLength = forms.length;
  if (formsLength <= 0) {
    document.body.removeChild(operateStateFlag);
    return null;
  }

  const formsArray: Array<HTMLFormElement> = [];
  if (formsLength == 1) {
    (forms[0] as HTMLFormElement).target = iframe.name;
    formsArray.push(forms[0]);
  } else {
    for (let i = 0; i < formsLength; i++) {
      (forms[i] as HTMLFormElement).target = iframe.name;
      formsArray.push(forms[i] as HTMLFormElement);
    }
    formsArray.sort((e1, e2) => {
      const e1Num = parseInt(
        (e1 as unknown as HTMLFormElement).getAttribute("index") as string
      );
      const e2Num = parseInt(
        (e2 as unknown as HTMLFormElement).getAttribute("index") as string
      );

      if (e1Num > e2Num) {
        return 1;
      } else if (e1Num == e2Num) {
        return 0;
      } else {
        return -1;
      }
    });
  }

  return new Promise<CrossResponseMap<CrossResponse>>((resolve, reject) => {
    let timeId: any = undefined;
    elementRemoveEvent(window, "message");
    elementAddEvent(window, "message", (e) => {
      if (timeId) {
        clearTimeout(timeId);
      }
      const event = e as MessageEvent;
      let strData: string | undefined, jsonData: object | undefined;
      const { data } = event;
      if (typeof data === "string") {
        strData = data;
        try {
          jsonData = JSON.parse(data);
        } catch (e) {
          jsonData = undefined;
        }
      } else {
        try {
          strData = JSON.stringify(data);
        } catch (e) {
          strData = undefined;
        }
        jsonData = data;
      }
      const nameSign = iframe.getAttribute(FORM_NAME_SIGN) as string;

      if (typeof errorJudgeFun === "function") {
        const isErr = errorJudgeFun(jsonData, strData as string);
        if (isErr) {
          removeElementsByName(formName);
          elementRemoveEvent(window, "message");
          document.body.removeChild(
            document.getElementById(OPERATE_STATE_ID) as Node
          );
          reject(
            createCrossResponseError({
              code: "CUSTOM_ERROR",
              message: "响应数据处理错误！",
              jsonData,
              strData,
              errNameSign: nameSign,
              successLength: result.length,
              totalOperateLength: formsArray.length + result.length + 1,
            })
          );
          return;
        }
      }
      result.length += 1;
      result[nameSign] = {
        name: nameSign,
        data: {
          jsonData: jsonData,
          strData: strData,
        },
      };
      if (formsArray.length > 0) {
        timeId = formSubmit(iframe, formsArray, result.length, reject);
      } else {
        elementRemoveEvent(window, "message");
        document.body.removeChild(
          document.getElementById(OPERATE_STATE_ID) as Node
        );
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
const formSubmit = function (
  iframe: HTMLIFrameElement,
  formsArray: Array<HTMLFormElement>,
  resultLength: number,
  reject: (response?: any) => void
): any {
  const form = formsArray.splice(0, 1);
  const nameSign = form[0].getAttribute(FORM_NAME_SIGN) as string;
  const strTimeOut: string = form[0].getAttribute(
    FORM_REQUEST_TIMEOUT_FLAG
  ) as string;
  const formName = form[0].name;

  let numberTimeOut;
  try {
    numberTimeOut = parseInt(strTimeOut);
  } catch (e) {
    numberTimeOut = 5000;
  }

  const timeOutId = startTimeOut(
    numberTimeOut,
    formName,
    nameSign,
    resultLength,
    resultLength + formsArray.length + 1,
    reject
  );
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
const startTimeOut = function (
  timeOut: number,
  formName: string,
  nameSign: string,
  successLength: number,
  totalOperateLength: number,
  reject: (response?: any) => void
): any {
  if (timeOut <= 0) {
    return;
  }
  const timeOutId = setTimeout(() => {
    clearTimeout(timeOutId);
    removeElementsByName(formName);
    elementRemoveEvent(window, "message");
    document.body.removeChild(
      document.getElementById(OPERATE_STATE_ID) as Node
    );
    // reject(createCrossResponseError({
    //     code: "REQUEST_TIMEOUT",
    //     message: "客户端访问超时",
    //     msg: "客户端访问超时",
    //     errNameSign: nameSign,
    //     successLength,
    //     totalOperateLength
    // }))
    let jsonData = {
      code: "REQUEST_TIMEOUT",
      msg: "客户端访问超时",
    };
    reject(
      createCrossResponseError({
        code: jsonData.code,
        message: jsonData.msg,
        errNameSign: nameSign,
        strData: JSON.stringify(jsonData),
        jsonData: jsonData,
        successLength: successLength,
        totalOperateLength: totalOperateLength,
      })
    );
  }, timeOut);
  return timeOutId;
};

function isIE() {
  var DEFAULT_VERSION = 8.0;
  var ua:any = navigator.userAgent.toLowerCase();
  var isIE = ua.indexOf("msie") > -1;
  var safariVersion;
  if (isIE) {
    safariVersion = ua.match(/msie ([\d.]+)/)[1];
  }
  if (safariVersion <= DEFAULT_VERSION) {
   return true
  }

  return false
}

function createElement(targetName: string, name: string): any {
  if (isIE()) {
    return document.createElement(
      `<${targetName} name="${name}"></${targetName}>`
    );
  }
  return document.createElement(targetName);
}
