export interface Query<TRequest, TResponse> {
  get(request?: TRequest): Promise<TResponse> | TResponse;
}
