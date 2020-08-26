import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { Context } from '../context';

export const filesHandler = () => async (ctx: Context, next: () => Promise<void>) => {
  ctx.response = await getAssetFromKV(ctx.event);
  await next();
};
