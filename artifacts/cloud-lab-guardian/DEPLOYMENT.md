# Deployment Guide

Cloud Lab Guardian is a static React app that runs entirely in the browser. Deployment is straightforward — no database, no auth layer, no secret management required for the default configuration.

---

## Replit deployment

Cloud Lab Guardian is built and hosted on Replit.

### Dev server

The Replit workflow starts the Vite dev server automatically:

```
pnpm --filter @workspace/cloud-lab-guardian dev
```

The server binds to the `PORT` environment variable. If `PORT` is unset, it defaults to `3000`. Replit assigns this automatically. The app is accessible via the Replit preview pane or your `*.replit.app` domain.

### Production build

To build a production bundle:

```bash
pnpm --filter @workspace/cloud-lab-guardian build
```

Output goes to `dist/public/`. Serve the `index.html` with any static host (Replit Deployments, Netlify, Vercel, S3 + CloudFront, etc.).

---

## Optional: Lambda Function URL backend

By default, the full pipeline runs locally in the browser. You can optionally route it to an AWS Lambda Function URL for server-side execution, logging, or caching.

### 1. Create the Lambda function

- Runtime: Node.js 20.x
- Handler: `index.handler`
- Memory: 256 MB (pipeline is CPU-light)
- Timeout: 15 seconds

The handler should receive:

```json
{
  "idea": "string",
  "skillLevel": "complete-beginner | some-experience | developer",
  "budget": "$0 | Up to $1 | Up to $10 | No limit",
  "region": "us-east-1"
}
```

And return the full `LabPlan` JSON object.

### 2. Create a Function URL

Recommended default:

- Auth type: `AWS_IAM`
- CORS: restrict allowed origins to your app domain
- Reserved concurrency: keep low for demos
- Input size: reject large request bodies in the Lambda handler before processing

`AWS_IAM` is the safest default where practical, but a static frontend cannot call an `AWS_IAM` Function URL directly unless requests are signed or proxied. Do not place AWS credentials in frontend code. If you set `VITE_LAB_GUARDIAN_API_URL` to call Lambda directly from the browser, the endpoint must be browser-callable; `AuthType: NONE` is public unauthenticated access and should be demo-only.

AWS CLI example with both required invoke permissions:

```bash
aws lambda create-function-url-config \
  --function-name cloud-lab-guardian \
  --auth-type AWS_IAM \
  --region us-east-1

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

aws lambda add-permission \
  --function-name cloud-lab-guardian \
  --statement-id FunctionURLAllowAuthenticatedUrl \
  --action lambda:InvokeFunctionUrl \
  --principal "$ACCOUNT_ID" \
  --function-url-auth-type AWS_IAM \
  --region us-east-1

aws lambda add-permission \
  --function-name cloud-lab-guardian \
  --statement-id FunctionURLAllowAuthenticatedInvoke \
  --action lambda:InvokeFunction \
  --principal "$ACCOUNT_ID" \
  --invoked-via-function-url \
  --region us-east-1
```

Demo-only option: `AuthType: NONE` means public unauthenticated access. Use it only for throwaway demos with strict CORS, low reserved concurrency, input size validation, CloudWatch alarms, a Zero Spend Budget alert, and fast cleanup.

### 3. Set the environment variable

```bash
VITE_LAB_GUARDIAN_API_URL=https://your-url.lambda-url.us-east-1.on.aws/
```

In Replit: add this as an environment variable. Locally: add it to `.env.local`. This is a public frontend variable; do not put API keys, bearer tokens, AWS credentials, or secrets in any `VITE_` variable.

### 4. Verify the mode badge

After setting the variable, run the app and submit a prompt. The badge in the top-right of the results should show **"Lambda API mode"** (blue). If it shows **"Lambda failed, using local fallback"** (amber), check:
- The Function URL is reachable
- CORS headers are set correctly
- The Lambda role has no policy blocking the invocation

---

## CORS warning

If you deploy the Lambda Function URL with `CORS: Allow all origins (*)`, **anyone can call your endpoint**. This could lead to unexpected Lambda invocations and charges.

Recommended mitigations:
- Restrict allowed origins to your app's domain
- Set reserved concurrency (see below)
- Validate and cap request body size in your Lambda handler
- Enable a Zero Spend Budget alert on the account hosting the Lambda

---

## Public endpoint warning

A Lambda Function URL with `AuthType: NONE` is public unauthenticated access. Before sharing or publishing your app:

1. Confirm your Lambda does not have write access to any AWS resources
2. Set reserved concurrency to cap maximum invocations
3. Enable CloudWatch alarms on error rate and invocation count
4. Validate and reject oversized request bodies
5. Add a Zero Spend Budget alert (AWS Console → Billing → Budgets → Zero spend budget)

---

## Reserved concurrency recommendation

Set reserved concurrency on the Lambda to limit the blast radius if the endpoint is discovered or abused:

```bash
aws lambda put-function-concurrency \
  --function-name cloud-lab-guardian \
  --reserved-concurrent-executions 10 \
  --region us-east-1
```

This caps the function at 10 concurrent executions — more than enough for a portfolio demo.

---

## Cleanup reminder

When you are done with the Lambda backend:

```bash
# Remove Function URL permissions if you created them
aws lambda remove-permission \
  --function-name cloud-lab-guardian \
  --statement-id FunctionURLAllowAuthenticatedUrl \
  --region us-east-1
aws lambda remove-permission \
  --function-name cloud-lab-guardian \
  --statement-id FunctionURLAllowAuthenticatedInvoke \
  --region us-east-1

# Delete the Function URL config
aws lambda delete-function-url-config \
  --function-name cloud-lab-guardian \
  --region us-east-1

# Delete the function
aws lambda delete-function \
  --function-name cloud-lab-guardian \
  --region us-east-1

# Delete the IAM role
aws iam detach-role-policy \
  --role-name cloud-lab-guardian-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam delete-role --role-name cloud-lab-guardian-role

# Verify no charges (check after 24 hours)
aws ce get-cost-and-usage \
  --time-period Start=$(date -d '1 day ago' +%Y-%m-%d 2>/dev/null || date -v-1d +%Y-%m-%d),End=$(date +%Y-%m-%d) \
  --granularity DAILY \
  --metrics UnblendedCost
```

---

*Cloud Lab Guardian v0.1.0*
