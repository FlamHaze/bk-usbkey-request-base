<template>
  <div id="app">
    <button @click="send">点击触发</button>
  </div>
</template>

<script>
import bkUsbkeyReqBase from "@byzk/usbkey-request-base"; 
export default {
  name: 'App',
  components: {
  },
  methods:{
    send(){
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
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
