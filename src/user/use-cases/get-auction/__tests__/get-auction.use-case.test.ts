import { randomUUID } from 'node:crypto'
import { describe, it } from 'node:test'

import { errorResultAssert } from '@core/__test__/error-result.assert'
import { Auction } from '@core/entities'
import { MockUserAuctionsRepository } from '@user-module/repositories'

import { AuctionNotFoundError } from '../auction-not-found.error'
import { GetAuctionUseCase } from '../get-auction.use-case'

describe('get-auction.use-case', async () => {
  it('should return NotFound error', async () => {
    const adapter = new MockUserAuctionsRepository()
    adapter.queryById = () => Promise.resolve({ id: '' } as unknown as Auction)
    const getAuction = new GetAuctionUseCase(adapter)
    const uuid = randomUUID()
    const result = await getAuction.execute(uuid)

    errorResultAssert(result, 'getAuction.execution', new AuctionNotFoundError(uuid))
  })
})
