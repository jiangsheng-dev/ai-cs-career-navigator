var catalog = require('../../utils/catalog');
var store = require('../../utils/store');
var date = require('../../utils/date');
var calendar = require('../../utils/calendar');

function toTs(dateStr, timeStr) {
  var d = String(dateStr).split('-');
  var t = String(timeStr).split(':');
  return new Date(Number(d[0]), Number(d[1]) - 1, Number(d[2]), Number(t[0]), Number(t[1]), 0).getTime();
}

Page({
  data: {
    item: null,
    nodes: [],
    selected: 0,
    isGoal: false,
    remindDate: '',
    remindTime: '09:00',
    advance: 1,
    advanceList: [0, 1, 3, 7],
    hasNodes: false
  },
  onLoad: function (options) {
    var item = null;
    for (var i = 0; i < catalog.length; i++) {
      if (catalog[i].id === options.id) { item = catalog[i]; break; }
    }
    if (!item) {
      wx.showToast({ title: '未找到该项', icon: 'none' });
      return;
    }
    var raw = date.allNodes(item);
    this.nodeDates = raw.map(function (n) { return n.date; });
    var nodes = raw.map(function (n, idx) {
      return {
        index: idx,
        kind: n.kind,
        label: n.label,
        dateText: date.fmt(n.date),
        dateCN: date.fmtCN(n.date),
        days: n.days
      };
    });
    this.setData({
      item: Object.assign({}, item, { starsText: date.stars(item.stars) }),
      nodes: nodes,
      isGoal: store.isGoal(item.id),
      hasNodes: nodes.length > 0
    });
    if (nodes.length) {
      this.applyNode(0, 1);
    } else {
      var d = new Date(Date.now() + 7 * 86400000);
      this.setData({ remindDate: date.fmt(d), remindTime: '09:00' });
    }
  },
  applyNode: function (index, advance) {
    if (!this.nodeDates || !this.nodeDates[index]) return;
    var d = new Date(this.nodeDates[index].getTime() - advance * 86400000);
    this.setData({ selected: index, advance: advance, remindDate: date.fmt(d), remindTime: date.fmtTime(d) });
  },
  onSelectNode: function (e) {
    var idx = Number(e.currentTarget.dataset.index);
    this.applyNode(idx, this.data.advance);
  },
  onAdvance: function (e) {
    var n = Number(e.currentTarget.dataset.n);
    this.applyNode(this.data.selected, n);
  },
  onDateChange: function (e) {
    this.setData({ remindDate: e.detail.value });
  },
  onTimeChange: function (e) {
    this.setData({ remindTime: e.detail.value });
  },
  buildReminder: function () {
    var item = this.data.item;
    var node = this.data.nodes[this.data.selected] || { kind: '自定义', label: '提醒', dateText: this.data.remindDate };
    return {
      id: 'r' + Date.now(),
      itemId: item.id,
      itemName: item.name,
      kind: node.kind,
      label: node.label,
      nodeDate: node.dateText,
      remindAt: toTs(this.data.remindDate, this.data.remindTime),
      remindDate: this.data.remindDate,
      remindTime: this.data.remindTime,
      advance: this.data.advance,
      enabled: true,
      calendarAdded: false,
      createdAt: Date.now()
    };
  },
  toggleGoal: function () {
    var item = this.data.item;
    if (this.data.isGoal) {
      store.removeGoal(item.id);
      this.setData({ isGoal: false });
      wx.showToast({ title: '已移出目标', icon: 'none' });
    } else {
      store.addGoal(item);
      this.setData({ isGoal: true });
      wx.showToast({ title: '已加入目标', icon: 'success' });
    }
  },
  setReminder: function () {
    if (!this.data.remindDate) return;
    store.saveReminder(this.buildReminder());
    wx.showToast({ title: '已设置提醒', icon: 'success' });
  },
  addCalendar: function () {
    if (!this.data.remindDate) return;
    var item = this.data.item;
    var node = this.data.nodes[this.data.selected] || { kind: '提醒', label: '' };
    var ts = toTs(this.data.remindDate, this.data.remindTime);
    store.saveReminder(this.buildReminder());
    calendar.add({
      title: '【' + item.name + '】' + (node.label || node.kind) + '提醒',
      startTime: Math.floor(ts / 1000),
      description: (node.kind || '') + ' · 来自证书竞赛工作台',
      success: function () {
        wx.showToast({ title: '已写入手机日历', icon: 'success' });
      }
    });
  }
});
