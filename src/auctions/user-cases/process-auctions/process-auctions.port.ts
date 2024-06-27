import { Auction, AuctionBidderEmail, AuctionID, AuctionSellerEmail } from '../../domain/auction'

export interface ProcessAuctionsPort {
  getExpiredAuctions(): Promise<Auction[]>
  closeAuction(id: AuctionID): Promise<void>
  sendNotification(recipient: AuctionSellerEmail | AuctionBidderEmail, subject: string, body: string): Promise<void>
}
