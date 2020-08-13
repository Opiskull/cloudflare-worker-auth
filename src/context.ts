export class Context {
  public event: FetchEvent;
  public request: Request;
  public response: Response | undefined = undefined;
  public items: { [key: string]: any };

  constructor(event: FetchEvent) {
    this.event = event;
    this.request = event.request;
    this.items = {};
  }
}
