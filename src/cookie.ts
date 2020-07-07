import { parse, serialize } from 'cookie';

const cookieKey = 'AUTH';

export const hasAuthCookie = (request: Request) => {
  const cookieHeader = request.headers.get('Cookie');
  return cookieHeader && cookieHeader.includes(cookieKey);
};

export const getAuthCookie = (request: Request) => {
  const cookieHeader = request.headers.get('Cookie');

  if (cookieHeader && cookieHeader.includes(cookieKey)) {
    const cookies = parse(cookieHeader);
    return cookies[cookieKey];
  }
  return '';
};

export const setAuthCookie = (id: string) => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return {
    'Set-cookie': serialize(cookieKey, id, {
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      expires: date
    })
  };
};

export const clearAuthCookie = () => {
  return {
    'Set-cookie': serialize(cookieKey, '', {
      secure: true,
      httpOnly: true,
      sameSite: 'lax'
    })
  };
};
