import { randomUUID } from 'crypto'
import { Auction, AuctionID } from '@core/entities'
import { AuctionPlaceBidRequest } from '..'
import { UserAuctionsRepository } from './user-auctions.repository'

export class MockUserAuctionsRepository extends UserAuctionsRepository {
  private createPatchAuction(patch: Partial<Auction>): Auction {
    const now = new Date()
    const endDate = new Date()
    endDate.setHours(now.getHours() + 1)

    const newOne: Auction = {
      id: randomUUID(),
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
    }

    return Object.assign({}, newOne, patch)
  }

  public async persist(auction: Auction): Promise<void> {
    return auction && Promise.resolve()
  }

  public async queryById(id: AuctionID): Promise<Auction> {
    return Promise.resolve(this.createPatchAuction({ id }))
  }

  public async queryByStatus(status: 'OPEN' | 'CLOSED'): Promise<Auction[]> {
    return Promise.resolve([this.createPatchAuction({ status })])
  }

  public async persistBid({ id, bidder, amount }: AuctionPlaceBidRequest): Promise<Auction> {
    return Promise.resolve(this.createPatchAuction({ id, highestBid: { bidder, amount } }))
  }

  public async persistAuctionPictureUrl(id: AuctionID, pictureUrl: string): Promise<Auction> {
    return Promise.resolve(this.createPatchAuction({ id, pictureUrl }))
  }
}
