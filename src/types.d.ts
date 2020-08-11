export {};

declare global {
  const AUTH_STORE: KVNamespace;
  const CONFIG_SALT: string;
  const CONFIG_AUTHORIZATION_ENDPOINT: string;
  const CONFIG_TOKEN_ENDPOINT: string;
  const CONFIG_DOMAIN: string;
  const CONFIG_ISSUER: string;
  const CONFIG_CLIENT_ID: string;
  const CONFIG_CLIENT_SECRET: string;
  const CONFIG_CALLBACK_URL: string;
}
