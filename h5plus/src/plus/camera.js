let camera = () => {
    // 判断现在是否在5+的环境
    if (plus) {
        // 获取摄像头对象
        var cmr = plus.camera.getCamera();
        // 摄像头对象用最高的分辨率
        var res = cmr.supportedImageResolutions[0];
        // 拍照后导出图片的格式
        var fmt = cmr.supportedImageFormats[0];
        console.log("Resolution: " + res + ", Format: " + fmt);
        // 进行拍照的操作
        cmr.captureImage(function (path) {
                alert("Capture image success: " + path);
            },
            function (error) {
                alert("Capture image failed: " + error.message);
            }, {
                resolution: res,
                format: fmt
            }
        );
    } else {
        return
    };

}

export default {
    camera
}