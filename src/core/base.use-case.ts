import { AuctionsError } from './auctions.error'
import { Result, left, right } from './result'

export interface UseCase<TRequest, TResponse> {
  execute(request?: TRequest): Promise<Result<Error, TResponse>> | Result<Error, TResponse>
}

/**
 * Handle async call to catch non-application error
 * @returns AuctionsError
 */
export const useCaseHandler = async<T>(fn: () => Promise<Result<Error, T>>): Promise<Result<Error, T>> => {
  try {
    const result = await fn()
    return result.isLeft() ? left(result.value) : right(result.value)
  } catch (error) {
    return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
  }
}
