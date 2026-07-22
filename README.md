# Prompt Contract Tester

<p align="center">
  <img src="https://img.shields.io/badge/day-001-blue" alt="Day 001">
  <img src="https://img.shields.io/badge/stack-React%20%2B%20TypeScript-3178c6" alt="React + TypeScript">
  <img src="https://img.shields.io/badge/style-Tailwind%20CSS-06b6d4" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/tested%20with-Vitest-6e9f18" alt="Vitest">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License">
</p>

<p align="center">
  <strong>Test the same prompt against multiple AI models and validate the output against a JSON schema contract.</strong>
</p>

---

## Overview

When developers craft prompts for AI models, they need assurances that the prompt produces consistent, structured output regardless of which LLM vendor or model version is used. A prompt that works on GPT-4 may return malformed JSON on Claude or a local model.

**Prompt Contract Tester** lets you:

- Write prompts with `{{placeholders}}` for dynamic content
- Define a **JSON Schema contract** that describes the expected output shape
- Run the same prompt against **OpenAI**, **Anthropic**, and **Mock** models concurrently
- Validate each model's response against the contract
- View latency, token counts, cost estimates, and detailed validation breakdowns
- Save and replay test runs from history

---

## Features

| Feature | Description |
|---------|-------------|
| Prompt Editor | Multi-line textarea with placeholder detection and dynamic input fields |
| Contract Editor | JSON Schema editor with real-time syntax validation |
| Model Config | Add/remove models, configure temperature, max tokens, API keys |
| Test Runner | Concurrent execution across all enabled models with progress tracking |
| Results Dashboard | Sortable table with latency, contract pass/fail, token count, cost |
| Expandable Rows | Click any result to see raw response, parsed JSON, and validation errors |
| History Sidebar | All runs saved to localStorage, click to restore previous tests |
| Export | Download results as JSON |
| Dark Theme | Beautiful dark UI optimized for long testing sessions |

---

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd day-001-prompt-contract-tester

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tech Stack

- **React 19** with **TypeScript** (strict mode)
- **Vite** for lightning-fast builds
- **Tailwind CSS v4** for styling
- **Ajv** for JSON Schema validation
- **Axios** for HTTP requests to LLM APIs
- **Vitest** + **React Testing Library** for testing

---

## Model Adapters

The app includes three pre-configured adapters:

| Adapter | Description | API Key Required |
|---------|-------------|------------------|
| **OpenAI** | Calls `https://api.openai.com/v1/chat/completions` | Yes |
| **Anthropic** | Calls `https://api.anthropic.com/v1/messages` | Yes |
| **Mock** | Returns deterministic JSON after 200ms delay | No |

All API keys are stored **only in your browser's localStorage**. They are never sent to any backend.

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## Architecture

```
src/
├── types/          # TypeScript interfaces and types
├── context/        # React Context + useReducer global state
├── adapters/       # Model adapter implementations
├── components/     # React UI components
├── utils/          # Validation, storage, cost calculation
└── styles/         # Tailwind CSS directives and custom styles
```

---

## License

MIT — see [LICENSE](./LICENSE) file for details.

---

<p align="center">
  <sub>Day 001 of 100 Days of Code · Built with TypeScript + React + Tailwind CSS</sub>
</p>
