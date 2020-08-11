import { config } from './config';
import { getRandomValue } from './state';

// https://github.com/pose/webcrypto-jwt/blob/master/index.js
export const decodeJWT = function (token: string) {
  let output = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw 'Illegal base64url string!';
  }

  const result = atob(output);

  try {
    return decodeURIComponent(escape(result));
  } catch (err) {
    console.log(err);
    return result;
  }
};

export const validateToken = (token: {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
}) => {
  const dateInSecs = (d: Date) => Math.ceil(Number(d) / 1000);
  const date = new Date();

  let iss = token.iss;

  // ISS can include a trailing slash but should otherwise be identical to
  // the config.issuer, so we should remove the trailing slash if it exists
  iss = iss.endsWith('/') ? iss.slice(0, -1) : iss;

  if (iss !== config.issuer) {
    throw new Error(
      `Token iss value (${iss}) doesn't match issuer (${config.issuer})`
    );
  }

  if (token.aud !== config.clientId) {
    throw new Error(
      `Token aud value (${token.aud}) doesn't match clientId (${config.clientId})`
    );
  }

  if (token.exp < dateInSecs(date)) {
    throw new Error(`Token exp value is before current time`);
  }

  // Token should have been issued within the last day
  date.setDate(date.getDate() - 1);
  if (token.iat < dateInSecs(date)) {
    throw new Error(`Token was issued before one day ago and is now invalid`);
  }
};

export const encryptSub = async (sub: string) => {
  const salt = await getRandomValue();
  const text = new TextEncoder().encode(`${CONFIG_SALT}-${sub}-${salt}`);
  const digest = await crypto.subtle.digest({ name: 'SHA-256' }, text);
  const digestArray = new Uint8Array(digest);
  return btoa(
    String.fromCharCode.apply(null, (digestArray as unknown) as number[])
  );
};
