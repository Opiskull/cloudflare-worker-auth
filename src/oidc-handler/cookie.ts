import { parse, serialize } from 'cookie';
import { config } from '../config';

export const hasAuthCookie = (request: Request) => {
  const cookieHeader = request.headers.get('Cookie');
  return cookieHeader && cookieHeader.includes(config.cookieName);
};

export const getAuthCookie = (request: Request) => {
  const cookieHeader = request.headers.get('Cookie');

  if (cookieHeader && cookieHeader.includes(config.cookieName)) {
    const cookies = parse(cookieHeader);
    return cookies[config.cookieName];
  }
  return '';
};

export const setAuthCookie = (id: string) => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return {
    'Set-cookie': serialize(config.cookieName, id, {
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      expires: date,
      domain: config.domain
    })
  };
};

export const clearAuthCookie = () => {
  return {
    'Set-cookie': serialize(config.cookieName, '', {
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      domain: config.domain
    })
  };
};
