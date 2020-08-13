import { hasAuthCookie, getAuthCookie } from './cookie';
import { decodeJWT } from './token';

const verify = async (event: FetchEvent) => {
  if (hasAuthCookie(event.request)) {
    const sub = getAuthCookie(event.request);
    if (!sub) {
      return {};
    }

    const kvData = await AUTH_STORE.get(sub);
    if (!kvData) {
      throw new Error('Unable to find authorization data');
    }

    let kvStored;
    try {
      kvStored = JSON.parse(kvData);
    } catch (err) {
      throw new Error('Unable to parse auth information from Workers KV');
    }

    const { access_token: accessToken, id_token: idToken } = kvStored;
    const userInfo = JSON.parse(decodeJWT(idToken));
    return { accessToken, idToken, userInfo };
  }
  return {};
};

export const authorize = async (event: FetchEvent) => {
  const authorization = await verify(event);
  if (authorization.accessToken) {
    return { isAuthorized: true, authorization };
  } else {
    return { isAuthorized: false };
  }
};
