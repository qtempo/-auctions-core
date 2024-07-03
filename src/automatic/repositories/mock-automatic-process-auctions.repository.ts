import { randomUUID } from 'crypto'
import { Auction, AuctionID } from '@core/entities'
import { AutomaticProcessAuctionsRepository } from './automatic-process-auctions.repository'

export class MockAutomaticProcessAuctionsRepository extends AutomaticProcessAuctionsRepository {
  protected persistClose(id: AuctionID): Promise<void> {
    return id && Promise.resolve()
  }

  public async getExpiredAuctions(): Promise<Auction[]> {
    return Promise.resolve([
      this.createAuction(),
      this.createAuction({
        highestBid: {
          amount: 10,
          bidder: 'bidder',
        },
      }),
    ])
  }

  private createAuction(patch: Partial<Auction> = {}): Auction {
    const now = new Date()
    const endDate = new Date()
    endDate.setHours(now.getHours() + 1)
    const newOne: Auction = {
      id: randomUUID(),
      title: 'title',
      seller: 'seller',
      status: 'CLOSED',
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
}