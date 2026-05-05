# 🇩🇪 Deutsch Vokabeln — 德语词汇练习

An interactive German vocabulary quiz, built as a pure HTML/CSS/JS single-page app. Zero dependencies, runs entirely in the browser.

## 🎯 Features

- **159 German words** across 4 thematic modules
- **3 quiz modes**:
  - **DE → CN 选择** — See German, pick the correct Chinese translation
  - **CN → DE 选择** — See Chinese, pick the correct German word
  - **冠词判断** (Article Identification) — Practice `der`/`die`/`das` gender recognition
- **Smart filtering**: Toggle individual modules on/off to focus on specific word sets
- **Persistent progress**: Score, combo streak, answer history, and module preferences are saved to `localStorage` — pick up where you left off
- **Answer history**: Review past answers with correct/incorrect markers
- **Fully offline**: No network requests after initial page load

## 🚀 Play

👉 **[https://skyflyld.github.io/deutsch-quiz/](https://skyflyld.github.io/deutsch-quiz/)**

## 🛠 Dev

```
npm run dev    # Start local dev server
npm run build  # Build for production
```

> **Note**: This is a static project — just `index.html`. Local dev requires any HTTP server (`npx serve .` or `python3 -m http.server`).

## 📦 Tech Stack

| Layer | Choice |
|-------|--------|
| UI | Vanilla HTML + CSS (responsive, no framework) |
| Logic | Vanilla JavaScript (ES6) |
| Data | Inline JSON in `index.html` |
| Persistence | `localStorage` |
| Hosting | GitHub Pages via Actions workflow |
| CI/CD | `actions/deploy-pages@v4` |

## 📁 Project Structure

```
deutsch-quiz/
├── index.html              # Single-file app (HTML + CSS + JS + vocab data)
├── .github/workflows/
│   └── pages.yml           # GitHub Actions → Pages deployment
└── README.md               # This file
```

## 📊 Vocabulary Stats

| Module | Words |
|--------|-------|
| Module 1 | 50 |
| Module 2 | 35 |
| Module 3 | 38 |
| Module 4 | 36 |
| **Total** | **159** |

Articles breakdown for applicable words: `der` × 39, `die` × 49, `das` × 17.

## 📝 License

Private project — for personal learning use.

---

*Built with 🦞 by Ariste, powered by OpenClaw*
