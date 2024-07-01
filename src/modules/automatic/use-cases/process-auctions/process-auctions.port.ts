import { Auction, AuctionID } from '@core/entities'

export interface ProcessAuctionsPort {
  getExpiredAuctions(): Promise<Auction[]>
  closeAuction(id: AuctionID): Promise<void>
}
