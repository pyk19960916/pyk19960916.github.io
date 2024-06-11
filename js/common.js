/**
 * Created by anan on 15/9/20.
 */

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
      "M+": this.getMonth() + 1,                 //月份
      "d+": this.getDate(),                    //日
      "h+": this.getHours(),                   //小时
      "m+": this.getMinutes(),                 //分
      "s+": this.getSeconds(),                 //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  
  if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (prefix) {
      return this.slice(0, prefix.length) === prefix;
    };
  }
  
  if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (suffix) {
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
  }
  
  function isInt(str) {
    var r = /^[0-9]*[1-9][0-9]*$/;　//正整数
    return r.test(str);
  }
  
  function toHome() {
    location.href = './';
  }
  
  function isNull(str) {
    if (str == undefined) {
      return true;
    }
    if (str == "undfined") {
      return true;
    }
    if (str == "null") {
      return true;
    }
    if (str == "") {
      return true;
    }
    return false;
  }
  
  function setDivImage(div, url) {
    div.style.backgroundImage = "url('" + url + "')";
  }
  
  //写cookies
  
  function setCookie(name, value, timeout) {
    if (timeout == undefined) {
      timeout = 3600 * 24 * 365;
    }
    var exp = new Date();
    exp.setTime(exp.getTime() + timeout * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  }
  
  //读取cookies
  function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  
    if (arr = document.cookie.match(reg))
  
      return unescape(arr[2]);
    else
      return null;
  }
  
  //删除cookies
  function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }
  
  function getQueryString(name) {
    return getQueryStringWithUrl(window.location.href, name);
  }
  
  function getQueryStringWithUrl(url, name) {
    url = url.replace('?', '&');
    url = url.replace('#', '&');
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    //var r = window.location.search.substr(1).match(reg);
    var r = url.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
  }
  
  function logout() {
    delCookie("user");
    if (isClient()) {
      setCookie("toLogin", "1");
      closePage();
    } else {
      location.href = 'index.html';
    }
  }
  
  function getUser() {
    return JSON.parse(getCookie('user'));
  }
  
  function isLogin() {
    return !(getUser() == null);
  }
  
  //隐藏分享按钮
  function hide_share() {
    jQuery('.toolbar_share').hide();
  }
  
  //内容分享功能
  function content_shareing(val) {
    (function ($) {
      $('.share-content').mousemove(function () {
        var $position = $(this).position();
        var $top = ($position.top - 100) + 'px';
        var $left = ($position.left - val) + 'px';
        var $share = $(this).parents('.list-tiem').find('.toolbar_share');
        $('.toolbar_share').hide();
        $share.css({ top: $top, left: $left });
        $share.show();
        $('#moveToDiv').val(0);
      })
  
      $('.share-content').mouseleave(function () {
        $('.toolbar_share').mousemove(function () {
          $('#moveToDiv').val(1);
        })
  
        setTimeout(function () {
          if ($('#moveToDiv').val() == 0) {
            $('.toolbar_share').hide();
            $('#moveToDiv').val(0);
          }
        }, 200);
      })
  
      $('.toolbar_share').mouseleave(function () {
        $('.toolbar_share').hide();
      })
    })(jQuery)
  }
  
  //分享功能
  function share(_type, _tid) {
    var _appkey = '';
    var _title = jQuery('#title-' + _tid).text();
    var _pic = jQuery('#pic-' + _tid).attr('src');
  
    if (!_pic) {
      _pic = 'http://app.isbobo.com/72.png';
    };
  
    if (_type == 'tqq') {
      _title = _title + encodeURIComponent('……来自(@isbobo 2011)');
    } else {
      _title = _title + encodeURIComponent('……来自(@睡前一刻应用)');
    }
    var _url = "detail.php?id=" + _tid;
    _url = encodeURIComponent(_url);
  
    if (_type == 'weibo') {
      _appkey = '75142689';
      var _url = 'http://v.t.sina.com.cn/share/share.php?searchPic=false&appkey=' + _appkey + '&url=' + _url + '&title=' + _title + '&pic=' + _pic;
    } else if (_type == 'tqq') {
      _appkey = '101142107';
      var _url = 'http://share.v.t.qq.com/index.php?c=share&a=index&url=' + _url + '&appkey=' + _appkey + '&pic=' + _pic + '&title=' + _title;
    } else if (_type == 'qzone') {
      _appkey = '101142107';
      var _url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + _url + '&title=' + _title + '&pics=' + _pic;
    } else if (_type == 'renren') {
      var _url = 'http://widget.renren.com/dialog/share?resourceUrl=' + _url + '&srcUrl=' + _url + '&title=' + _title + '&pic=' + _pic;
    }
    window.open(_url);
  }
  
  //隐藏分享按钮
  function hide_share() {
    jQuery('.toolbar_share').hide();
  }
  
  function toast(str) {
    jQuery(".mask").show();
    jQuery(".dialog_box").show();
    jQuery("#dialog_title").text(str);
    jQuery(".mask").click(function () {
      jQuery(".mask").hide();
      jQuery(".dialog_box").hide();
    });
  }
  
  function testMobile() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = u.indexOf('iPhone') > -1 || u.indexOf('iTouch') > -1; //ios终端
  
    return isAndroid || isiOS;
  }
  
  function finalUrl(url) {
    url = url.replace('http://', 'https://');
    return url;
  }
  
  function addFavorite(url, name) {
    var ctrl = navigator.userAgent.toLowerCase().indexOf("mac") != -1 ? "Command/Cmd" : "CTRL";
    try {
      document.all ? window.external.addFavorite(url, name) : window.sidebar ? window.sidebar.addPanel(name, url, "") : alert("您可以尝试通过快捷键" + ctrl + " + D 加入到收藏夹!")
    } catch (e) {
      alert("您可以尝试通过快捷键" + ctrl + " + D 加入到收藏夹!")
    }
  }
  
  // 设置为主页
  function setHome(obj, vrl) {
    try {
      obj.style.behavior = 'url(#default#homepage)';
      obj.setHomePage(vrl);
    } catch (e) {
      if (window.netscape) {
        try {
          netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        }
        catch (e) {
          alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
        }
        var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
        prefs.setCharPref('browser.startup.homepage', vrl);
      } else {
        alert("您的浏览器不支持，请按照下面步骤操作：1.打开浏览器设置。2.点击设置首页。3.输入：" + vrl + "点击确定。");
      }
    }
  }
  
  function userIconAction() {
    if (isLogin()) {
      window.location.href = 'me.html';
    } else {
      window.location.href = 'login.html';
    }
  }
  
  function selectTab(index) {
    jQuery(".menu-tab1").removeClass("menu-li-active");
    jQuery(".menu-tab2").removeClass("menu-li-active");
    jQuery(".menu-tab3").removeClass("menu-li-active");
    jQuery(".menu-tab4").removeClass("menu-li-active");
  
    jQuery(".tab1").hide();
    jQuery(".tab2").hide();
    jQuery(".tab3").hide();
    jQuery(".tab4").hide();
  
    switch (index) {
      case 0:
        jQuery(".menu-tab1").addClass("menu-li-active");
        jQuery(".tab1").show();
        break;
      case 1:
        jQuery(".menu-tab2").addClass("menu-li-active");
        jQuery(".tab2").show();
        break;
      case 2:
        jQuery(".menu-tab3").addClass("menu-li-active");
        jQuery(".tab3").show();
        break;
      case 3:
        jQuery(".menu-tab4").addClass("menu-li-active");
        jQuery(".tab4").show();
        break;
    }
  }
  
  function sendPostComment(commentId) {
    if (isLogin()) {
      // _hmt.push(['_trackEvent', '社区', '点击', '发帖']);
  
  
      var user = getUser();
      var text = jQuery("#inputText").val();
  
      if (text.length < 2) {
        toastr.error("回复字数太少啦！");
  
        // _hmt.push(['_trackEvent', '首页', '点击', '发帖字数不够']);
  
        return;
      }
  
      jQuery.ajax({
        url: "api/user.php?cmd=commentSave",
        type: "POST",
        data: {
          userId: user.id,
          content: text,
          commentId: commentId,
          siteId: -1
        },
        success: function (response) {
          if (response.success) {
            window.location.reload();
          } else {
            toastr.error(response.msg);
          }
        }
      });
    } else {
      toLogin();
    }
  }
  
  function sendComment(siteId, sectionId) {
    if (isLogin()) {
      var user = getUser();
      var text = jQuery("#inputText").val();
  
      if (text.length < 2) {
        toastr.error("字数太少啦！");
        return;
      }
  
      if (siteId == -1 && sectionId == undefined) {
        jQuery('#sectionIdDialog').modal({
          keyboard: false,
          show: true
        });
        return;
      }
  
      jQuery.ajax({
        url: "api/user.php?cmd=commentSave",
        type: "POST",
        data: {
          userId: user.id,
          content: text,
          sectionId: sectionId,
          siteId: siteId
        },
        success: function (response) {
          if (response.success) {
            if (siteId == -1) {
              location.reload();
              //jQuery("#inputText").val("");
              //loadComments(0,200);
            } else {
              location.reload();
            }
  
          } else {
            toastr.error(response.msg);
          }
        }
      });
    } else {
      toLogin();
    }
  }
  
  function toLogin() {
    setCookie("toLogin", "1");
    openPage("login.html", 0, '登录', undefined);
  }
  
  function doReply(siteId, commentId, nickname) {
    jQuery('#doReply').modal({
      keyboard: false,
      show: true
    });
  
    jQuery(".modal-title-reply").text("回复" + nickname);
    jQuery(".modal-title-reply")[0].commentId = commentId;
    jQuery(".modal-title-reply")[0].siteId = siteId;
    jQuery(".modal-input-reply").val("");
  }
  
  
  function doEditFav(siteId, commentId, nickname) {
    jQuery('#editFav').modal({
      keyboard: false,
      show: true
    });
  }
  
  function doEditShare() {
    window.location.href = 'submit.html';
  }
  
  function saveFavAction() {
    if (isLogin()) {
      var user = getUser();
      var name = jQuery(".modal-input-fav-name").val();
      var address = jQuery(".modal-input-fav-address").val();
      var intro = jQuery(".modal-input-fav-intro").val();
  
      if (name.length < 1) {
        toastr.error("请输入网站名字！");
        return;
      }
  
      if (address.length < 1) {
        toastr.error("请输入网站地址！");
        return;
      }
  
      jQuery.ajax({
        url: "api/site.php?cmd=add",
        type: "POST",
        data: {
          userId: user.id,
          name: name,
          address: address,
          intro: intro
        },
        success: function (response) {
          if (response.success) {
            document.location.reload();
            jQuery('#editFav').modal('toggle', 'center')
          } else {
            toastr.error(response.msg);
          }
        }
      });
    } else {
      document.location.href = "login.php";
    }
  }
  
  function sendSuperRePly() {
    if (isLogin()) {
      var user = getUser();
      var text = jQuery(".modal-input-reply").val();
      var siteId = jQuery(".modal-title-reply")[0].siteId;
  
      if (text.length < 2) {
        toastr.error("回复字数太少啦！");
        return;
      }
  
      jQuery.ajax({
        url: "api/user.php?cmd=commentSave",
        type: "POST",
        data: {
          userId: user.id,
          content: text,
          commentId: jQuery(".modal-title-reply")[0].commentId,
          siteId: siteId
        },
        success: function (response) {
          if (response.success) {
            jQuery('#doReply').modal('toggle', 'center');
            if (siteId > 0) {
              window.location.reload();
            } else {
              window.location.reload();
              //loadComments(0,200);
            }
          } else {
            toastr.error(response.msg);
          }
        }
      });
    } else {
      toLogin();
    }
  }
  
  function formatDateTimeToShow(createTime) {
    var time = new Date(Date.parse(createTime.replace(/-/g, "/")));
    var now = new Date();
  
    if (now.getTime() - time.getTime() < 10 * 1000) {
      return "刚刚";
    } else if (now.getTime() - time.getTime() < 60 * 1000) {
      return Math.ceil((now.getTime() - time.getTime()) / (1000)) + "秒前";
    } else if (now.getTime() - time.getTime() < 60 * 60 * 1000) {
      return Math.ceil((now.getTime() - time.getTime()) / (60 * 1000)) + "分钟前";
    } else if (now.getTime() - time.getTime() < 24 * 60 * 60 * 1000) {
      return Math.ceil((now.getTime() - time.getTime()) / (60 * 60 * 1000)) + "小时前";
    } else if (now.getTime() - time.getTime() < 30 * 24 * 60 * 60 * 1000) {
      return Math.ceil((now.getTime() - time.getTime()) / (24 * 60 * 60 * 1000)) + "天前";
    } else {
      return time.format("yyyy-MM-dd");
    }
  }
  
  function messageAction() {
    if (isLogin()) {
      // _hmt.push(['_trackEvent', '首页', '切换', '我的消息']);
  
      document.location.href = "message.html";
    } else {
      toLogin();
    }
  }
  
  function openCommentAction(mid, cid) {
    document.location.href = "pd_" + cid + "_" + mid + ".html";
  }
  
  function closeAdFooter(adId) {
    var now = new Date();
    var dateT = now.format("yyyy-MM-dd");
    setCookie('footer_' + dateT + '_' + adId, true);
    jQuery('.ad-content-footer').hide();
    jQuery('.ad-content-header').hide();
  }
  
  function appDownloadCloseAction() {
    jQuery('.app-download-top').hide();
  
    setCookie('app-download-close', '1');
  }
  
  function appDownloadAction() {
    appDownloadCloseAction();
    window.location.href = "https://www.sq1k.cc/app/download.html";
  }