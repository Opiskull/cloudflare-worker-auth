export interface RequestTransformer {
  transform(request: Request): Promise<Request>;
}
