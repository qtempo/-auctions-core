import { randomUUID } from 'node:crypto'
import { describe, it } from 'node:test'
import { ok } from 'node:assert'

import { GetAuctionUseCase } from '../get-auction.use-case'
import { AuctionNotFoundError } from '../auction-not-found.error'
import { MockAuctionRepository } from '../../../repositories/mock-auction.repository'
import { Auction } from '../../../domain/auction'

describe('get-auction.use-case', async () => {
  it('should return NotFound error', async () => {
    const adapter = new MockAuctionRepository()
    adapter.queryById = () => Promise.resolve({ id: '' } as unknown as Auction)
    const getAuction = new GetAuctionUseCase(adapter)
    const uuid = randomUUID()
    const result = await getAuction.execute(uuid)

    ok(result.isLeft(), `getAuction execution must return an "${AuctionNotFoundError.name}"`)
    ok(result.value.name === AuctionNotFoundError.name, 'getAuction execution returns wrong error type')
    ok(result.value.message === `auction with id: ${uuid} doesn't exist`, 'wrong error message')
  })
})
