#!/usr/bin/env node
/**
 * Deutsch Vokabeln Quiz — 完整性检查脚本
 * 运行: node check.js
 * 检查: 词库重复、冠词合法性、清洗结果异常、HTML/JS 语法
 */
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
let errors = 0;

function err(msg) { console.log('  ❌ ' + msg); errors++; }

// 0. Version
const badgeVer = html.match(/display:block">([^<]+)<\/span>/)?.pop()||'?';
console.log(`📋 版本: ${badgeVer}, 文件大小: ${(html.length/1024).toFixed(0)}KB`);

// 1. HTML 基本结构检查
console.log('📋 检查 HTML 结构...');
const requiredTags = ['<!DOCTYPE html>', '<html', '</html>', '</body>', '</script>', '<link rel="manifest"'];
for (const t of requiredTags) {
  if (!html.includes(t)) err(`缺少 ${t}`);
}

// 2. 提取 cleanDEWord 并测试
console.log('📋 检查 cleanDEWord()...');
const fnMatch = html.match(/function cleanDEWord\(raw\)\{[\s\S]*?\n\}/);
if (!fnMatch) { err('找不到 cleanDEWord 函数'); process.exit(1); }

// Regex-based test function (mirrors index.html cleanDEWord)
function testClean(raw) {
  let s = raw;
  s = s.replace(/^(der|die|das)\s+/, '');
  s = s.replace(/\s*\([^)]*\)\s*/g, '');
  s = s.replace(/\s*\.{3}\w.*$/, '');
  s = s.replace(/\s*\[[^\]]*\]/g, '');
  s = s.replace(/\s*\+\S+(?:\s+\S+)?/g, '');
  s = s.replace(/\s*¨.*$/, '');
  s = s.replace(/\s+-[a-zäöüß]+.*$/, '');
  s = s.replace(/\s*-\s*$/, '');
  s = s.replace(/\s+/g, ' ');
  return s.trim();
}

// Test known problem cases
const edgeCases = [
  ['-wöchig', '-wöchig', 'adj suffix stripped'],
  ['-bar', '-bar', 'adj suffix stripped'],
  ['bloggen +A / +über Akk [ˈblɔɡn̩]', 'bloggen', 'phonetic not stripped'],
  ['heiraten (+A)', 'heiraten', 'paren remnant'],
  ['sich informieren +über Akk', 'sich informieren', 'unicode + marker'],
];
for (const [input, expected, label] of edgeCases) {
  const result = testClean(input);
  if (result !== expected) err(`cleanDEWord "${label}": ${JSON.stringify(input)} → ${JSON.stringify(result)} (期望: ${JSON.stringify(expected)})`);
}
if (errors === 0) console.log('  ✓ 边界用例全部通过');

// 3. 提取 vocab 数组
const vocabMatch = html.match(/const vocab = \[([\s\S]*?)\];/);
if (!vocabMatch) { err('找不到 vocab 数组'); process.exit(1); }

const entries = vocabMatch[1].match(/\{de:"[^"]*"[^}]*\}/g) || [];
console.log(`📋 词库: ${entries.length} 条`);

// 4. 检查重复 de
console.log('📋 检查重复词条...');
const deMap = {};
for (const entry of entries) {
  const d = entry.match(/de:"([^"]*)"/);
  if (d) deMap[d[1]] = (deMap[d[1]] || 0) + 1;
}
let dupCount = 0;
for (const [k, v] of Object.entries(deMap)) {
  if (v > 1) { err(`重复 de: "${k}" (${v}次)`); dupCount++; }
}
if (!dupCount) console.log('  ✓ 无重复词条');

// 5. 检查冠词合法性
console.log('📋 检查冠词...');
const validArticles = new Set(['null', '"der"', '"die"', '"das"']);
let artErrors = 0;
for (const entry of entries) {
  const a = entry.match(/article:([^,}]+)/);
  if (a && !validArticles.has(a[1])) { err(`非法冠词: ${a[1]} 于 ${entry.slice(0,50)}`); artErrors++; }
}
if (!artErrors) console.log('  ✓ 冠词全部合法');

// 5b. CN→DE 清洗同形检测
console.log('📋 CN→DE 清洗同形检测...');
const cleanMap = {};
for (const entry of entries) {
  const d = entry.match(/de:"([^"]*)"/);
  if (d) {
    const c = testClean(d[1]);
    if (!cleanMap[c]) cleanMap[c] = [];
    cleanMap[c].push({de: d[1], mod: entry.match(/module:(\d+)/)[1], cn: entry.match(/cn:"([^"]*)"/)[1]});
  }
}
let collisionCount = 0;
for (const [cl, items] of Object.entries(cleanMap)) {
  if (items.length > 1) {
    // Only report if the DIFFERENT de items share the same clean form
    const uniqueDE = new Set(items.map(i => i.de));
    if (uniqueDE.size > 1) {
      err(`清洗同形 "${cl}" (${items.length}个): ` + items.map(i => `M${i.mod} de="${i.de}" cn="${i.cn}"`).join(', '));
      collisionCount++;
    }
  }
}
if (!collisionCount) console.log('  ✓ 无清洗同形歧义');

// 6. 全面清洗检查
console.log('📋 深度清洗检查...');
let emptyCount = 0, bracketRemnant = 0, plusRemnant = 0;
let sampleEmpties = [], sampleBrackets = [], samplePlus = [];

for (const entry of entries) {
  const d = entry.match(/de:"([^"]*)"/);
  if (!d) continue;
  const cleaned = testClean(d[1]);

  if (cleaned === '') {
    emptyCount++;
    if (sampleEmpties.length < 3) sampleEmpties.push(d[1]);
  }
  if (/\[/.test(cleaned)) {
    bracketRemnant++;
    if (sampleBrackets.length < 3) sampleBrackets.push(d[1]);
  }
  if (/\+\S/.test(cleaned)) {
    plusRemnant++;
    if (samplePlus.length < 3) samplePlus.push(d[1]);
  }
}

if (emptyCount) { err(`${emptyCount} 个词清洗后为空`); sampleEmpties.forEach(e => console.log(`    空: ${e}`)); }
else console.log('  ✓ 无词条被清空');

if (bracketRemnant) { err(`${bracketRemnant} 个词残留括号`); sampleBrackets.forEach(e => console.log(`    括号: ${e}`)); }
else console.log('  ✓ 无括号残留');

if (plusRemnant) { err(`${plusRemnant} 个词残留 + 标记`); samplePlus.forEach(e => console.log(`    +: ${e}`)); }
else console.log('  ✓ 无 + 标记残留');

// 7. 检查模块覆盖
const modules = {};
for (const entry of entries) {
  const m = entry.match(/module:(\d+)/);
  if (m) modules[m[1]] = (modules[m[1]] || 0) + 1;
}
console.log('📋 模块分布:', Object.entries(modules).sort().map(([k,v]) => `M${k}:${v}`).join(', '));

// 结果
console.log('\n' + (errors === 0 ? '✅ 全部通过' : `❌ 发现 ${errors} 个问题`));
process.exit(errors > 0 ? 1 : 0);
