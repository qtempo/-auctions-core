import { describe, mock, it } from 'node:test'
import { ok } from 'node:assert'
import { randomUUID } from 'node:crypto'

import { Auction } from '../../../domain/auction'
import { GetAuctionUseCase } from '../get-auction.use-case'
import { AuctionNotFoundError } from '../auction-not-found.error'

describe('get-auction.use-case', async () => {
  it('should return NotFound error', async () => {
    const getAuction = new GetAuctionUseCase({
      get: mock.fn(() => {
        return { id: '' } as unknown as Auction
      }),
    })
    const uuid = randomUUID()
    const result = await getAuction.execute(uuid)

    ok(result.isLeft(), `getAuction execution must return an "${AuctionNotFoundError.name}"`)
    ok(result.value.name === AuctionNotFoundError.name, `getAuction execution returns wrong error type`)
    ok(result.value.message === `auction with id: ${uuid} doesn't exist`, `wrong error message`)
  })
})
