import { Result } from './result'

export interface UseCase<TRequest, TResponse> {
  execute(request?: TRequest): Promise<Result<Error, TResponse>> | Result<Error, TResponse>
}
