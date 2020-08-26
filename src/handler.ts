import { Context } from './context';
import { filesHandler } from './files-handler/index';
import { streamHandler } from './stream-handler/index';
import { oidcHandler } from './oidc-handler/index';
import { compose } from './compose';

export const handleRequest = async (event: FetchEvent): Promise<Response> => {
  try {
    const middlewares = [oidcHandler(), streamHandler('list.onuk.dev','items-list.vercel.app'), filesHandler()];

    const composer = compose(middlewares);

    const context = new Context(event);

    await composer(context, () => Promise.resolve());

    return context.response
      ? context.response
      : new Response('404 not found', { status: 404 });
  } catch (err) {
    return new Response(JSON.stringify(err));
  }
};
