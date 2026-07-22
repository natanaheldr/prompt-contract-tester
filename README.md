<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=500&color=818CF8&center=true&vCenter=true&width=600&lines=Prompt+Contract+Tester">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=500&color=4F46E5&center=true&vCenter=true&width=600&lines=Prompt+Contract+Tester" alt="Prompt Contract Tester">
</picture>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-square" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square" alt="Tailwind">
  <img src="https://img.shields.io/badge/Vitest-passing-6E9F18?logo=vitest&logoColor=white&style=flat-square" alt="Tests">
  <img src="https://img.shields.io/badge/license-MIT-success?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/CI-github%20actions-2088FF?logo=githubactions&logoColor=white&style=flat-square" alt="CI">
</p>

<br>

<p align="center">
  <strong>
    Write once. Test everywhere. Validate automatically.
  </strong>
</p>

<p align="center">
  <sub>
    Send the same prompt to OpenAI, Anthropic, and local models.<br>
    Validate every response against your JSON Schema contract in real time.
  </sub>
</p>

<br>

---

<br>

## Why Prompt Contract Tester?

AI models don't all speak the same JSON. A prompt that returns perfectly structured data from GPT-4o might produce broken JSON on Claude, or hallucinate fields on smaller models. **Prompt Contract Tester** eliminates the guesswork — you define your expected output shape as a JSON Schema contract, and the tool validates every model's response against it, instantly.

|  |  |  |
|:---:|:---:|:---:|
| `{{placeholders}}` | JSON Schema | Multi-model |
| Dynamic prompts with<br>variable interpolation | Strict output contracts<br>powered by Ajv | Concurrent testing across<br>OpenAI · Anthropic · Mock |

<br>

---

<br>

## Features

<table>
  <tr>
    <td width="50%">
      <h3>✍️ Prompt Editor</h3>
      <p>Write multi-line prompts with <code>{{placeholders}}</code>. Dynamic input fields auto-generate for each detected variable. Preview the rendered result before sending.</p>
    </td>
    <td width="50%">
      <h3>📋 Contract Editor</h3>
      <p>Paste any JSON Schema. Real-time syntax validation with Ajv. Toggle rules: <code>required</code>, <code>type</code>, <code>pattern</code>, <code>additionalProperties</code>.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>⚙️ Model Configuration</h3>
      <p>Manage adapters for OpenAI, Anthropic, and Mock. Set temperature, max tokens, and API keys per model. Keys stored exclusively in <code>localStorage</code>.</p>
    </td>
    <td width="50%">
      <h3>🚀 Parallel Test Runner</h3>
      <p>One click sends your prompt to every enabled model concurrently. Live progress bars show <code>idle → running → success/fail</code> per adapter.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📊 Results Dashboard</h3>
      <p>Sortable table: latency, contract status, token count, cost estimate. Click any row to expand raw response, parsed JSON, and validation error details.</p>
    </td>
    <td width="50%">
      <h3>📜 History & Export</h3>
      <p>All runs saved to <code>localStorage</code>. Sidebar lists timestamps, models tested, pass/fail summary. Export results as JSON with one click.</p>
    </td>
  </tr>
</table>

<br>

---

<br>

## Quick Start

```bash
git clone https://github.com/natanaheldr/prompt-contract-tester.git
cd prompt-contract-tester
npm install
npm run dev
```

Open [**localhost:5173**](http://localhost:5173) — no backend, no config, no API keys required to start.

> **Mock adapter works offline.** Add your own OpenAI or Anthropic keys to test against live models.

<br>

---

<br>

## Tech Stack

<table align="center">
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br><sub><b>React 19</b></sub>
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=typescript" width="48" height="48" alt="TypeScript" />
      <br><sub><b>TypeScript</b></sub>
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=vite" width="48" height="48" alt="Vite" />
      <br><sub><b>Vite</b></sub>
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
      <br><sub><b>Tailwind v4</b></sub>
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=vitest" width="48" height="48" alt="Vitest" />
      <br><sub><b>Vitest</b></sub>
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=githubactions" width="48" height="48" alt="Actions" />
      <br><sub><b>CI/CD</b></sub>
    </td>
  </tr>
</table>

<br>

---

<br>

## Adapters

| Adapter | Endpoint | Auth | Rate Limit Handling |
|:---|:---|:---|:---|
| **OpenAI** | `api.openai.com/v1/chat/completions` | `Bearer` token | 401 · 429 · 5xx |
| **Anthropic** | `api.anthropic.com/v1/messages` | `x-api-key` header | 401 · 429 · 5xx |
| **Mock** | _local, no network_ | none | Deterministic (200ms) |

<br>

> **Security:** API keys are stored in your browser's `localStorage` only. They are **never** transmitted to any backend or third party. The entire app runs client-side with zero server dependencies.

<br>

---

<br>

## Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Start Vite dev server on `localhost:5173` |
| `npm run build` | TypeScript check + production bundle |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run all Vitest suites (17 tests) |
| `npm run test:watch` | Watch mode for development |
| `npm run lint` | ESLint / Oxlint check |

<br>

---

<br>

## Project Structure

```
src/
├── adapters/        OpenAI · Anthropic · Mock implementations
├── components/       PromptEditor · ContractEditor · TestRunner · Dashboard
├── context/          React Context + useReducer (global state)
├── styles/           Tailwind v4 directives + custom scrollbars
├── types/            TypeScript interfaces & discriminated unions
└── utils/            Ajv validation · localStorage · cost calc · placeholders
```

```
tests/
├── adapters.test.ts              Mock adapter shape & timing
├── validateSchema.test.ts        JSON Schema validation edge cases
└── components/
    └── PromptEditor.test.tsx     Placeholder detection & user input
```

<br>

---

<br>

## License

[MIT](./LICENSE) — free for personal and commercial use.

<br>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=4F46E5&height=80&section=footer" width="100%">
</p>
