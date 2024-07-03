import { Auction } from '@core/entities'
import { Result } from '@core/result'

export interface ProcessAuctionsPort {
  getExpiredAuctions(): Promise<Auction[]>
  closeAuction(auction: Auction): Promise<Result<Error, void>>
}
