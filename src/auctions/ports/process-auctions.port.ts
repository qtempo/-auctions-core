import { Auction, AuctionBidderEmail, AuctionID, AuctionSellerEmail } from '../domain/Auction'

export interface ProcessAuctionsPort {
  getExpiredAuctions(): Promise<Auction[]>
  closeAuction(id: AuctionID): Promise<void>
  sendNotification(recipient: AuctionSellerEmail | AuctionBidderEmail, subject: string, body: string): Promise<void>
}
