import { AuctionBidderEmail, AuctionSellerEmail } from '@core/domain'

export interface AuctionsNotification {
  recipient: AuctionSellerEmail | AuctionBidderEmail
  subject: string
  body: string
}
