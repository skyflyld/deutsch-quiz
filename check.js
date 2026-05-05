#!/usr/bin/env node
/**
 * Deutsch Vokabeln Quiz — 完整性检查脚本
 * 运行: node check.js
 * 检查: 词库重复、冠词合法性、清洗结果异常、HTML/JS 语法
 */
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
let errors = 0;

// 1. HTML 基本结构检查
console.log('📋 检查 HTML 结构...');
const tags = ['<!DOCTYPE html>', '<html', '</html>', '</body>', '</script>'];
for (const t of tags) {
  if (!html.includes(t)) { console.log(`  ❌ 缺少 ${t}`); errors++; }
}

// 2. 提取 cleanDEWord 并测试
console.log('📋 检查 cleanDEWord()...');
const fnMatch = html.match(/function cleanDEWord\(raw\)\{[\s\S]*?\n\}/);
if (!fnMatch) { console.log('  ❌ 找不到 cleanDEWord 函数'); errors++; }
else {
  eval(fnMatch[0]);
  const problemCases = ['heiraten (+A)', 'sich +über Akk', 'knapp (+Akku)'];
  for (const c of problemCases) {
    const r = cleanDEWord(c);
    if (r.includes('(')) { console.log(`  ❌ cleanDEWord 处理异常: ${c} → ${r}`); errors++; }
  }
}

// 3. 提取 vocab 数组
const vocabMatch = html.match(/const vocab = \[([\s\S]*?)\];/);
if (!vocabMatch) { console.log('  ❌ 找不到 vocab 数组'); errors++; process.exit(1); }

const entries = vocabMatch[1].match(/\{de:"[^"]*"[^}]*\}/g) || [];
console.log(`📋 词库: ${entries.length} 条`);

// 4. 检查重复 de
console.log('📋 检查重复词条...');
const deMap = {};
for (const entry of entries) {
  const d = entry.match(/de:"([^"]*)"/);
  if (d) {
    deMap[d[1]] = (deMap[d[1]] || 0) + 1;
  }
}
for (const [k, v] of Object.entries(deMap)) {
  if (v > 1) { console.log(`  ❌ 重复 de: "${k}" (${v}次)`); errors++; }
}

// 5. 检查冠词合法性
console.log('📋 检查冠词...');
const validArticles = new Set(['null', '"der"', '"die"', '"das"']);
for (const entry of entries) {
  const a = entry.match(/article:([^,}]+)/);
  if (a && !validArticles.has(a[1])) {
    console.log(`  ❌ 非法冠词: ${a[1]} 于 ${entry.slice(0,50)}`);
    errors++;
  }
}

// 6. 检查清洗结果异常（括号残留）
console.log('📋 检查清洗结果...');
let cleanErrors = 0;
for (const entry of entries) {
  const d = entry.match(/de:"([^"]*)"/);
  if (d) {
    const c = cleanDEWord(d[1]);
    if (c.includes('(') && !c.includes(')')) {
      console.log(`  ❌ 括号残留: ${d[1]} → ${c}`);
      cleanErrors++; errors++;
    }
  }
}
if (!cleanErrors) console.log('  ✓ 无括号残留');

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
