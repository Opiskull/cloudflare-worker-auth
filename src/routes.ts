import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { clearAuthCookie, hasAuthCookie } from './cookie';
import { handleRedirect } from './callback';

export const logout = async (event: FetchEvent): Promise<Response> => {
  const response = await getAssetFromKV(event);

  if (hasAuthCookie(event.request)) {
    return new Response(response.body, {
      ...response,
      headers: {
        ...response.headers,
        ...clearAuthCookie()
      }
    });
  } else {
    const url = new URL(event.request.url);
    return Response.redirect(url.origin);
  }
};

export const callback = async (event: FetchEvent): Promise<Response> => {
  const authorizedResponse = await handleRedirect(event.request);
  if (!authorizedResponse) {
    return new Response('Unauthorized', { status: 401 });
  }
  return new Response(authorizedResponse.body, {
    ...authorizedResponse
  });
};
