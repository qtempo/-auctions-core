import { AuctionBidderEmail, AuctionSellerEmail } from './auction'

export interface AuctionsNotification {
  recipient: AuctionSellerEmail | AuctionBidderEmail
  subject: string
  body: string
}
