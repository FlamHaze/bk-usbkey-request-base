/**
 * Ie不支持通过className获取标签,以此扩展.
 * @param className className
 */
export function getElementsByClassName(className: string): Array<HTMLElement> {
  const eles = document.getElementsByTagName("*");
  const eleLength = eles.length;
  const elements: Array<HTMLElement> = [];

  for (let i = 0; i < eleLength; i++) {
    const oCls = eles[i].className || "";
    if (oCls.indexOf(className) < 0) {
      continue;
    }

    const oClsArr = oCls.split(/\s+/);
    const oClsArrLength = oClsArr.length;
    for (let j = 0; j < oClsArrLength; j++) {
      if (className == oClsArr[j]) {
        elements.push(eles[i] as HTMLElement);
      }
    }
  }
  return elements;
}

/**
 * 添加事件,兼容IE
 * @param ele 元素
 * @param eventName 事件名称,不带on
 * @param handle 处理函数
 */
export function elementAddEvent(
  ele: HTMLElement | Window | Document,
  eventName: string,
  handle: (e?: Event) => void
) {
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
  } else if (window.attachEvent) {
    // @ts-ignore
    ele.attachEvent(`on${eventName}`, ele.saveEventHandle[eventName]);
  } else {
    // @ts-ignore
    ele[`on${eventName}`] = ele.saveEventHandle[eventName];
  }
}

/**
 * 解除事件,要解除的事件必须通过elementAddEvent进行绑定
 * @param ele 元素
 * @param event 事件名称
 */
export function elementRemoveEvent(
  ele: HTMLElement | Window | Document,
  event: string
) {
  // @ts-ignore
  const handle = ele.saveEventHandle ? ele.saveEventHandle[event] : undefined;
  if (!handle) {
    return;
  }

  // @ts-ignore
  if (window.addEventListener) {
    ele.removeEventListener(event, handle, false);
    // @ts-ignore
  } else if (window.detachEvent) {
    // @ts-ignore
    ele.detachEvent(`on${event}`, handle);
  } else {
    // @ts-ignore
    ele[`on${event}`] = "";
  }
}

/**
 * 通过元素名称移除元素
 * @param name 名称
 */
export function removeElementsByName(name: string): void {
  const forms = document.getElementsByName(name);
  for (let i = forms.length - 1; i >= 0; i--) {
    try {
      document.body.removeChild(forms[i]);
    } catch (e) {}
  }
}
