import { Auction, AuctionID } from '@auctions/domain/auction'
import { Notification } from '@notifications/domain/notification'

export interface ProcessAuctionsPort {
  getExpiredAuctions(): Promise<Auction[]>
  closeAuction(id: AuctionID): Promise<void>
  sendNotification(notification: Notification): Promise<void>
}
