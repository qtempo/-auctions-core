import { describe, mock, it } from 'node:test'
import { ok } from 'node:assert'
import { randomUUID } from 'node:crypto'

import { AuctionNotFoundError } from '../../get-auction/auction-not-found.error'
import { PlaceBidUseCase } from '../place-bid.use-case'
import { AuctionPlaceBidError } from '../auction-place-bid.error'

describe('place-bid.use-case', () => {
  it('should fail on same bid', async () => {
    const email = 'tmp@tmp'
    const placeBid = new PlaceBidUseCase({
      get: () =>
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
            bidder: '',
          },
        }),
      placeBid: mock.fn(),
    })

    const placeBidResult = await placeBid.execute({
      id: randomUUID(),
      amount: 10,
      bidder: email + 'bedder',
    })

    ok(placeBidResult.isLeft(), `placeBid execution must return an "${AuctionNotFoundError.name}"`)
    ok(placeBidResult.value.name === AuctionPlaceBidError.name, `placeBid execution returns wrong error type`)
    ok(placeBidResult.value.message === `Bid must be higher than: 10`, `wrong error message`)
  })

  it('should fail on same bidder', async () => {
    const email = 'tmp@tmp'
    const placeBid = new PlaceBidUseCase({
      get: () =>
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
        }),
      placeBid: mock.fn(),
    })

    const placeBidResult = await placeBid.execute({
      id: randomUUID(),
      amount: 15,
      bidder: email,
    })

    ok(placeBidResult.isLeft(), `placeBid execution must return an "${AuctionPlaceBidError.name}"`)
    ok(placeBidResult.value.name === AuctionPlaceBidError.name, `placeBid execution returns wrong error type`)
    ok(placeBidResult.value.message === `Can't bid on your own auctions!`, `wrong error message`)
  })
})
