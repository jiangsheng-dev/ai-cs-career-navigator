// 从工作台 HTML 导出证书/竞赛数据到 utils/catalog.js
// 用法：node tools/export-catalog.js
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlPath = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(root, '..', 'index.html');
const outPath = path.resolve(root, 'utils', 'catalog.js');
const html = fs.readFileSync(htmlPath, 'utf8');

function grab(startMarker, endMarker) {
  const i = html.indexOf(startMarker);
  if (i < 0) throw new Error('missing ' + startMarker);
  const j = html.indexOf(endMarker, i);
  if (j < 0) throw new Error('missing end ' + endMarker);
  return html.slice(i + startMarker.length, j);
}

const CS_DATA = Function('return ' + grab('var CS_DATA=', '\nvar CS_JOB='))();
const DETAILS = Function('return ' + grab('var DETAILS=', '\nfunction detailOf'))();

function detailOf(name) {
  let best = null;
  let bestKey = '';
  for (const key in DETAILS) {
    if (name.indexOf(key) === 0 && key.length > bestKey.length) {
      bestKey = key;
      best = DETAILS[key];
    }
  }
  return best || {};
}

const TYPE_MAP = { '赛': '比赛', '证': '证书' };
const out = [];

CS_DATA.forEach((item, index) => {
  if (item.c !== '赛' && item.c !== '证') return;
  const detail = detailOf(item.n);
  out.push({
    id: 's' + String(index).padStart(2, '0'),
    name: item.n,
    type: TYPE_MAP[item.c],
    dir: item.d || '通用',
    level: item.lv || '加分',
    terms: item.tm || [],
    effort: item.ef || '',
    why: item.w || '',
    organizer: detail.org || '见官方通知',
    majors: detail.majors || '计算机相关专业',
    stars: detail.star || 0,
    rounds: detail.rounds || '',
    work: detail.work || '',
    allYear: !!item.all,
    dates: (item.mo || []).map((m) => ({ month: m[0], kind: m[1], label: m[2] || m[1] }))
  });
});

fs.writeFileSync(outPath, 'module.exports = ' + JSON.stringify(out, null, 2) + ';\n', 'utf8');
console.log('exported ' + out.length + ' items -> ' + outPath);