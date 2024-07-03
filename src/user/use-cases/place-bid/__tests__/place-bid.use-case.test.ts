import { describe, mock, it } from 'node:test'
import { randomUUID } from 'node:crypto'

import { errorResultAssert } from '@core/__test__/error-result.assert'
import { MockUserAuctionsRepository } from '@user-module/repositories'

import { AuctionPlaceBidError } from '../auction-place-bid.error'
import { PlaceBidUseCase } from '../place-bid.use-case'

describe('place-bid.use-case', () => {
  it('should fail on same bid', async () => {
    const email = 'tmp@tmp'
    const adapter = new MockUserAuctionsRepository()
    adapter.persistBid = mock.fn()
    adapter.queryById = () =>
      Promise.resolve({
        id: randomUUID(),
        seller: email,
        title: 'title',
        createdAt: '',
        endingAt: '',
        pictureUrl: '',
        status: 'OPEN',
        highestBid: {
          amount: 10,
          bidder: '',
        },
      })

    const placeBid = new PlaceBidUseCase(adapter)
    const placeBidResult = await placeBid.execute({
      id: randomUUID(),
      amount: 10,
      bidder: email + 'bedder',
    })

    errorResultAssert(placeBidResult, 'placeBid.execution', new AuctionPlaceBidError('Bid must be higher than: 10'))
  })

  it('should fail on same bidder', async () => {
    const email = 'tmp@tmp'
    const adapter = new MockUserAuctionsRepository()
    adapter.persistBid = mock.fn()
    adapter.queryById = () =>
      Promise.resolve({
        seller: email,
        id: randomUUID(),
        title: 'title',
        createdAt: '',
        endingAt: '',
        pictureUrl: '',
        status: 'OPEN',
        highestBid: {
          amount: 10,
          bidder: 'bidder',
        },
      })

    const placeBid = new PlaceBidUseCase(adapter)
    const placeBidResult = await placeBid.execute({
      id: randomUUID(),
      amount: 15,
      bidder: email,
    })

    errorResultAssert(
      placeBidResult,
      'placeBid.execution',
      new AuctionPlaceBidError('Can\'t bid on your own auctions!'),
    )
  })
})
