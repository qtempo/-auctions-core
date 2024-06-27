import { UseCase } from '../../../core/base.use-case'
import { left, right } from '../../../core/result'
import { AuctionsError } from '../../../core/auctions.error'
import { Auction } from '../../domain/auction'
import { ProcessAuctionsPort } from './process-auctions.port'

/**
 * todo
 * - test
 * - change notification to event
 * - package
 */

export class ProcessAuctionsUseCase implements UseCase<void, number> {
  constructor(private readonly port: ProcessAuctionsPort) {}

  public async execute() {
    try {
      const expiredAuctions = await this.port.getExpiredAuctions()
      const closePromises = expiredAuctions.map((a) => this.closeAuction(a))
      await Promise.all(closePromises)

      return right(expiredAuctions.length)
    } catch (error) {
      return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
    }
  }

  private async closeAuction(auction: Auction) {
    const { id, title, seller, highestBid } = auction
    await this.port.closeAuction(id)

    if (highestBid.amount === 0) {
      return await this.port.sendNotification(
        seller,
        'No bids on your auction.',
        `Item "${title}" didn't get any bids.`,
      )
    }

    const notifySeller = this.port.sendNotification(
      seller,
      'Item has been sold!',
      `Woohoo! Item "${title}" has been sold for: $${highestBid.amount}`,
    )
    const notifyBidder = this.port.sendNotification(
      highestBid.bidder,
      'You won an auction!',
      `You got yourself a "${title}" for $${highestBid.amount}.`,
    )
    await Promise.all([notifyBidder, notifySeller])
  }
}
