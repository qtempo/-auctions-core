import { ok, equal } from 'node:assert'
import { Result } from '@core/result'

export const errorResultAssert = <E extends Error>(result: Result<Error, unknown>, entityName: string, error: E) => {
  ok(result.isLeft(), `${entityName} execution must return an error`)
  equal(result.value.name, error.name, `${entityName} execution returns wrong error type`)
  equal(result.value.message, error.message, `${entityName} execution returns wrong error message`)
}
