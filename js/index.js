
function jumpAction(sid, bbs = false) {
    var page = jQuery("#txtPageRouteVal").val();
  
    if (sid != undefined) {
      if (bbs) {
        window.location.href = "bbs_" + sid + "_" + page + ".html";
      } else {
        window.location.href = "sites_" + sid + "_" + page + ".html";
      }
    } else {
      window.location.href = "index_" + page + ".html#t2";
    }
  }
  
  function formatHtmlContent(content) {
    var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
    content = content.replace(reg, "<a href='$1$2'>$1$2</a>").replace(/\n/g, "<br />");
  
    return content;
  }
  
  function getCommentHtml(info, level) {
    var html = '';
    html += '<li class="comment-item comment-border-bottom">' +
      '    <div class="list-user">' +
      '    <div class="user-img-me">' +
      '    <a target="_blank">' +
      '    <img class="uesr-logo lazy" src="' + finalUrl(info.userIcon) + '" style="display: block;">' +
      '    </a>' +
      '    </div>' +
      '    <a class="user-name-me" target="_blank">' + ("") + info.nickname + '</a>' +
      '    <span class="user-time">' + formatDateTimeToShow(info.createTime) + '</span>' +
      '    <span class="button-reply" onclick="doReply(' + info.siteId + ',' + info.id + ',\'' + info.nickname + '\');" type="button"> 回复</span>' +
      '    </div>' +
      '' +
      '   <div class="comment-content">' +
      '    <p id="title-{$info->id}" class="title-me">' + formatHtmlContent(info.content) + '</p>' +
      '   </div>';
  
    if (isLogin()) {
      for (var j = 0; j < info.replys.length; j++) {
        var reply = info.replys[j];
  
        html += getReplyHtml(reply, level + 1);
  
      }
    } else {
      html += '<li><p onclick="toLogin();" class="title-me title-me-answer">共有' + (info.replys.length) + '个回复，登录后方可查看</p></li>';
    }
  
  
    html += '</li>';
    return html;
  }
  
  function getReplyHtml(reply, level) {
    var html =
      '<div class="comment-border-bottom" style="margin-left:' + (level * 20) + 'px">' +
      '    <div class="list-user">' +
      '    <div class="user-img-me">' +
      '    <a target="_blank">' +
      '    <img class="uesr-logo lazy" src="' + finalUrl(reply.userIcon) + '" data-original="{$info->userIcon}" style="display: block;">' +
      '    </a>' +
      '    </div>' +
      '    <a class="user-name-me" target="_blank">' + ("") + reply.nickname + '</a>' +
      '    <span class="user-time">' + formatDateTimeToShow(reply.createTime) + '</span>' +
      '    <span class="button-reply" onclick="doReply(' + reply.siteId + ',' + reply.id + ',\'' + reply.nickname + '\');" type="button"> 回复</span>' +
      '    </div>' +
      '' +
      '   <div class="comment-content">' +
      '    <p id="title-{$info->id}" class="title-me">' + formatHtmlContent(reply.content) + '</p>' +
      '   </div>' +
      '</div>';
  
    for (var j = 0; j < reply.replys.length; j++) {
      var tmp = reply.replys[j];
      html += getReplyHtml(tmp, level + 1);
    }
  
    return html;
  }
  
  function loadComments(start, limit) {
    jQuery.ajax({
      url: "api/user.php?cmd=commentList",
      type: "GET",
      data: {
        start: start,
        limit: limit,
        siteId: -1
      },
      success: function (response) {
        if (response.success) {
          var html = '';
          for (var i = 0; i < response.data.length; i++) {
            var info = response.data[i];
            html += getCommentHtml(info, 0);
          }
  
          jQuery('.comment-ul').html(html);
  
        } else {
          toastr.error(response.msg);
        }
      }
    });
  }
  
  function sectionTab(sid) {
    if (jQuery(".img-arrow-section-" + sid).attr("opened") == '1') {
      jQuery(".section-" + sid).hide();
      jQuery(".img-arrow-section-" + sid).attr("src", "img/arrow_up.png?v=1");
      jQuery(".img-arrow-section-" + sid).attr("opened", '0');
    } else {
      jQuery(".section-" + sid).show();
      jQuery(".img-arrow-section-" + sid).attr("src", "img/arrow_down.png?v=1");
      jQuery(".img-arrow-section-" + sid).attr("opened", '1');
    }
  
  }
  
  function sectionSubTab(pid, sid) {
    jQuery(".section-name-sub-" + pid).removeClass('section-name-current');
    jQuery(".section-name-sub-" + pid + "-" + sid).addClass('section-name-current');
  
    jQuery(".section-list-" + pid).hide();
    jQuery(".section-list-" + pid + "-" + sid).show();
  }
  
  function bannerAction(id) {
  
  }
  
  function deleteFav(id, name) {
    var user = getUser();
  
    jQuery.confirm({
      title: '提示',
      //useBootstrap: false,
      type: 'red',
      content: '是否将《' + name + '》移出收藏夹?',
      buttons: {
        confirm: {
          text: '&nbsp&nbsp是&nbsp&nbsp',
          action: function () {
            jQuery.ajax({
              url: "api/user.php?cmd=favDel",
              data: {
                userId: user.id,
                siteId: id
              },
              success: function (response) {
                if (response.success) {
                  location.reload();
                } else {
                  toastr.error(response.msg);
                }
              }
            });
          }
        },
        cancel: {
          text: '&nbsp&nbsp否&nbsp&nbsp',
          action: function () {
  
          }
        }
      }
    });
  }
  
  function deleteShare(siteId, siteName) {
    jQuery.confirm({
      title: '提示',
      //useBootstrap: false,
      type: 'red',
      content: '是否将《' + siteName + '》删除?',
      buttons: {
        confirm: {
          text: '&nbsp&nbsp是&nbsp&nbsp',
          action: function () {
            if (isLogin()) {
  
              jQuery.ajax({
                url: "api/site.php?cmd=delete",
                type: "POST",
                data: {
                  siteId: siteId
                },
                success: function (response) {
                  if (response.success) {
                    window.location.reload();
                    toastr.success(response.msg);
                  } else {
                    toastr.error(response.msg);
                  }
                }
              });
            } else {
              document.location.href = "login.php";
            }
          }
        },
        cancel: {
          text: '&nbsp&nbsp否&nbsp&nbsp',
          action: function () {
  
          }
        }
      }
    });
  
  }
  
  function searchAction() {
    // _hmt.push(['_trackEvent', '首页', '切换', '帖子搜索']);
  
    var keyword = jQuery('.inputText').val();
  
    location.href = 'search.php?keyword=' + keyword;
  }
  
  function searchSiteAction() {
    // _hmt.push(['_trackEvent', '首页', '切换', '网站搜索']);
  
    var keyword = jQuery('.inputText').val();
  
    location.href = 'search.php?site=1&keyword=' + keyword;
  }
  
  function openVipAction() {
    // _hmt.push(['_trackEvent', '首页', '切换', '高级服务区']);
  
    if (isLogin()) {
      var user = getUser();
  
      if (user.integral > 300) {
        location.href = 'bbs_0.html';
      } else {
        jQuery('#vipDialog').modal({
          keyboard: false,
          show: true
        });
      }
    } else {
      toLogin();
    }
  }
  
  function openHelpAction() {
    // _hmt.push(['_trackEvent', '首页', '切换', '积分帮助']);
  
    location.href = 'help.html#t=vip';
  }
  
  function selectBbsTab(index, reload) {
    if (reload) {
      var oldHref = window.location.href;
      var newHref = './#t2&st=' + (index + 1);
  
      var str1 = oldHref.substr(oldHref.indexOf("index") + 5, 1);
      var str2 = newHref.substr(newHref.indexOf("index") + 5, 1);
  
      window.location.href = newHref;
      if (str1 == str2) {
        window.location.reload();
      }
      window.location.reload();
      return;
    }
  
    jQuery(".bbs-tab1-h").removeClass("bbs-post-type-active");
    jQuery(".bbs-tab2-h").removeClass("bbs-post-type-active");
    jQuery(".bbs-tab3-h").removeClass("bbs-post-type-active");
  
    jQuery(".bbs-tab1").hide();
    jQuery(".bbs-tab2").hide();
    jQuery(".bbs-tab3").hide();
  
    switch (index) {
      case 0:
        jQuery(".bbs-tab1-h").addClass("bbs-post-type-active");
        jQuery(".bbs-tab1").show();
  
        // _hmt.push(['_trackEvent', '社区', '切换', '全部']);
  
        break;
      case 1:
        jQuery(".bbs-tab2-h").addClass("bbs-post-type-active");
        jQuery(".bbs-tab2").show();
  
        // _hmt.push(['_trackEvent', '社区', '切换', '求网贴']);
        break;
      case 2:
        jQuery(".bbs-tab3-h").addClass("bbs-post-type-active");
        jQuery(".bbs-tab3").show();
  
        // _hmt.push(['_trackEvent', '社区', '切换', '分享帖']);
        break;
    }
  }
  
  function memuTabMe(index) {
    jQuery(".menu-me-tab1").removeClass("active");
    jQuery(".menu-me-tab2").removeClass("active");
    jQuery(".menu-me-tab3").removeClass("active");
  
  
    jQuery(".me-tab1").hide();
    jQuery(".me-tab2").hide();
    jQuery(".me-tab3").hide();
  
    switch (index) {
      case 0:
        jQuery(".menu-me-tab1").addClass("active");
        jQuery(".me-tab1").show();
        break;
      case 1:
        jQuery(".menu-me-tab2").addClass("active");
        jQuery(".me-tab2").show();
        break;
      case 2:
        jQuery(".menu-me-tab3").addClass("active");
        jQuery(".me-tab3").show();
        break;
    }
  
    setCookie("memuTabMe", index);
  }
  
  function newPostAction() {
    if (!isLogin()) {
      toLogin();
      return;
    }
  
    // _hmt.push(['_trackEvent', '详情', '切换', '点击求站提示']);
    window.location.href = 'np.html';
  }
  
  function checkboxSectionAction() {
    var scs = jQuery(".checkbox-section-sub");
    var all = true;
    for (var i = 0; i < scs.length; i++) {
      var info = scs[i];
      if (info.checked == false) {
        all = false;
      }
    }
  
    jQuery(".checkbox-section-par")[0].checked = all;
  
    var sectionIds = undefined;
    if (all) {
      sectionIds = '0';
    }
    for (var i = 0; i < scs.length; i++) {
      var info = scs[i];
      if (info.checked == true) {
        if (sectionIds == undefined) {
          sectionIds = info.value;
        } else {
          sectionIds += ',' + info.value;
        }
      }
  
      if (sectionIds == undefined) {
        toastr.error("请最少选择一个分类");
        return;
      }
      setCookie('sectionIds', sectionIds);
      window.location.reload();
    }
  }
  
  function checkboxAllSectionAction() {
    var scs = jQuery(".checkbox-section-sub");
    var all = jQuery(".checkbox-section-par")[0].checked;;
    for (var i = 0; i < scs.length; i++) {
      var info = scs[i];
      info.checked = all;
    }
  
    if (all) {
      var sectionIds = '0';
      for (var i = 0; i < scs.length; i++) {
        var info = scs[i];
        if (info.checked == true) {
          if (sectionIds == undefined) {
            sectionIds = info.value;
          } else {
            sectionIds += ',' + info.value;
          }
        }
        setCookie('sectionIds', sectionIds);
        window.location.reload();
      }
    } else {
      toastr.error("请最少选择一个分类");
    }
  }
  
  function openPost(id) {
    if (isLogin()) {
      window.location.href = 'pd_' + id + '.html';
    } else {
      toastr.error("请登录后查看");
      toLogin();
    }
  }
  
  function searchTypeAction(index) {
    jQuery(".search-box-item").removeClass("search-box-item-active");
    jQuery(".search-box-item" + index).addClass("search-box-item-active");
  
    jQuery(".search-type-site-box").hide();
    jQuery(".search-type-site-box" + index).show();
  
    searchSiteSwitchAction(0, true);
  }
  
  function searchSiteSwitchAction(index, sys) {
    if (!sys) {
      if (jQuery(".search-box-site-item" + index).hasClass("search-box-site-item-active")) {
        searchNavAction();
        return;
      }
    }
  
    for (var i = 0; i < 100; i++) {
      jQuery(".search-box-site-item").removeClass("search-box-site-item-active-" + i);
    }
    jQuery(".search-box-site-item").removeClass("search-box-site-item-active");
    var indexType = jQuery(".search-box-item-active").attr("index");
    jQuery(".search-box-site-item" + index).addClass("search-box-site-item-active search-box-site-item-active-" + indexType);
  }
  
  function searchNavAction() {
    // _hmt.push(['_trackEvent', '首页', '切换', '搜索']);
  
    var index = jQuery(".search-box-item-active").attr("index");
    console.log((".search-type-" + index + ".search-box-site-item-active-" + index));
    var nav = jQuery(".search-type-" + index + ".search-box-site-item-active-" + index)[0].getAttribute("nav");
    var url = jQuery(".search-type-" + index + ".search-box-site-item-active-" + index)[0].getAttribute("url");
    var kw = jQuery(".search-box-keyword").val();
    url = url.replace('_keyword_', kw);
  
    if (testMobile() || isClient()) {
      url = url.replace('_m_', 'm');
    } else {
      url = url.replace('_m_', 'www');
    }
  
    if (testMobile() || isClient()) {
      url = url.replace('_wap_', 'wap');
    } else {
      url = url.replace('_wap_', 'www');
    }
    window.open(url);
  
    // window.open('/go/' + nav + '?keyword=' + kw);
  }
  
  
  (function ($) {
  
    var clen = jQuery(".carousel-item-top").length;
    jQuery("#carousel").FtCarousel({ index: 0, auto: clen > 1, time: 3000, indicators: false, buttons: clen > 1 });
    var clen = jQuery(".carousel-item-bottom").length;
    jQuery("#carousel-bottom").FtCarousel({ index: 0, auto: clen > 1, time: 3000, indicators: false, buttons: clen > 1 });
  
    var str = window.location.href;
  
    if (str.indexOf('?t2') > 0 || str.indexOf('#t2') > 0) {
      selectTab(1);
    } else if (str.indexOf('?t3') > 0 || str.indexOf('#t3') > 0) {
      selectTab(2);
    } else if (str.indexOf('?t4') > 0 || str.indexOf('#t4') > 0) {
      selectTab(3);
    } else {
      selectTab(0);
    }
  
    if (str.indexOf('outside') > 0) {
      jQuery(".footer").hide();
    }
  
    if (isClient()) {
      if (str.endsWith('.cc') || str.endsWith('.cc/') || str.indexOf('index.html') > 0) {
        jQuery(".nav-container").show();
      } else {
        jQuery(".nav-container").hide();
      }
    } else {
      jQuery(".nav-container").show();
    }
  
    if (str.endsWith('.cc') || str.endsWith('.cc/') || str.indexOf('index.html') > 0) {
      var mei = getCookie("memuTabMe");
      if (mei) {
        memuTabMe(parseInt(mei));
      }
    }
  
    if (str.indexOf('#t2&st=1') > 0) {
      selectBbsTab(0);
    } else if (str.indexOf('#t2&st=2') > 0) {
      selectBbsTab(1);
    } else if (str.indexOf('#t2&st=3') > 0) {
      selectBbsTab(2);
    }
  
    jQuery('.menu-ul').find('a').click(function (e) {
      var str = jQuery(e.currentTarget).attr('href');
      if (str.indexOf('#t1') >= 0) {
        selectTab(0);
      } else if (str.indexOf('#t2') >= 0) {
        selectTab(1);
      } else if (str.indexOf('#t3') >= 0) {
        selectTab(2);
      } else if (str.indexOf('#t4') >= 0) {
        selectTab(3);
      }
    });
  
    if (isLogin()) {
      //回车事件绑定
      jQuery('.input-search').bind('keyup', function (event) {
        if (event.keyCode == "13") {
          //回车执行查询
          jQuery('.input-search-btn').click();
        }
      });
  
      jQuery('.nickname').text("" + getUser().nickname);
      jQuery('.user-img').attr("src", finalUrl(getUser().userIcon));
  
      jQuery('.me-nickname').val(getUser().nickname);
      jQuery('.me-account').val(getUser().account);
      jQuery('.me-email').val(getUser().email);
  
      jQuery('.userIcon').attr("src", finalUrl(getUser().userIcon));
  
      if (typeof favStatus === 'function') {
        favStatus();
      }
  
      if (typeof starStatus === 'function') {
        starStatus();
      }
  
      jQuery.ajax({
        url: "api/user.php?cmd=userInfo",
        success: function (response) {
          if (response.success) {
            jQuery('.nickname').text("" + getUser().nickname);
            jQuery('.user-img').attr("src", finalUrl(getUser().userIcon));
          } else {
            if (response.code == -1 && window.location.href.indexOf('login') == -1) {
              toLogin();
            }
          }
        }
      });
  
      jQuery.ajax({
        url: "api/user.php?cmd=newMessages",
        success: function (response) {
          if (response.success) {
            jQuery('.message-dot').removeClass('message-icon');
            jQuery('.message-dot').removeClass('message-icon-dot');
            if (response.data.length > 0) {
              jQuery('.message-dot').addClass('message-icon-dot');
              jQuery('.message-dot').text(response.data.length);
            } else {
              jQuery('.message-dot').addClass('message-icon');
              jQuery('.message-dot').text('');
            }
          } else {
            if (response.code == -1 && window.location.href.indexOf('login') == -1) {
              delCookie('user');
              toLogin();
            }
          }
        }
      });
  
      var myDate = new Date();
      var key = myDate.format('yyyy-MM-dd');
      if (getCookie(key) == undefined) {
        jQuery.ajax({
          url: "api/user.php?cmd=loginLog",
          success: function (response) {
  
          }
        });
      }
    }
  
    back_to_top();
    $(window).scroll(back_to_top);
    function back_to_top() {
      var $top = $(window).scrollTop();
      if ($top > 500) {
        $('#ued_gotop').show();
      } else {
        $('#ued_gotop').hide();
      }
    }
  
  
  })(jQuery);