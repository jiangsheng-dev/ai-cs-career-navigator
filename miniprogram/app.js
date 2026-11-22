App({
  globalData: {
    version: '2026-11',
    province: '广东',
    cloudEnv: '',
    openid: ''
  },
  onLaunch: function () {
    try {
      var cached = wx.getStorageSync('cs_mp_openid');
      if (cached) this.globalData.openid = cached;
    } catch (e) {}
    if (wx.cloud && this.globalData.cloudEnv) {
      wx.cloud.init({ env: this.globalData.cloudEnv, traceUser: true });
      this.bindUser();
    }
  },
  bindUser: function (cb) {
    var that = this;
    if (!wx.cloud || !this.globalData.cloudEnv) {
      if (cb) cb('');
      return;
    }
    wx.login({
      success: function () {
        wx.cloud.callFunction({ name: 'login' }).then(function (res) {
          var openid = (res && res.result && res.result.openid) || '';
          that.globalData.openid = openid;
          try { wx.setStorageSync('cs_mp_openid', openid); } catch (e) {}
          if (cb) cb(openid);
        }).catch(function () {
          if (cb) cb('');
        });
      },
      fail: function () {
        if (cb) cb('');
      }
    });
  }
});