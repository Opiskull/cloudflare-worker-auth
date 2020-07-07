import { hydrateState } from './state';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { logout, callback } from './routes';
import { authorize } from './authorize';
import { createRedirectUrl } from './callback';
// see the readme for more info on what these config options do!
const config = {
  // opt into automatic authorization state hydration
  hydrateState: true,
  // return responses at the edge
  originless: true
};

export const handleRequest = async (event: FetchEvent) => {
  try {
    let request = event.request;

    const { isAuthorized, authorization } = await authorize(event);
    if (isAuthorized && authorization?.accessToken) {
      request = new Request(request, {
        headers: {
          Authorization: `Bearer ${authorization.accessToken}`
        }
      });
    }

    const url = new URL(event.request.url);
    if (url.pathname === '/callback') {
      return await callback(event);
    }

    if (!isAuthorized) {
      const redirectUrl = await createRedirectUrl();
      return Response.redirect(redirectUrl);
    }

    if (url.pathname === '/logout') {
      return await logout(event);
    }

    const response = await getAssetFromKV(event);

    // hydrate the static site with authorization info from provider
    // and the htmlrewriter engine
    return config.hydrateState
      ? new HTMLRewriter()
          .on('script#edge_state', hydrateState(authorization?.userInfo))
          .transform(response)
      : response;
  } catch (err) {
    return new Response(err.toString());
  }
};
