var store = require('../../utils/store');
var date = require('../../utils/date');
var calendar = require('../../utils/calendar');

Page({
  data: {
    list: [],
    count: 0
  },
  onShow: function () {
    this.refresh();
  },
  refresh: function () {
    var now = Date.now();
    var list = store.getReminders().slice().sort(function (a, b) { return a.remindAt - b.remindAt; }).map(function (r) {
      var diff = r.remindAt - now;
      var days = Math.ceil(diff / 86400000);
      var status;
      if (diff < 0) status = '已过期';
      else if (days <= 0) status = '今天';
      else status = days + ' 天后';
      var d = new Date(r.remindAt);
      return {
        id: r.id,
        itemId: r.itemId,
        itemName: r.itemName,
        kind: r.kind,
        label: r.label || '',
        dateText: date.fmt(d),
        timeText: date.fmtTime(d),
        status: status,
        overdue: diff < 0,
        enabled: r.enabled !== false
      };
    });
    this.setData({ list: list, count: list.length });
  },
  onToggle: function (e) {
    var id = e.currentTarget.dataset.id;
    store.updateReminder(id, { enabled: e.detail.value });
    this.refresh();
  },
  onRemove: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '删除提醒',
      content: '确定删除这条提醒吗？',
      success: function (res) {
        if (res.confirm) {
          store.removeReminder(id);
          that.refresh();
        }
      }
    });
  },
  onCalendar: function (e) {
    var id = e.currentTarget.dataset.id;
    var reminder = store.getReminders().filter(function (r) { return r.id === id; })[0];
    if (!reminder) return;
    calendar.add({
      title: '【' + reminder.itemName + '】' + (reminder.label || reminder.kind) + '提醒',
      startTime: Math.floor(reminder.remindAt / 1000),
      description: (reminder.kind || '') + ' · 来自证书竞赛工作台',
      success: function () { wx.showToast({ title: '已写入手机日历', icon: 'success' }); }
    });
  },
  goCatalog: function () {
    wx.switchTab({ url: '/pages/catalog/catalog' });
  }
});