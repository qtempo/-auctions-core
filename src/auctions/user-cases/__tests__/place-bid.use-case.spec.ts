import { randomUUID } from 'node:crypto'
import { describe, mock, it } from 'node:test'
import { rejects } from 'node:assert'

import { PlaceBidUseCase } from '../place-bid.use-case'
import { PlaceBidError } from '../../errors/place-bid.error'

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

    await rejects(
      placeBid.execute({
        id: randomUUID(),
        amount: 10,
        bidder: email,
      }),
      {
        name: PlaceBidError.name,
        message: 'Bid must be higher than: 10',
      },
    )
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
            bidder: '',
          },
        }),
      placeBid: mock.fn(),
    })

    await rejects(
      placeBid.execute({
        id: randomUUID(),
        amount: 15,
        bidder: email,
      }),
      {
        name: PlaceBidError.name,
        message: `Can't bid on your own auctions!`,
      },
    )
  })
})
