function pad(n){ return n < 10 ? '0' + n : '' + n; }
function fmt(d){ return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function fmtCN(d){ return (d.getMonth() + 1) + '月' + d.getDate() + '日'; }
function fmtTime(d){ return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
function daysBetween(a, b){ return Math.max(0, Math.ceil((a.getTime() - b.getTime()) / 86400000)); }
function nextForMonth(month, kind, from){
  var now = from ? new Date(from) : new Date();
  var day = kind === '报名' ? 1 : 15;
  var d = new Date(now.getFullYear(), month - 1, day, 9, 0, 0);
  if (d.getTime() <= now.getTime()) {
    d = new Date(now.getFullYear() + 1, month - 1, day, 9, 0, 0);
  }
  return d;
}
function allNodes(item, from){
  var now = from ? new Date(from) : new Date();
  var list = (item && item.dates ? item.dates : []).map(function(n){
    var d = nextForMonth(n.month, n.kind, now);
    return { kind: n.kind, label: n.label, month: n.month, date: d, days: daysBetween(d, now) };
  });
  list.sort(function(a, b){ return a.date - b.date; });
  return list;
}
function nextNode(item, from){
  var nodes = allNodes(item, from);
  return nodes.length ? nodes[0] : null;
}
function stars(n){
  n = n || 0;
  var s = '';
  for (var i = 1; i <= 5; i++) { s += i <= n ? '★' : '☆'; }
  return s;
}
module.exports = {
  pad: pad,
  fmt: fmt,
  fmtCN: fmtCN,
  fmtTime: fmtTime,
  daysBetween: daysBetween,
  nextForMonth: nextForMonth,
  allNodes: allNodes,
  nextNode: nextNode,
  stars: stars
};