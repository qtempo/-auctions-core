import { DomainEvent } from '@core/domain.events'
import { AuctionBidderEmail, AuctionSellerEmail } from './auction'

export class AuctionsNotification implements DomainEvent {
  constructor(
    private readonly recipient: AuctionSellerEmail | AuctionBidderEmail,
    private readonly subject: string,
    private readonly body: string,
  ) { }

  get() {
    return {
      recipient: this.recipient,
      subject: this.subject,
      body: this.body,
    }
  }
}
