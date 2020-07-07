import { setAuthCookie } from './cookie';
import { generateStateParam } from './state';
import { decodeJWT, validateToken, encryptSub } from './token';
import { config } from './config';

export const createRedirectUrl = async () => {
  const state = await generateStateParam();
  return `${config.domain}/authorize?response_type=code&client_id=${
    config.clientId
  }&redirect_uri=${
    config.callbackUrl
  }&scope=openid%20profile%20email&state=${encodeURIComponent(state)}`;
};

export const exchangeCode = async (code: string) => {
  const body = JSON.stringify({
    grant_type: 'authorization_code',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.callbackUrl
  });

  return persistAuth(
    await fetch(`${config.domain}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body
    })
  );
};

const persistAuth = async (exchange: Response) => {
  const body = await exchange.json();

  if (body.error) {
    throw new Error(body.error);
  }

  const decoded = JSON.parse(decodeJWT(body.id_token));
  const validToken = validateToken(decoded);
  if (!validToken) {
    return { status: 401 };
  }

  const id = await encryptSub(decoded.sub);

  await AUTH_STORE.put(id, JSON.stringify(body));

  const headers = {
    Location: '/',
    ...setAuthCookie(id)
  };

  return { headers, status: 302 };
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
    return exchangeCode(code);
  }

  return null;
};
