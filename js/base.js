/**
 * Created by anan on 15/9/20.
 */

/**
 *
 * 判断是不是客户端
 *
 * */
function isClient() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('ql_ios_ql') != -1 || ua.indexOf('ql_android_ql') != -1) {
      return true;
    }
    return false;
  }
  
  /**
   *
   * 判断是不是ios客户端
   *
   * */
  function isIosClient() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('ql_ios_ql') != -1) {
      return true;
    }
    return false;
  }
  
  /**
   *
   * 调用本地方法
   *
   * */
  function openNativeAction(data) {
    if (data.callback) {
      var functionKey = parseInt(10000000000 * Math.random());
      callbacks[functionKey] = data.callback;
      qlEval(
        "function callback" + functionKey + "(data){" +
        "callbacks['" + functionKey + "'](data);" + "" +
        "}"
      );
  
      data.callback = "callback" + functionKey;
    }
    var ua = navigator.userAgent.toLowerCase();
    var base64 = window.Base64.encode(encodeURIComponent(JSON.stringify(data)));
    if (ua.indexOf('ql_ios_ql') != -1) {
      //window.location.href = 'qlweb://core?data='+base64;
      var objBody = document.getElementsByTagName("body").item(0);
      var iframe = document.createElement('iframe');
      //iframe.id = 'fileUploaderEmptyHole';
      iframe.name = 'fileUploaderEmptyHole';
      iframe.width = 0;
      iframe.height = 0;
      iframe.marginHeight = 0;
      iframe.marginWidth = 0;
      objBody.appendChild(iframe);
      iframe.src = 'qlweb://core?data=' + base64;
    } else if (ua.indexOf('ql_android_ql') != -1) {
      qlweb.openNativeAction(base64);
    }
  
  }
  
  /**
   *
   * 开新页面
   *
   * */
  function openPage(url, requestCode, title, extras) {
    //https
    var tmp = "http://" + window.document.location.host + "/" + url;
    if (window.document.location.href.indexOf("https") >= 0) {
      tmp = tmp.replace('http:', 'https:');
    }
    if (isClient()) {
      openNativeAction(
        {
          url: tmp,
          method: 'openPage',
          requestCode: requestCode,
          title: title,
          extras: extras
        });
    } else {
  
      window.location.href = tmp;
  
    }
  }
  
  function setPageResult(requestCode, data) {
    if (isClient()) {
      openNativeAction(
        {
          method: 'setPageResult',
          requestCode: requestCode,
          data: JSON.stringify(data)
        }
      )
    } else {
      saveValueByKey("pageResultTime", new Date().getTime());
      saveValueByKey("requestCode", requestCode);
      saveValueByKey("pageResult", JSON.stringify(data));
    }
  }
  
  function hasPageResult() {
    if (!isClient()) {
      var t = getValueByKey("pageResultTime");
      if (isNull(t)) {
        return false;
      }
      var now = new Date();
      if (now.getTime() - t < 60 * 1000) {
        return true;
      }
    }
    return false;
  }
  
  function closePage() {
    if (isClient()) {
      openNativeAction(
        {
          method: 'closePage'
        }
      )
    } else {
      window.history.back();
    }
  }
  
  function setRightButton(title, action) {
    if (isClient()) {
      openNativeAction(
        {
          method: 'setRightButton',
          title: title,
          action: action
        }
      )
    }
  }
  
  function showMashLoading() {
    openNativeAction(
      {
        method: "showMashLoading"
      }
    );
  }
  
  function hideMashLoading() {
    openNativeAction(
      {
        method: "hideMashLoading"
      }
    );
  }
  
  function uploadImage(callback, encryption) {
    openNativeAction(
      {
        method: 'uploadImage',
        encryption: encryption,
        callback: callback
      }
    );
  }
  
  function clearCache() {
    openNativeAction(
      {
        method: 'clearCache'
      }
    );
  
  }
  
  function getDevVersion(callback) {
    if (!isClient()) {
      callback(DevVersion);
    }
    openNativeAction(
      {
        method: 'getDevVersion',
        callback: callback
      }
    );
  }
  
  function getDevStrVersion(callback) {
    if (!isClient()) {
      callback(DevStrVersion);
    }
    openNativeAction(
      {
        method: 'getDevStrVersion',
        callback: callback
      }
    );
  }
  
  function downloadImage(url, width, callback) {
    openNativeAction(
      {
        method: 'downloadImage',
        callback: callback,
        width: width,
        url: url
      }
    )
  }
  
  function openPhotos(title, urls, index, encryption, callback) {
    openNativeAction(
      {
        method: 'openPhotos',
        title: title,
        callback: callback,
        urls: urls,
        index: index,
        encryption: encryption
      }
    )
  }
  
  function openShare(img, content, url, callback) {
    openNativeAction(
      {
        method: 'openShare',
        callback: callback,
        image: img,
        content: content,
        shareUrl: url
      }
    );
  }
  
  function feedback(callback) {
    openNativeAction(
      {
        method: 'feedback',
        callback: callback
      }
    );
  }
  
  function sendText(str, callback) {
    openNativeAction(
      {
        method: 'sendText',
        callback: callback,
        str: str
      }
    );
  }
  
  function isEnableTouchId(callback) {
    openNativeAction(
      {
        method: 'isEnableTouchId',
        callback: callback
      }
    );
  }
  
  function weixinLogin(callback) {
    openNativeAction(
      {
        method: 'weixinLogin',
        callback: callback
      }
    );
  }
  
  function sinaLogin(callback) {
    openNativeAction(
      {
        method: 'sinaLogin',
        callback: callback
      }
    );
  }
  
  function qqLogin(callback) {
    openNativeAction(
      {
        method: 'qqLogin',
        callback: callback
      }
    );
  }
  
  function copyClipboard(str) {
    openNativeAction(
      {
        method: 'copyClipboard',
        str: str
      }
    );
  }
  
  function openAppStore() {
    openNativeAction(
      {
        method: 'openAppStore'
      }
    );
  }
  
  function downloadApk(url) {
    openNativeAction(
      {
        method: 'downloadApk',
        url: url
      }
    );
  }
  
  function openBrowser(url) {
    openNativeAction(
      {
        method: 'openBrowser',
        url: url
      }
    );
  }
  