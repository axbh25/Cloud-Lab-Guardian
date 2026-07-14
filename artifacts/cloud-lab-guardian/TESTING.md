# Testing Guide

Cloud Lab Guardian has a suite of **81 golden tests** that verify every safety invariant across five canonical AWS project prompts. Tests run in under 600 ms with no network calls.

---

## Run the tests

```bash
# All tests
pnpm --filter @workspace/cloud-lab-guardian test

# TypeScript typecheck (zero errors required)
pnpm --filter @workspace/cloud-lab-guardian typecheck

# Production build (confirms no bundler errors)
PORT=3000 pnpm --filter @workspace/cloud-lab-guardian build
```

---

## Test file

```
artifacts/cloud-lab-guardian/src/lib/guardianAgent.test.ts
```

Tests are written with [Vitest](https://vitest.dev/) and use no mocks — they call the real exported pipeline functions directly.

---

## The 5 golden prompts

Each prompt is tested at a specific budget and skill level. Together they cover the full range of plausible user inputs.

| # | Prompt | Budget |
|---|---|---|
| 1 | "Create a beginner AWS AI project using S3 and Lambda." | $0 |
| 2 | "Build a serverless image uploader." | $0 |
| 3 | "Build an app with EC2, RDS, NAT Gateway, and public S3." | $10 |
| 4 | "Create a Bedrock chatbot with a $0 budget." | $0 |
| 5 | "Build a Lambda Function URL API." | $0 |

---

## Safety invariants tested on every prompt

For each of the 5 prompts, the suite verifies:

| Invariant | Test description |
|---|---|
| Public S3 warning | If S3 is detected, the security review must warn about public access |
| AdministratorAccess warning | Always present in the security review |
| Hardcoded key warning | Always present in the security review |
| Beginner budget setup | Step 1 includes Zero Spend Budget via the AWS Console |
| S3 path format | `s3://BUCKET_NAME` — never `s3: /BUCKET_NAME` or bare `BUCKET_NAME` |
| IAM ARN format | No spaces (`arn:aws:iam::` not `arn:aws:iam ::`) |
| No single-hyphen flags | `aws` lines use `--region` not `-region` |
| Cleanup present | Every plan includes at least one cleanup command |
| CloudShell-first setup | Step 2 recommends CloudShell or IAM Identity Center before access keys |

---

## Prompt-specific invariants

### Prompt 3 — EC2 + RDS + public S3 ($10)

| Invariant | Test |
|---|---|
| EC2 marked high-risk | EC2 appears in `paidRisks` (not freetier) |
| RDS marked high-risk | RDS appears in `paidRisks` |
| Security group warning | Security review mentions restricting security groups |

### Prompt 4 — Bedrock chatbot ($0)

| Invariant | Test |
|---|---|
| Bedrock not required | Bedrock does NOT appear in `paidRisks` for a $0 budget |
| Bedrock labeled Optional Advanced | The cost review entry mentions "Optional Advanced" |

### Prompt 5 — Lambda Function URL API ($0)

| Invariant | Test |
|---|---|
| No API Gateway detected | **Regression:** "api" in "Function URL API" must not trigger API Gateway |
| Lambda Function URL step | Steps include a Lambda Function URL setup step |
| Function URL cleanup | Cleanup includes `delete-function-url-config`, not `apigatewayv2 delete-api` |
| `--function-name` present | Steps contain `--function-name` flag |
| `--region` present | Steps contain `--region` flag |

---

## CLI format audit suite

A separate `describe` block runs against all 5 prompts to audit every generated AWS CLI command:

- No single-hyphen long flags (e.g. `-region` would fail, `--region` passes)
- Region values match `/^[a-z][a-z0-9-]+$/` — no trailing `)` from subshell expressions
- IAM ARNs contain no spaces
- S3 paths use `s3://` prefix

---

## Regression: Lambda Function URL API detection

**Issue (found during final verification):** The phrase "Build a Lambda Function URL **API**" contains the keyword `"api"`, which previously triggered API Gateway detection even though the user explicitly asked for a Lambda Function URL.

**Fix:** In `detectServices`, after the keyword loop, if the normalized idea contains `"function url"`, the API Gateway entry is removed and Lambda is ensured present.

**Regression test:**

```ts
it('does NOT detect API Gateway (user asked for Function URL, not API Gateway)', () => {
  expect(plan.detectedServices.some((s) => s.name === 'API Gateway')).toBe(false);
});
```

This test is unconditional — it will catch any future regression that reintroduces the bad detection.

---

## Vitest configuration

```
artifacts/cloud-lab-guardian/vitest.config.ts
```

- Uses Vite's default environment
- `@` alias points to `src/`
- No separate setup file needed — tests are self-contained

---

*Cloud Lab Guardian v0.1.0*
