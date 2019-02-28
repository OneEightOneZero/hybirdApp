<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h1>{{title}}</h1>
    <button class="btn" @click="testAjax">测试AJAX(axios)</button>
    <button class="btn" @click="testCamera">打开摄像头</button>
    <button class="btn" @click="getLocation">获取定位信息</button>
    <button class="btn" @click="findContact">获取联系人方式</button>
    <button class="btn" @click="sendMessage">发送短信</button>
    <p class="btn">{{text}}</p>
    <button class="btn" @click="startRecognize">语音识别</button>
    <button class="btn" @click="pay('alipay')">支付</button>
    <img v-for="(img,index) in imgs" :key="index" :src="img">
    <input @change="upload" class="btn" style="width:400px" type="file" id="file" name="logo">
    <p>
      For a guide and recipes on how to configure / customize this project,
      <br>check out the
      <a
        href="https://cli.vuejs.org"
        target="_blank"
        rel="noopener"
      >vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
          target="_blank"
          rel="noopener"
        >babel</a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
          target="_blank"
          rel="noopener"
        >eslint</a>
      </li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>
      </li>
      <li>
        <a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a>
      </li>
      <li>
        <a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a>
      </li>
      <li>
        <a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a>
      </li>
      <li>
        <a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a>
      </li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li>
        <a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a>
      </li>
      <li>
        <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-devtools#vue-devtools"
          target="_blank"
          rel="noopener"
        >vue-devtools</a>
      </li>
      <li>
        <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a>
      </li>
      <li>
        <a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { camera } from "../plus/camera.js";
import { setInterval } from "timers";
export default {
  name: "HelloWorld",
  data() {
    return {
      title: "hi, express",
      text: "开始语音识别...",
      imgs: [
        "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3633976638,143512992&fm=200&gp=0.jpg"
      ]
    };
  },
  props: {
    msg: String
  },
  methods: {
    async testAjax() {
      let { data } = await axios.get("http://10.3.143.122:7001/");
      this.title = data;
    },
    testCamera() {
      var self = this;
      console.log("打开摄像头");
      if (plus) {
        // 获取摄像头对象
        var cmr = plus.camera.getCamera();
        // 摄像头对象用最高的分辨率
        var res = cmr.supportedImageResolutions[0];
        // 拍照后导出图片的格式
        var fmt = cmr.supportedImageFormats[1];
        console.log("Resolution: " + res + ", Format: " + fmt);
        // 进行拍照的操作
        cmr.captureImage(
          function(path) {
            console.log("Capture image success: " + path);
            var url = plus.io.convertLocalFileSystemURL(path);
            console.log(url);
            self.imgs.push(url);
            // plus自带的上传方法
            self.createUpload(url);
          },
          function(error) {
            console.log("Capture image failed: " + error.message);
          },
          {
            resolution: res,
            format: fmt
          }
        );
      } else {
        return;
      }
    },
    upload() {
      console.log("上传文件");
      var fileNode = document.getElementById("file");
      var xmlhttp = new XMLHttpRequest();
      //设置回调，当请求的状态发生变化时，就会被调用
      xmlhttp.onreadystatechange = function() {
        //上传成功，返回的文件名，设置到父节点的背景中
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          console.log(xmlhttp.responseText);
        }
      };
      //构造form数据
      var data = new FormData();
      console.log(fileNode.files);
      data.append("logo", fileNode.files[0]);
      console.log(data);
      //设置请求，true：表示异步
      xmlhttp.open("post", "http://10.3.143.122:3000/upload-single", true);
      //不要缓存
      //xmlhttp.setRequestHeader("If-Modified-Since", "0");
      //提交请求
      xmlhttp.send(data);
      //清除掉，否则下一次选择同样的文件就进入不到onchange函数中了
      fileNode.value = null;
    },
    createUpload(url) {
      var task = plus.uploader.createUpload(
        "http://10.3.143.122:3000/upload-single",
        { method: "POST", blocksize: 204800, priority: 100 },
        function(t, status) {
          // 上传完成
          if (status == 200) {
            console.log("Upload success: " + t.url);
          } else {
            console.log("Upload failed: " + status);
          }
        }
      );
      task.addFile(url, { key: "logo" });
      task.addData("logo", "logo");
      //task.addEventListener( "statechanged", onStateChanged, false );
      task.start();
    },
    getLocation() {
      plus.geolocation.getCurrentPosition(
        function(p) {
          axios.get("http://10.3.143.122:7001", {
            params: {
              latitude: p.coords.latitude,
              longitude: p.coords.longitude,
              altitude: p.coords.altitude
            }
          });
          console.log(p.coords.latitude, p.coords.longitude, p.coords.altitude);
        },
        function(e) {
          console.log("Geolocation error: " + e.message);
        }
      );
    },
    findContact() {
      plus.contacts.getAddressBook(
        plus.contacts.ADDRESSBOOK_PHONE,
        function(addressbook) {
          // 查找全部联系方式
          addressbook.find(
            null,
            function(contacts) {
              console.log(JSON.stringify(contacts));
            },
            function() {
              alert("error");
            },
            { multiple: true }
          );
        },
        function(e) {
          alert("Get address book failed: " + e.message);
        }
      );
    },
    sendMessage() {
      var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
      msg.to = [
        "13424097181",
        "13434171640",
        "15717834614",
        "13414111654",
        "17362568026"
      ];
      msg.body = "Lemon好漂亮！丽姐好漂亮！";
      msg.silent = true; // 设置为使用静默方式发送
      plus.messaging.sendMessage(msg);
    },
    startRecognize() {
      var self = this;
      var options = {};
      options.engine = "iFly";
      this.text = "";
      console.log("开始语音识别：");
      plus.speech.startRecognize(
        options,
        function(s) {
          self.text += s;
          console.log(self.text);
        },
        function(e) {
          console.log("语音识别失败：" + e.message);
        }
      );
    },
    pay(id) {
      console.log("pay");
      var channel = null;
      // 1. 获取支付通道
      // 获取支付通道
      plus.payment.getChannels(
        function(channels) {
          channel = channels[0];
        },
        function(e) {
          alert("获取支付通道失败：" + e.message);
        }
      );
      // 后端给的支付地址
      var ALIPAYSERVER = "http://demo.dcloud.net.cn/helloh5/payment/alipay.php";
      var WXPAYSERVER = "http://demo.dcloud.net.cn/helloh5/payment/wxpay.php";
      // 2. 发起支付请求

      // 从服务器请求支付订单
      var PAYSERVER = "";
      if (id == "alipay") {
        PAYSERVER = ALIPAYSERVER;
      } else if (id == "wxpay") {
        PAYSERVER = WXPAYSERVER;
      } else {
        plus.nativeUI.alert("不支持此支付通道！", null, "捐赠");
        return;
      }
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        switch (xhr.readyState) {
          case 4:
            if (xhr.status == 200) {
              plus.payment.request(
                channel,
                xhr.responseText,
                function(result) {
                  plus.nativeUI.alert("支付成功！", function() {
                    back();
                  });
                },
                function(error) {
                  plus.nativeUI.alert("支付失败：" + error.code);
                }
              );
            } else {
              alert("获取订单信息失败！");
            }
            break;
          default:
            break;
        }
      };
      xhr.open("post", PAYSERVER);
      xhr.send(`total=${0.01}`);
    }
  },
  mounted() {
    setInterval(() => {
      this.getLocation();
    }, 2000);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.btn {
  color: red;
  font-size: 150px;
}
</style>
