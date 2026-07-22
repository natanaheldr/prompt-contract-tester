# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue.

Instead, report it via GitHub's [private vulnerability reporting](https://github.com/natanaheldr/prompt-contract-tester/security/advisories/new).

## Security Design

- **API keys** are stored exclusively in the browser's `localStorage`
- **No backend** — the app is a 100% static SPA with zero server dependencies
- **No data leaves your machine** — all API calls go directly from your browser to the LLM provider
- **No telemetry** — the app does not track, log, or transmit any usage data
