import { Auction, AuctionID } from '@core/domain'
import { AuctionsNotification } from '@automatic-module'

export interface ProcessAuctionsPort {
  getExpiredAuctions(): Promise<Auction[]>
  closeAuction(id: AuctionID): Promise<void>
  sendNotification(notification: AuctionsNotification): Promise<void>
}
