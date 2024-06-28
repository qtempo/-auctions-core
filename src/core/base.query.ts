import { Result } from './result'

export interface Query<E extends Error, TRequest, TResponse> {
  get(request?: TRequest): Promise<Result<E, TResponse>> | Result<E, TResponse>
}
