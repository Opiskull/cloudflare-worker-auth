import { Context } from './context';
import { filesHandler } from './files-handler/index';
import { listHandler } from './list-handler/index';
import { oidcHandler } from './oidc-handler/index';
import { compose } from './compose';

export const handleRequest = async (event: FetchEvent): Promise<Response> => {
  try {
    const list = [oidcHandler, listHandler, filesHandler];

    const composer = compose(list);

    const context = new Context(event);

    await composer(context, () => Promise.resolve());

    return context.response
      ? context.response
      : new Response('404 not found', { status: 404 });

    // return compose(any);
    // return oidcHandler(event, (e) => listHandler(e, (e) => filesHandler(e)));
  } catch (err) {
    return new Response(JSON.stringify(err));
  }
};
