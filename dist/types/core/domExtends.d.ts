/**
 * Ie不支持通过className获取标签,以此扩展.
 * @param className className
 */
export declare function getElementsByClassName(className: string): Array<HTMLElement>;
/**
 * 添加事件,兼容IE
 * @param ele 元素
 * @param eventName 事件名称,不带on
 * @param handle 处理函数
 */
export declare function elementAddEvent(ele: HTMLElement | Window | Document, eventName: string, handle: (e?: Event) => void): void;
/**
 * 解除事件,要解除的事件必须通过elementAddEvent进行绑定
 * @param ele 元素
 * @param event 事件名称
 */
export declare function elementRemoveEvent(ele: HTMLElement | Window | Document, event: string): void;
/**
 * 通过元素名称移除元素
 * @param name 名称
 */
export declare function removeElementsByName(name: string): void;
