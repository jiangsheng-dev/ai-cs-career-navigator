var catalog = require('../../utils/catalog');
var date = require('../../utils/date');
var app = getApp();

Page({
  data: {
    list: [],
    keyword: '',
    type: '全部',
    types: ['全部', '比赛', '证书'],
    count: 0,
    version: '',
    province: ''
  },
  onLoad: function () {
    var g = (app && app.globalData) || {};
    this.setData({ version: g.version || '', province: g.province || '广东' });
    this.refresh();
  },
  onSearch: function (e) {
    this.setData({ keyword: e.detail.value });
    this.refresh();
  },
  onType: function (e) {
    this.setData({ type: e.currentTarget.dataset.t });
    this.refresh();
  },
  refresh: function () {
    var keyword = (this.data.keyword || '').trim().toLowerCase();
    var type = this.data.type;
    var list = catalog.filter(function (item) {
      if (type !== '全部' && item.type !== type) return false;
      if (!keyword) return true;
      var hay = (item.name + ' ' + item.majors + ' ' + item.organizer + ' ' + item.dir).toLowerCase();
      return hay.indexOf(keyword) >= 0;
    }).map(function (item) {
      var node = date.nextNode(item);
      return {
        id: item.id,
        name: item.name,
        type: item.type,
        dir: item.dir,
        level: item.level,
        stars: date.stars(item.stars),
        organizer: item.organizer,
        nextText: node ? (node.kind + ' · ' + date.fmtCN(node.date)) : '全年滚动',
        days: node ? node.days : null,
        daysText: node ? (node.days + ' 天') : '随时'
      };
    });
    this.setData({ list: list, count: list.length });
  },
  goDetail: function (e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  }
});