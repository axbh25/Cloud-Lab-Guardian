---
name: Cloud Lab Guardian pipeline
description: Design decisions, safety rules, and test patterns for guardianAgent.ts
---

## Key rules

- `generateArchitecture` takes a `budget` param — for $0 + Bedrock, it appends an "Optional Advanced" warning to the description.
- `generateCostReview` for $0 + Bedrock: puts Bedrock in `freetiierItems` as "Optional Advanced / High Risk — NOT in $0 MVP path" rather than `paidRisks`, and skips the `continue` for all other high-risk services.
- `generateCleanup` is fully conditional: API Gateway teardown only when API Gateway is detected; Lambda Function URL teardown when Lambda present but API Gateway absent.
- `generateSteps` is console-first: Step 1 = AWS Console MFA + Zero spend budget (CLI budget JSON in a commented-out "advanced" block); Step 2 = CloudShell recommended, IAM Identity Center preferred, long-term access keys in a `# ⚠️ Advanced local option` block.
- `PipelineMode` is tracked in `LabPlan` and shown as a badge in the UI: "local", "lambda", "lambda-fallback".
- `import.meta.env` in guardianAgent.ts requires `src/vite-env.d.ts` with `/// <reference types="vite/client" />` for typecheck to pass.

**Why:** Release hardening spec — correctness, beginner safety, portfolio readiness.

## Test setup

- vitest installed as a devDependency; config at `vitest.config.ts` (separate from vite config).
- Test file: `src/lib/guardianAgent.test.ts` — 80 tests across 5 golden prompts.
- Run: `pnpm --filter @workspace/cloud-lab-guardian test`
- Tests call individual pipeline functions directly (not `runGuardianPipeline`) to avoid `import.meta.env` issues.

## Regex gotchas in tests

- To detect malformed IAM ARNs with spaces: use `\s+` not `\s*` (zero-or-more matches valid ARNs too).
- To detect single-hyphen AWS CLI flags: filter lines starting with `aws `, then check `/ -[a-z]{2,}/` (single space + single hyphen + 2+ letters).
- To extract region values: use `matchAll` with a capture group `/--region\s+([a-z][a-z0-9-]*)/g` to avoid capturing trailing `)` from subshell expressions.
