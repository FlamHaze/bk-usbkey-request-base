博雅中科Usbkey服务对应的js调用方式，主要解决跨域问题并为集成客户端提供简单可靠的调用方式， 此库为请求解决的基础调用库.

# 目录

<a href="#d1">安装</a>

<a href="#d2">示例</a>

<a href="#d3">API简介</a>

<a href="#d4">使用技巧</a>

<a href="#d5">其他</a>

# <div id="d1">安装</div>

### 浏览器中使用

```html
<script src="https://raw.githubusercontent.com/SuLinXin66/bk-usbkey-request-base/master/dist/bk-usbkey-request-base-iife-1.0.0.min.js"></script>
```

<font color=red>**注: 因本库采用es6 Promise对象, 如果要兼容IE系列浏览器请引用如下js来支持Promise对象**</font>

```html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.js"></script>
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script> 
<script src="https://raw.githubusercontent.com/SuLinXin66/bk-usbkey-request-base/master/dist/bk-usbkey-request-base-iife-1.0.0.min.js"></script>
```

###  npm中使用

```js
npm install --save bk-usbkey-request-base
```



### yarn中使用

```js
yarn add bk-usbkey-request-base
```



# <div id="d2">示例</div>

## 浏览器中使用示例

```html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.js"></script>
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script> 
<script src="https://raw.githubusercontent.com/SuLinXin66/bk-usbkey-request-base/master/dist/bk-usbkey-request-base-iife-1.0.0.min.js"></script>
<script>
  bkUsbkeyReqBase([
    {
      url: "https://127.0.0.1:8000/api/EPSAPP_Initialize",   
      data: {
        crosFlag: 1
      },
      nameSign: "test1",
      timeOut: 3000
    }
  ]).catch(function (err) {
    console.log(err);
  });
</script>
```



## CommonJS规范中使用

```javascript
const bkUsbkeyReqBase = require('bk-usbkey-request-base').default;
bkUsbkeyReqBase([
  {
    url: "https://127.0.0.1:8000/api/EPSAPP_Initialize",   
    data: {
      crosFlag: 1
     },
    nameSign: "test1",
    timeOut: 3000
  }
]).then(data=>{
  console.log(data);
}).catch(e=>{
  console.log("出错了 => ", e.message);
})
```



## ES6规范中使用

```javascript
import bkUsbkeyReqBase from "bk-usbkey-request-base"; 
bkUsbkeyReqBase([
  {
    url: "https://127.0.0.1:8000/api/EPSAPP_Initialize",   
    data: {
      crosFlag: 1
     },
    nameSign: "test1",
    timeOut: 3000
  }
]).then(data=>{
  console.log(data);
}).catch(e=>{
  console.log("出错了 => ", e.message);
})
```



# <div id="d3">API简介</div>

## 请求方法

```typescript
bkUsbkeyReqBase (params: CrossSendData | Array<CrossSendData>, errorJudgeFun?: (jsonData: any, strData: string) => boolean): Promise<CrossResponseMap<CrossResponse>> | null;
```

方法参数:
	params: 请求参数
	errorJudgeFun?: 错误判断方法, 传入usbkey响应数据，返回是否有错
方法返回值:
	请求结果
发起请求到usbkey本地服务, 请求参数`CrossSendData`请参考<a href="#d3_param">请求参数</a>, 返回参数`CrossResponse`请参考<a href="#d3_return">返回参数</a>



## <div id="d3_param">请求参数</div>

### CrossRequestType

```typescript
// 请求方式
type CrossRequestType = 'GET' | 'get' | 'POST' | 'post';
```


### CrossSendData

```typescript
// 请求发送数据
interface CrossSendData {
  // 请求地址, 必选
  url: string;
  // 方法签名, 请求响应之后，从响应结果集中根据nameSign的值进行获取对应结果, 必选
	nameSign: string;
  // 超时时间, 默认5000(5s), 配置小于或者等于0则永不超时, 可选
  timeOut?: number;
  // 请求方式, 默认为post, 可选
  method?: CrossRequestType;
}
```



## <div id="d3_return">响应参数</div>

### CrossResponseMap

```typescript
// 响应结果集
interface CrossResponseMap<CrossResponse> {
  	// 集合长度
    length: number;
		// 集合内操作的方法签名(请求时传入的nameSign): 响应内容
    [name: string]: CrossResponse;
}
```



### CrossResponse

```typescript
// 响应结果
interface CrossResponse {
    // 请求时填写的nameSign
    name: string;
    // 响应的具体内容数据
    data: CrossResponseData;
}
```



### CrossResponseData

```typescript
// 响应的具体数据
interface CrossResponseData {
    // 试图将返回结果转换为一个对象, 如果转换失败，此项为 undefined
    jsonData: object | undefined
    // 响应的原始数据
    strData: string | undefined
}
```



## 异常

### CrossResponseErr

```typescript
// 当响应处理错误时的错误数据
interface CrossResponseErr {
    // 错误编码
    code: string | number;
    // 消息
    message: string;
    // 错误的方法签名
    errNameSign?: string;
    // 错误的Json数据
    jsonData?: any;
    // 错误的strData
    strData?: any;
    // 成功的条数
    successLength?: number;
    // 总共操作的条数
    totalOperateLength?: number;
    // 错误消息
    msg?: string;
}
```



# <div id="d4">使用技巧</div>

## 使用async/await

```typescript
import bkUsbkeyReqBase from "bk-usbkey-request-base"; 
async function test(){
  try {
    const getCertResult = await bkUsbkeyReqBase({
      url: "http://127.0.0.1/test/getCert",
      nameSign: "getCert"
    })
    
    const certInfo = getCertResult["getCert"].data.jsonData.result;
    
    const certInfoResult = await bkUsbkeyReqBase([
      {
        url: "http://127.0.0.1/test/getCertInfoByNo",
        nameSign: "certNo",
        data: {
          certNo: 1
        }
      },
      {
        url: "http://127.0.0.1/test/getCertInfoByNo",
        nameSign: "certStartTime",
        data: {
          certNo: 21
        }
      },
      {
        url: "http://127.0.0.1/test/getCertInfoByNo",
        nameSign: "certEndTime",
        data: {
          certNo: 22
        }
      },
    ])
    
    const certNo = certInfoResult["certNo"].data.jsonData.result;
    
    const certStartTime = certInfoResult["certStartTime"].data.jsonData.result;
    
    const certEndTime = certInfoResult["certEndTime"].data.jsonData.result;
    
    console.log("证书数据 => ", certInfo);
    console.log("证书序列号 => ", certNo);
    console.log("证书有效期，开始时间 => ", certStartTime);
    console.log("证书有效期，结束时间 => ", certEndTime);
  } catch(e) {}
}
```



# <div id="d5">其他</div>

<a href="https://sulinxin66.github.io/bk-usbkey-request-base-base/">API文档</a>

