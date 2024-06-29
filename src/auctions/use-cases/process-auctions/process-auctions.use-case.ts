import { Auction } from '@auctions/domain'
import { UseCase, useCaseHandler } from '@core/base.use-case'
import { right } from '@core/result'
import { ProcessAuctionsPort } from './process-auctions.port'

/**
 * todo tasks
 * - test
 * - change notification to event
 * - package
 * - sort imports
 */

export class ProcessAuctionsUseCase implements UseCase<void, number> {
  constructor(private readonly port: ProcessAuctionsPort) {}

  public async execute() {
    return await useCaseHandler(async () => {
      const expiredAuctions = await this.port.getExpiredAuctions()
      const closePromises = expiredAuctions.map(a => this.closeAuction(a))
      await Promise.all(closePromises)
      return right(expiredAuctions.length)
    })
  }

  private async closeAuction(auction: Auction) {
    const { id, title, seller, highestBid } = auction
    await this.port.closeAuction(id)

    if (highestBid.amount === 0) {
      return await this.port.sendNotification({
        recipient: seller,
        subject: 'No bids on your auction.',
        body: `Item "${title}" didn't get any bids.`,
      })
    }

    const notifySeller = this.port.sendNotification({
      recipient: seller,
      subject: 'Item has been sold!',
      body: `Woohoo! Item "${title}" has been sold for: $${highestBid.amount}`,
    })
    const notifyBidder = this.port.sendNotification({
      recipient: highestBid.bidder,
      subject: 'You won an auction!',
      body: `You got yourself a "${title}" for $${highestBid.amount}.`,
    })
    await Promise.all([notifyBidder, notifySeller])
  }
}
