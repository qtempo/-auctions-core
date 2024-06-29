import { Either, left, right } from '@sweet-monads/either'

type Result<E extends Error, T> = Either<E, T>

export { left, right }
export type { Result }
