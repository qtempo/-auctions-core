import { Result } from '@core/result'
import { Auction } from '@auctions/domain/auction'

export interface GetAuctionsByStatusPort {
  byStatus(status: Auction['status']): Promise<Result<Error, Auction[]>> | Result<Error, Auction[]>
}
