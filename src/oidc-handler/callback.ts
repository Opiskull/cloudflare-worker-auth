import { setAuthCookie } from './cookie';
import { generateStateParam } from './state';
import { decodeJWT, validateToken, encryptSub } from './token';
import { config } from '../config';

export const createRedirectUrl = async (url: URL) => {
  const state = await generateStateParam(url.toString());
  return `${
    config.authorization_endpoint
  }?response_type=code&audience=${
    config.audience
  }&client_id=${
    config.clientId
  }&redirect_uri=${
    config.callbackUrl
  }&scope=openid%20profile%20email&state=${encodeURIComponent(
    state
  )}&nonce=12345`;
};

export const exchangeCode = async (code: string, returnTo: string) => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.callbackUrl
  });

  const exchange = await fetch(config.token_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  return persistAuth(await exchange.json(), returnTo);
};

const persistAuth = async (
  body: { error?: any; id_token: string },
  returnTo: string
) => {
  if (body.error) {
    throw new Error(JSON.stringify(body));
  }

  const decoded = JSON.parse(decodeJWT(body.id_token));
  try {
    validateToken(decoded);
  } catch (err) {
    return { status: 401, body: err.message };
  }

  const id = await encryptSub(decoded.sub);

  await AUTH_STORE.put(id, JSON.stringify(body), {
    expirationTtl: 24 * 61 * 60
  });

  return {
    headers: {
      Location: returnTo,
      ...setAuthCookie(id)
    },
    status: 302
  };
};

export const handleRedirect = async (request: Request) => {
  const url = new URL(request.url);

  const state = url.searchParams.get('state');
  if (!state) {
    return null;
  }

  const storedState = await AUTH_STORE.get(`state-${state}`);
  if (!storedState) {
    return null;
  }

  const code = url.searchParams.get('code');
  if (code) {
    return exchangeCode(code, storedState);
  }

  return null;
};
