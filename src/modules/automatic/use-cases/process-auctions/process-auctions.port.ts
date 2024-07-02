import { Auction } from '@core/entities'

export interface ProcessAuctionsPort {
  getExpiredAuctions(): Promise<Auction[]>
  closeAuction(auction: Auction): Promise<void>
}
