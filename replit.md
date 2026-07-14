# Cloud Lab Guardian

An agentic AWS project mentor for safe beginner cloud labs. A beginner types an AWS project idea and the app generates a comprehensive, free-tier-aware lab plan with architecture, security warnings, cost review, step-by-step CLI commands, and a downloadable portfolio README.

## Run & Operate

- `pnpm --filter @workspace/cloud-lab-guardian run dev` — run the frontend (port 20255)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, not used by this app)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, wouter
- Agent pipeline: deterministic/rule-based TypeScript (no paid APIs required)
- Build: Vite (static)

## Where things live

- `artifacts/cloud-lab-guardian/src/lib/guardianAgent.ts` — the entire rule-based agent pipeline (normalizeUserIdea, detectServices, generateArchitecture, generateSecurityReview, generateCostReview, generateSteps, generateCleanup, generateReadme, runGuardianPipeline)
- `artifacts/cloud-lab-guardian/src/pages/Home.tsx` — main page (form + results)
- `artifacts/cloud-lab-guardian/src/components/GuardianForm.tsx` — input form
- `artifacts/cloud-lab-guardian/src/components/PlanResults.tsx` — results display with tabs
- `artifacts/cloud-lab-guardian/src/components/sections/` — one file per results section

## Architecture decisions

- Fully frontend-only: the entire agent pipeline is deterministic TypeScript, no backend needed.
- Optionally delegates to a Lambda Function URL if `LAB_GUARDIAN_API_URL` env var is set (falls back to local pipeline on failure).
- No user data is stored — everything is computed on-demand in the browser.
- Service detection is keyword-based with a fixed ruleset in `guardianAgent.ts`.

## Product

Users describe an AWS project idea, choose their skill level and budget tolerance, and get:
1. Clarifying questions to think through
2. Detected AWS services with risk levels and free-tier details
3. Architecture description with ASCII diagram and component cards
4. Step-by-step CLI implementation guide with copyable commands
5. Security review with severity-rated warnings, IAM recommendations, best practices
6. Cost and free-tier analysis with budget advice
7. Interactive cleanup checklist with CLI teardown commands
8. Downloadable portfolio README.md

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `FileMarkdown` does not exist in lucide-react — use `FileText` instead.
- The app is frontend-only; avoid adding backend dependencies unless the user asks.
- `LAB_GUARDIAN_API_URL` can be set as a Vite env var to delegate to a Lambda Function URL.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
