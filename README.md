# 🇩🇪 Deutsch Vokabeln — 德语词汇练习

| 中文 | Deutsch |
|------|---------|
| 交互式德语词汇练习工具，纯前端单页应用，零依赖，完全在浏览器中运行。 | Ein interaktives Vokabeltrainer-Tool für Deutsch, reine Frontend-Single-Page-App, keine Abhängigkeiten, läuft vollständig im Browser. |

---

## 🎯 功能 / Funktionen

| 中文 | Deutsch |
|------|---------|
| **1,513 个德语词汇**，分 4 个主题模块（24 个单元） | **1.513 deutsche Wörter** in 4 thematischen Modulen (24 Lektionen) |
| **3 种练习模式** | **3 Übungsmodi** |
| — **DE → CN 选择**：看德语选中文 | — **DE → CN**：Deutsch sehen, Chinesisch wählen |
| — **CN → DE 选择**：看中文选德语 | — **CN → DE**：Chinesisch sehen, Deutsch wählen |
| — **冠词判断**：练习 der/die/das 词性识别 | — **Artikel**：Übung zur Genus-Erkennung (der/die/das) |
| **模块筛选**：可单独开关各模块，聚焦特定词集 | **Modulfilter**：Einzelne Module an-/abschalten, Fokus auf bestimmte Wortgruppen |
| **进度持久化**：分数、连击记录、答题历史、模块偏好均保存至 localStorage，关闭页面不丢 | **Fortschrittsspeicher**：Punktzahl, Combo, Verlauf und Moduleinstellungen bleiben via localStorage erhalten |
| **答题回顾**：查看历史答题记录，对错一目了然 | **Antwortverlauf**：Frühere Antworten mit richtig/falsch Markierung einsehen |
| **完全离线**：页面加载后无需网络请求 | **Vollständig offline**：Keine Netzwerkanfragen nach dem ersten Laden |

## 🚀 打开 / Loslegen

👉 **https://skyflyld.github.io/deutsch-quiz/**

Einfach öffnen und loslegen — keine Installation nötig.

---

## 📦 技术栈 / Technologie-Stack

| 层 / Ebene | 选型 / Wahl |
|------------|-------------|
| 界面 UI | Vanilla HTML + CSS (responsive, 无框架) |
| 逻辑 Logic | Vanilla JavaScript (ES6) |
| 数据 Data | `index.html` 内嵌 JSON |
| 持久化 Persistenz | `localStorage` |
| 托管 Hosting | GitHub Pages (Actions CI/CD) |

## 📁 项目结构 / Projektstruktur

```
deutsch-quiz/
├── index.html              # 单文件应用（HTML + CSS + JS + 词汇数据）
├── .github/workflows/
│   └── pages.yml           # GitHub Actions → Pages 部署流程
└── README.md               # 本文件
```

## 📊 词汇统计 / Vokabelstatistik

| 模块 / Modul | 词数 / Wörter |
|--------------|--------------|
| Modul 1 — Familie und Gesellschaft | 311 |
| Modul 2 — Natur und Kultur | 433 |
| Modul 3 — Bildung und Beruf | 381 |
| Modul 4 — Menschen und Kommunikation | 388 |
| **合计 Gesamt** | **1,513** |

冠词分布（适用于有词性的词汇）：`der` × 258, `die` × 361, `das` × 141（另 753 词无冠词）

## 📝 数据来源 / Datenquelle

词汇数据提取自飞书知识库文档「Deutsch Lernen · 德语学习知识库」（基于《新经典德语 2》教材，Modul 1–4 / Lektion 1–12 / 24 个 Entdecken 单元）。

自动解析 lark-table HTML 表格提取，按 Modul 归类，保留所有原始语法信息（冠词、复数、动词配价等）。

## 📜 版本记录 / Versionshistorie

| 版本 | 备注 |
|------|------|
| v43 | 修移动端 360-389px 视口统计卡片字号 |
| v42 | 全部 1,513 词入库，修复 cleanDEWord() 正则 bug，移动端溢出保护 |
| v41 | 部分词版，多轮 CSS/UX 精调 |
| v1–v40 | 先后完成多题型、模块筛选、进度持久化、暗色模式、全设备自适应 |

---

## 📝 许可 / Lizenz

Private project — for personal learning use.

---

*Built with 🦞 by Ariste, powered by OpenClaw*
