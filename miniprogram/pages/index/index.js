var catalog = require('../../utils/catalog');
var store = require('../../utils/store');
var date = require('../../utils/date');
var app = getApp();

Page({
  data: {
    goals: [],
    total: 0,
    nearest: null,
    hasGoals: false,
    bound: false,
    todos: [],
    todoText: '',
    todoCount: 0
  },
  onShow: function () {
    var that = this;
    var cached = (app && app.globalData && app.globalData.openid) || '';
    this.setData({ bound: !!cached });
    if (!cached && app && app.globalData && app.globalData.cloudEnv) {
      app.bindUser(function (openid) {
        that.setData({ bound: !!openid });
      });
    }
    this.refresh();
  },
  refresh: function () {
    var goals = store.getGoals();
    var list = goals.map(function (g) {
      var item = null;
      for (var i = 0; i < catalog.length; i++) {
        if (catalog[i].id === g.itemId) { item = catalog[i]; break; }
      }
      if (!item) return null;
      var node = date.nextNode(item);
      return {
        id: g.id,
        itemId: item.id,
        itemName: item.name,
        type: item.type,
        level: item.level,
        stars: date.stars(item.stars),
        nodeKind: node ? node.kind : '',
        nodeLabel: node ? node.label : '',
        nodeDate: node ? date.fmt(node.date) : '',
        days: node ? node.days : null,
        daysText: node ? String(node.days) : '—',
        sub: node ? (node.kind + ' · ' + date.fmtCN(node.date)) : '全年滚动，无固定节点'
      };
    }).filter(Boolean).sort(function (a, b) {
      var da = a.days === null ? 99999 : a.days;
      var db = b.days === null ? 99999 : b.days;
      return da - db;
    });
    var todos = store.getTodos();
    this.setData({
      goals: list,
      total: list.length,
      nearest: list.length ? list[0] : null,
      hasGoals: list.length > 0,
      todos: todos,
      todoCount: todos.length
    });
  },
  onTodoInput: function (e) {
    this.setData({ todoText: e.detail.value });
  },
  addTodo: function () {
    var text = (this.data.todoText || '').trim();
    if (!text) {
      wx.showToast({ title: '先写点内容', icon: 'none' });
      return;
    }
    store.addTodo(text.slice(0, 60));
    this.setData({ todoText: '' });
    this.refresh();
    wx.showToast({ title: '已添加', icon: 'none' });
  },
  completeTodo: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    var todos = this.data.todos.map(function (t) {
      return Object.assign({}, t, { done: t.id === id });
    });
    this.setData({ todos: todos });
    setTimeout(function () {
      store.removeTodo(id);
      that.refresh();
      wx.showToast({ title: '已完成', icon: 'success' });
    }, 280);
  },
  goCatalog: function () {
    wx.switchTab({ url: '/pages/catalog/catalog' });
  },
  goDetail: function (e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  }
});