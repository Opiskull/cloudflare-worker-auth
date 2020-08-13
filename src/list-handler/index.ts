import { HostnameTransformer } from '../transformers/hostname-transformer';
import { Context } from '../context';

const streamResponse = async (request: Request): Promise<Response> => {
  let response = await fetch(request);
  let { readable, writable } = new TransformStream();
  if (response.body) {
    response.body.pipeTo(writable);
  }
  return new Response(readable, response);
};

export const listHandler = async (ctx: Context, next: () => Promise<void>) => {
  const event = ctx.event;
  const request = await new HostnameTransformer(
    'list.onuk.dev',
    'items-list.vercel.app'
  ).transform({
    ...event.request,
    ...{
      headers: {
        ...event.request.headers,
        ...{ Authorization: ctx.items['authorization'].accessToken }
      }
    }
  });

  if (!request.url.toLocaleLowerCase().includes(CONFIG_DOMAIN)) {
    ctx.response = await streamResponse(request);
    return;
  }
  await next();
};
