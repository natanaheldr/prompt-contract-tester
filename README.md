<div align="center">

<br>

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=32&duration=2800&pause=600&color=818CF8&center=true&vCenter=true&width=650&height=70&lines=%E2%9A%A1+Prompt+Contract+Tester;%F0%9F%A7%AA+Write+once.+Test+everywhere." alt="Typing SVG">

<br>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
<img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/Vitest-passing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Tests">
<img src="https://img.shields.io/badge/License-MIT-success?style=for-the-badge" alt="License">

<br>
<br>

<img src="./screenshots/app-full.png" width="100%" alt="Prompt Contract Tester Screenshot" style="border-radius: 8px; border: 1px solid #374151;">

<br>
<br>

<p>
  <b>Send one prompt to multiple AI models.</b><br>
  <b>Validate every response against your JSON Schema contract.</b><br>
  <b>Get instant pass/fail results with full detail.</b>
</p>

<br>

---

<br>

</div>

<div align="center">

| | | | |
|:---:|:---:|:---:|:---:|
| 🧩 `{{placeholders}}` | 📐 JSON Schema | 🤖 Multi-model | ⚡ Concurrent |
| Dynamic variable<br>interpolation | Strict output contracts<br>via Ajv | OpenAI · Anthropic<br>· Mock | Parallel execution<br>with live progress |

</div>

<br>

---

<br>

## 📖 Table of Contents

<div align="center">

| | | | |
|:---:|:---:|:---:|:---:|
| [Why?](#-why-prompt-contract-tester) | [Features](#-features) | [Quick Start](#-quick-start) | [Demo](#-demo) |
| [Tech Stack](#-tech-stack) | [Adapters](#-adapters) | [Architecture](#-architecture) | [Scripts](#-scripts) |
| [Testing](#-testing) | [CI/CD](#-cicd) | [Contributing](#-contributing) | [License](#-license) |

</div>

<br>

---

<br>

## 🎯 Why Prompt Contract Tester?

<div align="center">

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   GPT-4o ──────────┐                                               │
│                     │                                               │
│   Claude 3.5 ──────┼──── 📐 JSON Schema Contract ──── ✅ PASS/❌ FAIL │
│                     │                                               │
│   Mock Local ──────┘                                               │
│                                                                     │
│   Same prompt → Multiple models → Validated responses               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

</div>

<br>

AI models **don't speak the same JSON**. A prompt that returns perfect structured data from GPT-4o might produce **broken JSON** on Claude, or **hallucinate fields** on smaller models.

Prompt Contract Tester eliminates the uncertainty:

- ✅ Define your expected output shape as a **JSON Schema contract**
- ✅ Send the **exact same prompt** to every model
- ✅ **Instantly validate** each response against your contract
- ✅ See **which model failed, and exactly why**

<br>

---

<br>

## ✨ Features

<br>

<table align="center">
  <tr>
    <td align="center" width="33%">
      <br>
      <img src="https://img.icons8.com/fluency/48/pencil.png" width="42" height="42">
      <br><br>
      <b>Prompt Editor</b>
      <br><br>
      <sub>
        Multi-line editor with<br>
        <code>{{placeholder}}</code> detection.<br>
        Dynamic input fields auto-generate<br>
        for each variable found.<br>
        Preview rendered prompt before sending.
      </sub>
      <br><br>
    </td>
    <td align="center" width="33%">
      <br>
      <img src="https://img.icons8.com/fluency/48/document.png" width="42" height="42">
      <br><br>
      <b>Contract Editor</b>
      <br><br>
      <sub>
        Paste any JSON Schema.<br>
        Real-time syntax validation with Ajv.<br>
        Toggle rules independently:<br>
        <code>required</code> · <code>type</code> · <code>pattern</code> · <code>additionalProperties</code>
      </sub>
      <br><br>
    </td>
    <td align="center" width="33%">
      <br>
      <img src="https://img.icons8.com/fluency/48/settings.png" width="42" height="42">
      <br><br>
      <b>Model Config</b>
      <br><br>
      <sub>
        Manage OpenAI, Anthropic,<br>
        and Mock adapters.<br>
        Temperature slider · Max tokens.<br>
        API keys stored exclusively in<br>
        <code>localStorage</code>. Never leaked.
      </sub>
      <br><br>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <br>
      <img src="https://img.icons8.com/fluency/48/play.png" width="42" height="42">
      <br><br>
      <b>Parallel Runner</b>
      <br><br>
      <sub>
        One click → every enabled model<br>
        runs concurrently via<br>
        <code>Promise.all</code>.<br>
        Live progress bar per adapter:<br>
        idle → running → success/fail
      </sub>
      <br><br>
    </td>
    <td align="center" width="33%">
      <br>
      <img src="https://img.icons8.com/fluency/48/combo-chart.png" width="42" height="42">
      <br><br>
      <b>Results Dashboard</b>
      <br><br>
      <sub>
        Sortable table with latency,<br>
        contract status, token count,<br>
        and cost estimate per model.<br>
        Expand any row for raw response,<br>
        parsed JSON, and error details.
      </sub>
      <br><br>
    </td>
    <td align="center" width="33%">
      <br>
      <img src="https://img.icons8.com/fluency/48/time-machine.png" width="42" height="42">
      <br><br>
      <b>History & Export</b>
      <br><br>
      <sub>
        All runs saved to localStorage.<br>
        Sidebar: timestamps, models,<br>
        pass/fail badges.<br>
        Click to restore · Export to JSON.
      </sub>
      <br><br>
    </td>
  </tr>
</table>

<br>

---

<br>

## 🚀 Quick Start

<div align="center">

<br>

```bash
git clone https://github.com/natanaheldr/prompt-contract-tester.git
cd prompt-contract-tester
npm install
npm run dev
```

<br>

Open **[localhost:5173](http://localhost:5173)** — no backend, no config, no API keys needed.

<br>

| | |
|:---|:---|
| 🟢 **Mock adapter** | Works offline. Instant feedback. |
| 🔑 **OpenAI / Anthropic** | Add your own key to test live models. |
| 🔒 **100% Client-side** | Keys never leave your browser. |

<br>

</div>

<br>

---

<br>

## 🎬 Demo

<div align="center">

### Workflow

<br>

```
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │              │     │              │     │              │
  │  1. Write    │ ──▶ │  2. Define   │ ──▶ │  3. Configure │
  │    Prompt    │     │   Contract   │     │    Models     │
  │              │     │              │     │              │
  └──────────────┘     └──────────────┘     └──────────────┘
                                                    │
                                                    ▼
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │              │     │              │     │              │
  │  6. Export   │ ◀── │  5. Review   │ ◀── │  4. Run All  │
  │   Results    │     │   Dashboard  │     │   (Parallel) │
  │              │     │              │     │              │
  └──────────────┘     └──────────────┘     └──────────────┘
```

<br>

### Example Prompt + Contract

<table align="center">
<tr>
<td width="50%">

**Prompt**
```text
Answer the following question about
{{topic}} in {{language}}.

Question: What are the key concepts
of {{topic}}?

Respond with valid JSON only.
```

</td>
<td width="50%">

**Contract (JSON Schema)**
```json
{
  "type": "object",
  "properties": {
    "result": { "type": "string" },
    "data": {
      "type": "object",
      "properties": {
        "answer": { "type": "string" },
        "confidence": { "type": "number" }
      },
      "required": ["answer", "confidence"]
    }
  },
  "required": ["result", "data"]
}
```

</td>
</tr>
</table>

<br>

### Expected Result

<table align="center">
<tr>
<td align="center">🟢 <b>Mock</b></td>
<td>

```json
{
  "result": "success",
  "data": {
    "answer": "This is a deterministic mock response.",
    "confidence": 0.95
  }
}
```
<sub>✅ Contract: <b>PASS</b> · Latency: ~200ms · Cost: $0.00</sub>

</td>
</tr>
</table>

</div>

<br>

---

<br>

## 🛠 Tech Stack

<br>

<div align="center">

| Layer | Technology | Purpose |
|:---:|:---|:---|
| 🖼️ | **React 19** + **TypeScript 5** | UI framework with strict type safety |
| ⚡ | **Vite 8** | Dev server & production bundler |
| 🎨 | **Tailwind CSS v4** | Utility-first dark theme styling |
| ✅ | **Ajv** | JSON Schema compilation & validation |
| 🌐 | **Axios** | HTTP client for LLM API calls |
| 🧪 | **Vitest** + **RTL** | Unit + component testing (17 tests) |
| 🔄 | **GitHub Actions** | CI: lint → test → build on every push |
| 💾 | **localStorage** | State persistence across sessions |

</div>

<br>

---

<br>

## 🔌 Adapters

<br>

<div align="center">

| | OpenAI | Anthropic | Mock |
|:---:|:---:|:---:|:---:|
| | <img src="https://img.icons8.com/fluency/48/openai.png" width="36"> | <img src="https://img.icons8.com/fluency/48/anthropic.png" width="36"> | <img src="https://img.icons8.com/fluency/48/robot.png" width="36"> |
| **Endpoint** | `api.openai.com/v1` | `api.anthropic.com/v1` | _local, no network_ |
| **Auth** | `Bearer` token | `x-api-key` header | _none_ |
| **Errors** | 401 · 429 · 5xx | 401 · 429 · 5xx | _never fails_ |
| **Latency** | ~1-3s | ~1-3s | ~200ms fixed |
| **Key needed** | ✅ | ✅ | ❌ |

</div>

<br>

<div align="center">

> 🔐 API keys stay in your browser's `localStorage`. **Zero server dependencies.** The entire app is a static SPA.

</div>

<br>

---

<br>

## 📂 Architecture

<br>

<div align="center">

```
prompt-contract-tester/
│
├── 📄 .github/workflows/ci.yml    ← CI: lint → test → build
│
├── 📦 src/
│   ├── 🧩 types/index.ts          ← All TypeScript interfaces
│   ├── 🧠 context/AppContext.tsx   ← React Context + useReducer
│   ├── 🔌 adapters/
│   │   ├── types.ts               ← Adapter interface contract
│   │   ├── openai.ts              ← OpenAI chat completions
│   │   ├── anthropic.ts           ← Anthropic messages API
│   │   └── mock.ts                ← Deterministic local adapter
│   ├── 🧱 components/
│   │   ├── Layout.tsx             ← Shell: header + sidebar + main
│   │   ├── PromptEditor.tsx       ← Textarea + placeholder fields
│   │   ├── ContractEditor.tsx     ← JSON Schema editor + rule toggles
│   │   ├── ModelConfigPanel.tsx   ← Model list + add/remove cards
│   │   ├── TestRunner.tsx         ← Run All button + progress cards
│   │   ├── ResultsDashboard.tsx   ← Summary table + expandable rows
│   │   └── HistorySidebar.tsx     ← Past runs sidebar
│   ├── 🔧 utils/
│   │   ├── validateSchema.ts      ← Ajv compiler + data validator
│   │   ├── storage.ts             ← localStorage save/load helpers
│   │   ├── costCalculator.ts      ← Token → USD cost mapping
│   │   └── placeholderParser.ts   ← {{key}} detection + fill
│   └── 🎨 styles/index.css        ← Tailwind v4 + custom scrollbars
│
├── 🧪 tests/
│   ├── setup.ts                   ← Vitest + jest-dom setup
│   ├── adapters.test.ts           ← Mock adapter shape + timing
│   ├── validateSchema.test.ts     ← Schema edge cases
│   └── components/
│       └── PromptEditor.test.tsx  ← Placeholder detection + input
│
└── ⚙️ Config files
    ├── vite.config.ts             ← Vite + Tailwind + Vitest
    ├── tsconfig.json              ← Strict TypeScript
    └── package.json               ← Scripts + dependencies
```

</div>

<br>

---

<br>

## 📜 Scripts

<br>

<div align="center">

| Command | What it does |
|:---|:---|
| `npm run dev` | 🔥 Start Vite dev server on `localhost:5173` |
| `npm run build` | 📦 TypeScript check + production bundle |
| `npm run preview` | 👀 Preview production build locally |
| `npm test` | 🧪 Run all 17 Vitest suites |
| `npm run test:watch` | 🔁 Watch mode for TDD |
| `npm run lint` | 🧹 ESLint / Oxlint static analysis |
| `npm run format` | 💅 Prettier auto-format |

</div>

<br>

---

<br>

## 🧪 Testing

<br>

<div align="center">

| Test File | Coverage | What's Tested |
|:---|:---:|:---|
| `tests/adapters.test.ts` | 4 tests | Mock adapter shape, timing, usage stats |
| `tests/validateSchema.test.ts` | 8 tests | Valid/invalid JSON, required fields, type mismatch, edge cases |
| `tests/components/PromptEditor.test.tsx` | 5 tests | Placeholder detection, input fields, Load Example button |

<br>

```
✓ tests/validateSchema.test.ts      (8 tests)  39ms
✓ tests/components/PromptEditor...  (5 tests)  447ms
✓ tests/adapters.test.ts            (4 tests)  851ms

Test Files  3 passed (3)
     Tests  17 passed (17)
```

</div>

<br>

---

<br>

## 🔄 CI/CD

<div align="center">

Every push to `main` and every PR triggers:

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Checkout │───▶│ npm ci   │───▶│ Lint     │───▶│ Test     │───▶│ Build    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

<br>

<img src="https://img.shields.io/badge/CI-passing-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="CI">

</div>

<br>

---

<br>

## 🤝 Contributing

<div align="center">

<br>

Contributions are welcome! Here's how:

1. 🍴 Fork the repo
2. 🌿 Create a branch: `git checkout -b feature/amazing-feature`
3. 💾 Commit changes: `git commit -m 'Add amazing feature'`
4. 📤 Push: `git push origin feature/amazing-feature`
5. 🔃 Open a Pull Request

<br>

Make sure tests pass: `npm test`

</div>

<br>

---

<br>

<div align="center">

## 📄 License

<br>

**[MIT](./LICENSE)** — Free for personal and commercial use.

<br>
<br>

---

<br>

<img src="https://capsule-render.vercel.app/api?type=waving&color=4F46E5&height=100&section=footer&text=&fontSize=0" width="100%">

</div>
