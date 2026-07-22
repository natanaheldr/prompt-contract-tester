<div align="center">

<br>

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=32&duration=2800&pause=600&color=818CF8&center=true&vCenter=true&width=700&height=70&lines=%E2%9A%A1+Prompt+Contract+Tester;%F0%9F%A7%AA+Write+once.+Test+everywhere." alt="Typing SVG" />

<br>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
<img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/Vitest-17/17_passing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Tests" />
<img src="https://img.shields.io/badge/License-MIT-success?style=for-the-badge" alt="License" />

<br>
<br>

<img src="./screenshots/app-full.png" width="90%" alt="Prompt Contract Tester Screenshot" />

<br>
<br>

**Send one prompt to multiple AI models. Validate every response against your JSON Schema contract.**

</div>

<br>

---

## Why?

AI models don't all speak the same JSON. A prompt that returns perfect structured data from GPT-4o might produce broken JSON on Claude, or hallucinate fields on smaller models.

**Prompt Contract Tester** solves this by letting you define your expected output shape as a JSON Schema contract and validating every model's response against it — in real time, across models, with full detail on what failed and why.

---

## Quick Start

```bash
git clone https://github.com/natanaheldr/prompt-contract-tester.git
cd prompt-contract-tester
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173). The **Mock adapter** works immediately with no API keys. Add OpenAI or Anthropic keys to test against live models. All keys stay in your browser's localStorage — never transmitted anywhere.

---

## Features

| | | |
|:---|:---|:---|
| **Prompt Editor** | Multi-line editor with `{{placeholder}}` detection. Input fields auto-generate for each variable. Preview rendered prompt before sending. | `{{topic}}` `{{language}}` |
| **Contract Editor** | Paste any JSON Schema. Real-time syntax validation via Ajv. Toggle rules: `required`, `type`, `pattern`, `additionalProperties`. | JSON Schema |
| **Model Config** | Manage OpenAI, Anthropic, and Mock adapters. Temperature slider, max tokens, masked API key input per model. | ⚙️ |
| **Parallel Runner** | One click sends your prompt to every enabled model concurrently via `Promise.all`. Live progress bars per adapter. | 🚀 |
| **Results Dashboard** | Table: latency, contract pass/fail, token count, cost estimate. Expand any row for raw response + validation errors. | 📊 |
| **History & Export** | All runs saved to localStorage. Sidebar lists past runs with timestamps and pass/fail badges. Export results as JSON. | 💾 |

---

## Demo: Example Workflow

**Step 1 — Write a prompt with placeholders:**

```text
Answer the following question about {{topic}} in {{language}}.
Question: What are the key concepts of {{topic}}?
Respond with valid JSON only.
```

**Step 2 — Define your contract (JSON Schema):**

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

**Step 3 — Run against Mock adapter (instant result):**

```json
{
  "result": "success",
  "data": {
    "answer": "This is a deterministic mock response for testing purposes.",
    "confidence": 0.95
  }
}
```

`PASS` · Latency: ~200ms · Cost: $0.00

---

## Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|:---:|:---|:---|
| UI | React 19 + TypeScript 5 | Strict type-safe components |
| Build | Vite 8 | Dev server + production bundler |
| Style | Tailwind CSS v4 | Utility-first dark theme |
| Validation | Ajv | JSON Schema compilation & validation |
| HTTP | Axios | LLM API calls with error handling |
| Testing | Vitest + React Testing Library | 17 unit + component tests |
| CI | GitHub Actions | Lint → Test → Build on push |
| Storage | localStorage | State persistence, no backend |

</div>

---

## Adapters

| | OpenAI | Anthropic | Mock |
|:---|:---:|:---:|:---:|
| **Endpoint** | `api.openai.com/v1` | `api.anthropic.com/v1` | local, no network |
| **Auth** | `Bearer` token | `x-api-key` header | none |
| **Errors handled** | 401, 429, 5xx | 401, 429, 5xx | never fails |
| **Latency** | ~1–3s | ~1–3s | ~200ms fixed |
| **API key** | Required | Required | Not needed |

API keys are stored exclusively in your browser's **localStorage**. The app is 100% client-side with zero server dependencies.

---

## Project Structure

```
src/
├── types/
│   └── index.ts              TypeScript interfaces
├── context/
│   └── AppContext.tsx         React Context + useReducer
├── adapters/
│   ├── types.ts              Adapter interface
│   ├── openai.ts             OpenAI chat completions
│   ├── anthropic.ts          Anthropic messages API
│   └── mock.ts               Deterministic local adapter
├── components/
│   ├── Layout.tsx            Header + sidebar + main
│   ├── PromptEditor.tsx      Textarea + placeholder fields
│   ├── ContractEditor.tsx    JSON Schema editor + rule toggles
│   ├── ModelConfigPanel.tsx  Model list management
│   ├── TestRunner.tsx        Run All + progress tracking
│   ├── ResultsDashboard.tsx  Summary table + expandable rows
│   └── HistorySidebar.tsx    Past runs sidebar
├── utils/
│   ├── validateSchema.ts     Ajv compiler + data validator
│   ├── storage.ts            localStorage helpers
│   ├── costCalculator.ts     Token → USD mapping
│   └── placeholderParser.ts  {{key}} detection + fill
└── styles/
    └── index.css             Tailwind v4 + custom scrollbars

tests/
├── setup.ts
├── adapters.test.ts          4 tests
├── validateSchema.test.ts    8 tests
└── components/
    └── PromptEditor.test.tsx  5 tests
```

---

## Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Start dev server on `localhost:5173` |
| `npm run build` | TypeScript check + production bundle |
| `npm run preview` | Preview production build |
| `npm test` | Run all 17 Vitest suites |
| `npm run test:watch` | Watch mode for development |
| `npm run lint` | Oxlint static analysis |
| `npm run format` | Prettier auto-format |

---

## Testing

```
✓ tests/validateSchema.test.ts      (8 tests)
✓ tests/components/PromptEditor...  (5 tests)
✓ tests/adapters.test.ts            (4 tests)

Test Files  3 passed (3)
     Tests  17 passed (17)
```

<br>

<div align="center">

| Test Suite | Tests | What's Covered |
|:---|:---:|:---|
| `adapters.test.ts` | 4 | Mock adapter shape, timing, usage stats |
| `validateSchema.test.ts` | 8 | Valid/invalid JSON, required fields, type mismatch, edge cases |
| `PromptEditor.test.tsx` | 5 | Placeholder detection, input fields, Load Example |

</div>

---

## CI/CD

Every push to `main` triggers: **Checkout → Install → Lint → Test → Build**

All steps run on GitHub Actions with zero secrets required.

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/amazing`
5. Open a Pull Request

Make sure `npm test` passes before submitting.

---

## License

[MIT](./LICENSE) — free for personal and commercial use.

<br>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=4F46E5&height=80&section=footer" width="100%" />

</div>
