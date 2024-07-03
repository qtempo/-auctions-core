import { Result, left, right } from '@core/result'
import { AuctionsError } from '@core/auctions.error'
import { DomainEvents } from '@core/domain.events'
import { Auction, AuctionID, AuctionsNotification } from '@core/entities'
import { ProcessAuctionsPort } from '../use-cases/process-auctions'

export abstract class AutomaticProcessAuctionsRepository implements ProcessAuctionsPort {
  protected abstract persistClose(id: AuctionID): Promise<void>;
  abstract getExpiredAuctions(): Promise<Auction[]>;

  public async closeAuction(auction: Auction): Promise<Result<AuctionsError, void>> {
    const { id, title, seller, highestBid } = auction
    await this.persistClose(id)

    if (!highestBid.amount)
      return await this.doEvent(
        seller,
        'No bids on your auction.',
        `Item "${title}" didn't get any bids.`,
      )

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
    const resolved = await Promise.all([notifyBidder, notifySeller])
    const error = resolved.find(r => r.isLeft())
    if (error?.value)
      return left(error.value)

    return right(void 0)
  }

  private async doEvent(recipient: string, subject: string, body: string): Promise<Result<AuctionsError, void>> {
    const event = new AuctionsNotification(recipient, subject, body)
    return await DomainEvents.dispatch(AuctionsNotification.name, event.get())
  }
}