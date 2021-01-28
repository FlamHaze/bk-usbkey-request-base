import logo from './logo.svg';
import './App.css';
import bkUsbkeyReqBase from "@byzk/usbkey-request-base"; 

function App() {
  return (
    <div className="App">
      <button onClick={()=>{
        bkUsbkeyReqBase([
          {
            url: "https://127.0.0.1:48003/dzht/GetCertInfo",   
            data: {
              crosFlag: 1,
              index:1
            },
            nameSign: "GetCertInfo",
          },
          {
            url: "https://127.0.0.1:48003/dzht/GetUsbKeyCert",   
            data: {
              crosFlag: 1,
              dwCertNum:2,
              keyType:4
            },
            nameSign: "GetUsbKeyCert",
          },
        ]).then(data=>{
          console.log(data);
          alert('证书序列号:'+data.GetCertInfo.data.jsonData.ItemInfo)
          alert('证书信息:'+data.GetUsbKeyCert.data.jsonData.cert)
        }).catch(e=>{
          alert("出错了 => " + e.message);
        })
      }}>点我触发</button>
    </div>
  );
}

export default App;
