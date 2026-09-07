---
name: tsc-build-silent-fail
description: `tsc -p tsconfig.build.json && vite build` exits non-zero on tsc error but vite may still run
metadata:
  type: feedback
---

The build script in `package.json` is `tsc -p tsconfig.build.json && vite build`. If tsc fails (e.g. TS5096 from `allowImportingTsExtensions` + `noEmit: true` conflict), the `&&` should stop the chain — but in some shells, npm, or terminal configurations the error gets swallowed and vite still runs, producing a `dist/` that builds successfully. You get exit 0 on npm and assume everything's fine, but type errors slipped through and the deploy artifact doesn't match what you expect locally.

**Why:** Silent build failure mode is hard to detect. `wrangler deploy` succeeded, the app rendered, but the type errors meant the wrong code shipped.

**How to apply:** Always run `npx tsc -p tsconfig.build.json` first, check the exit code, then run `vite build`. Or set `tsc -p tsconfig.build.json --noEmit && vite build` to make tsc a pure type-check and never short-circuit. The tsc config must allow `allowImportingTsExtensions` + `noEmit: true` together (TS5096) — set both explicitly in `tsconfig.build.json`'s `compilerOptions`.
