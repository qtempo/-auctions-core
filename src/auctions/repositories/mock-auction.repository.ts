import { randomUUID } from 'crypto'
import { Auction, AuctionID } from '../domain/auction'
import { AuctionPlaceBidRequest } from '../user-cases/place-bid/auction-place-bid.request'
import { AuctionRepository } from './auction.repository'

export class MockAuctionRepository extends AuctionRepository {
  public persist(auction: Auction): Promise<void> {
    auction
    return Promise.resolve()
  }

  public async queryById(id: AuctionID): Promise<Auction> {
    const now = new Date()
    const endDate = new Date()
    endDate.setHours(now.getHours() + 1)

    return Promise.resolve({
      id,
      title: 'title',
      seller: 'seller',
      status: 'OPEN',
      pictureUrl: '',
      createdAt: now.toISOString(),
      endingAt: endDate.toISOString(),
      highestBid: {
        amount: 0,
        bidder: '',
      },
    })
  }

  public queryByStatus(status: 'OPEN' | 'CLOSED'): Promise<Auction[]> {
    const now = new Date()
    const endDate = new Date()
    endDate.setHours(now.getHours() + 1)

    return Promise.resolve([
      {
        id: randomUUID(),
        title: 'title',
        seller: 'seller',
        status,
        pictureUrl: '',
        createdAt: now.toISOString(),
        endingAt: endDate.toISOString(),
        highestBid: {
          amount: 0,
          bidder: '',
        },
      },
    ])
  }

  public persistBid(request: AuctionPlaceBidRequest): Promise<Auction> {
    const now = new Date()
    const endDate = new Date()
    endDate.setHours(now.getHours() + 1)

    return Promise.resolve({
      id: request.id,
      title: 'title',
      seller: 'seller',
      status: 'OPEN',
      pictureUrl: '',
      createdAt: now.toISOString(),
      endingAt: endDate.toISOString(),
      highestBid: {
        amount: request.amount,
        bidder: request.bidder,
      },
    })
  }
}
