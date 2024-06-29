import { AuctionBidderEmail, AuctionSellerEmail } from '../../auctions/domain/auction'

export interface Notification {
  recipient: AuctionSellerEmail | AuctionBidderEmail
  subject: string
  body: string
}
