import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function resolveRegion(): string {
  if (process.env.CTP_REGION) {
    return process.env.CTP_REGION;
  }

  const authUrl = process.env.CTP_AUTH_URL;
  if (authUrl) {
    const match = authUrl.match(/auth\.(.+)\.commercetools\.com/);
    if (match?.[1]) {
      return match[1];
    }
  }

  throw new Error(
    'Set CTP_REGION (for example australia-southeast1.gcp) or CTP_AUTH_URL'
  );
}

function buildHost(prefix: 'auth' | 'api', region: string): string {
  return `https://${prefix}.${region}.commercetools.com`;
}

export const projectKey = requireEnv('CTP_PROJECT_KEY');

export const authUrl =
  process.env.CTP_AUTH_URL ?? buildHost('auth', resolveRegion());

export const apiUrl =
  process.env.CTP_API_URL ?? buildHost('api', resolveRegion());

export const clientId = requireEnv('CTP_CLIENT_ID');
export const clientSecret = requireEnv('CTP_CLIENT_SECRET');

export const scopes = (process.env.CTP_SCOPES ?? '')
  .split(/\s+/)
  .map((scope) => scope.trim())
  .filter(Boolean);

if (scopes.length === 0) {
  throw new Error(
    'Missing CTP_SCOPES. Add space-separated scopes for your API client.'
  );
}
