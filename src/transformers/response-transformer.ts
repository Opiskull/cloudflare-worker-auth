export interface ResponseTransformer {
  transform(response: Response): Promise<Response>;
}
