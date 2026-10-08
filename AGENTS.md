# Project conventions

- Use English for source code, UI copy, documentation (except README.pt-BR.md), and commits.
- Keep every authored text file at or below 150 lines. Generated lockfiles are exempt.
- Run `npm run check:lines`, `npm test`, `npm run build`, and `npm run test:e2e` before delivery.
- Use Conventional Commits: feat, fix, refactor, test, docs, chore.
- Do not add AI attribution or generated co-author trailers to commits.
- Keep domain models independent of React and infrastructure.
- Depend on repository interfaces. Inject infrastructure at the composition root.
- Keep components focused and accessible; preserve keyboard navigation and reduced motion.
- Never claim local demo sessions are real authentication or simulated replies are remote users.
- Do not store passwords, tokens, or private credentials in browser storage or source control.
