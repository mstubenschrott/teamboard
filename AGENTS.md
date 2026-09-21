# Agent Guidelines

## General

- Read `CONTRIBUTING.md` before making any commits or branches. Follow its conventions exactly.
- Do not modify `CONTRIBUTING.md` or `AGENTS.md` unless explicitly asked.

## Branching & Commits

- Branch names: `type/short-description` — e.g. `feat/ticket-api`, `fix/column-layout`.
- Commit messages: `type: short summary` — e.g. `feat: add ticket creation endpoint`.
- Allowed types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`.
- Use lowercase, kebab-case for branches and imperative mood for commit summaries.

## Code Style

- Match the formatting of existing files (indentation, quote style, etc.).
- If a formatter config is present (`.prettierrc`, `.editorconfig`, etc.), run it before committing.
- Do not introduce new dependencies without explicit approval.

## File Changes

- Prefer editing existing files over creating new ones.
- Do not delete files without explicit instruction.
- Keep changes minimal and scoped to what was asked.
