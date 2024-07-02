import { DomainEvents } from '@core/domain.events'
import { Auction, AuctionID, AuctionsNotification } from '@core/entities'
import { ProcessAuctionsPort } from '@automatic-module/use-cases/process-auctions'

export abstract class AutomaticProcessAuctionsRepository implements ProcessAuctionsPort {
  protected abstract close(id: AuctionID): Promise<void>;
  abstract getExpiredAuctions(): Promise<Auction[]>;

  public async closeAuction(auction: Auction) {
    const { id, title, seller, highestBid } = auction
    await this.close(id)

    if (highestBid.amount === 0) {
      return await this.doEvent(
        seller,
        'No bids on your auction.',
        `Item "${title}" didn't get any bids.`,
      )
    }

    const notifySeller = this.doEvent(
      seller,
      'Item has been sold!',
      `Woohoo! Item "${title}" has been sold for: $${highestBid.amount}`,
    )
    const notifyBidder = this.doEvent(
      highestBid.bidder,
      'You won an auction!',
      `You got yourself a "${title}" for $${highestBid.amount}.`,
    )
    await Promise.all([notifyBidder, notifySeller])
  }

  private async doEvent(recipient: string, subject: string, body: string): Promise<void> {
    const event = new AuctionsNotification(recipient, subject, body)
    return await DomainEvents.dispatch(AuctionsNotification.name, event.get())
  }
}