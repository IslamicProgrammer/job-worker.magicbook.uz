// Fetches secrets from the self-hosted Infisical via its REST API using the Universal Auth
// machine identity, injects them into the environment, then execs the given command.
// Uses the v3 raw-secrets endpoint on purpose: this self-hosted server predates the CLI's
// /api/v4/secrets route (the CLI 404s against it), and Node 20 ships global fetch, so this
// needs no infisical CLI at all. ponytail: REST fetch avoids CLI/server API-version skew.
import { spawn } from "node:child_process";

const base = (process.env.INFISICAL_API_URL || "").replace(/\/+$/, "");
const clientId = process.env.INFISICAL_UA_CLIENT_ID;
const clientSecret = process.env.INFISICAL_UA_CLIENT_SECRET;
const projectId = process.env.INFISICAL_PROJECT_ID;
const environment = process.env.INFISICAL_ENV || "prod";

async function loadSecrets() {
  if (!base || !clientId || !clientSecret || !projectId) {
    throw new Error("missing INFISICAL_API_URL / UA_CLIENT_ID / UA_CLIENT_SECRET / PROJECT_ID");
  }
  const login = await fetch(`${base}/api/v1/auth/universal-auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ clientId, clientSecret }),
  });
  if (!login.ok) throw new Error(`login ${login.status}: ${await login.text()}`);
  const { accessToken } = await login.json();

  const url = `${base}/api/v3/secrets/raw?workspaceId=${projectId}&environment=${environment}&secretPath=%2F`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`fetch ${res.status}: ${await res.text()}`);
  const { secrets = [] } = await res.json();

  const injected = {};
  for (const s of secrets) injected[s.secretKey] = s.secretValue;
  console.error(`[infisical] injected ${secrets.length} secrets from '${environment}'`);
  return injected;
}

const injected = await loadSecrets().catch((e) => {
  console.error("[infisical] bootstrap failed:", e.message);
  process.exit(1);
});

const [cmd, ...args] = process.argv.slice(2);
if (!cmd) {
  console.error("[infisical] no command given to exec");
  process.exit(1);
}
const child = spawn(cmd, args, { stdio: "inherit", env: { ...process.env, ...injected } });
child.on("exit", (code, signal) => process.exit(signal ? 1 : code ?? 0));
