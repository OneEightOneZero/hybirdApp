# 混合开发

其实就是webapp打包成一个手机app(native app)

网络+浏览器环境  webpack网页app环境

手机本地应用 可以离线情况运行 不需要浏览器 （缓存静态资源，你的一些css,html,js,img）都编程本地获取

|类型|泣别|
|-|-|
|web应用|只能在浏览器里面跑|
|hybird应用|打包了浏览器的web应用(12306,Facebook)|
|web2native应用|把网页放进本地应用(微信，支付宝)|
|native应用|ios(swift oc) android(java)|

# 安装

hbuilder(x)环境

> 文件->项目->5+App

# 打包

选中你的app项目文件夹，然后点击上面的 发行 -> 原生App云打包
# hybirdApp


# API调用

因为你这个web已经打包了浏览器，会在这个app里面的全局变量里面`plus`
```js
plus
```