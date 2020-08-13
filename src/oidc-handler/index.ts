import { authorize } from './authorize';
import { callback, logout } from './routes';
import { createRedirectUrl } from './callback';
import { Context } from '../context';

export const oidcHandler = async (ctx: Context, next: () => Promise<void>) => {
  let request = ctx.event.request;
  const event = ctx.event;

  const { isAuthorized, authorization } = await authorize(event);
  if (isAuthorized && authorization?.accessToken) {
    ctx.items['authorization'] = authorization;
    request = new Request(request, {
      headers: {
        Authorization: `Bearer ${authorization.accessToken}`
      }
    });
  }

  const url = new URL(event.request.url);

  if (url.pathname === '/callback') {
    ctx.response = await callback(event);
    return;
  }

  if (!isAuthorized) {
    const redirectUrl = await createRedirectUrl(url);
    ctx.response = Response.redirect(redirectUrl);
    return;
  }

  if (url.pathname === '/userinfo') {
    ctx.response = new Response(JSON.stringify(authorization?.userInfo));
    return;
  }

  if (url.pathname === '/logout') {
    ctx.response = await logout(event);
    return;
  }

  await next();
};
