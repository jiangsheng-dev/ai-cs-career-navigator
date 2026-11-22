function guideOpenSetting(message) {
  wx.showModal({
    title: '需要日历权限',
    content: message || '请在「设置 → 授权管理」中允许「添加到日历」，并确认手机系统设置里微信有日历权限。',
    confirmText: '去设置',
    cancelText: '取消',
    success: function (res) {
      if (res.confirm) {
        wx.openSetting({
          fail: function () {
            wx.showModal({
              title: '请手动开启',
              content: '小程序设置里打开「添加到日历」；iPhone 还需到「设置 → 微信 → 日历」允许访问，安卓到「设置 → 应用 → 微信 → 权限 → 日历」。',
              showCancel: false
            });
          }
        });
      }
    }
  });
}

function add(options) {
  if (!wx.addPhoneCalendar) {
    wx.showModal({
      title: '微信版本过低',
      content: '当前微信不支持写入日历，请升级微信后再试。',
      showCancel: false
    });
    return;
  }

  function tryAdd() {
    wx.addPhoneCalendar({
      title: options.title,
      startTime: options.startTime,
      allDay: !!options.allDay,
      alarm: true,
      alarmOffset: 0,
      description: options.description || '',
      success: function () {
        if (options.success) options.success();
      },
      fail: function (err) {
        var msg = (err && err.errMsg) || '';
        if (msg.indexOf('auth deny') >= 0 || msg.indexOf('auth denied') >= 0 || msg.indexOf('authorize') >= 0) {
          guideOpenSetting('日历权限被拒绝。请在「设置 → 授权管理 → 添加到日历」中打开，并确认手机系统设置里微信有日历权限。');
        } else if (options.fail) {
          options.fail(err);
        } else {
          wx.showModal({ title: '写入失败', content: msg || '请稍后重试', showCancel: false });
        }
      }
    });
  }

  try {
    wx.getSetting({
      success: function (res) {
        var auth = res && res.authSetting ? res.authSetting['scope.addPhoneCalendar'] : undefined;
        if (auth === false) {
          guideOpenSetting();
          return;
        }
        tryAdd();
      },
      fail: function () {
        tryAdd();
      }
    });
  } catch (e) {
    tryAdd();
  }
}

module.exports = { add: add };