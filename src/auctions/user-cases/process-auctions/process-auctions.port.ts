import { Notification } from '../../../notifications/domain/notification'
import { Auction, AuctionID } from '../../domain/auction'

export interface ProcessAuctionsPort {
  getExpiredAuctions(): Promise<Auction[]>
  closeAuction(id: AuctionID): Promise<void>
  sendNotification(notification: Notification): Promise<void>
}
