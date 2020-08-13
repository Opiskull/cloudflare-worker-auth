import { RequestTransformer } from './request-transformer';

export class HostnameTransformer implements RequestTransformer {
  public forwardFromHostname: string;
  public forwardToHostname: string;

  constructor(fromHostname: string, toHostname: string) {
    this.forwardFromHostname = fromHostname;
    this.forwardToHostname = toHostname;
  }

  public async transform(request: Request): Promise<Request> {
    const url = new URL(request.url);
    if (
      url.hostname.toLocaleLowerCase() ===
      this.forwardFromHostname.toLocaleLowerCase()
    ) {
      url.hostname = this.forwardToHostname;
      return new Request(new Request(url.toString()), request);
    }
    return request;
  }
}
