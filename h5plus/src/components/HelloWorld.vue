<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h1>{{title}}</h1>
    <button class="btn" @click="testAjax">测试AJAX(axios)</button>
    <button class="btn" @click="testCamera">打开摄像头</button>
    <button class="btn" @click="getLocation">获取定位信息</button>
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
  font-size: 100px;
}
</style>
