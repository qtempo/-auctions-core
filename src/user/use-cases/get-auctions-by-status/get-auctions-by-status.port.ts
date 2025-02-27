import { Result } from '@core/result'
import { Auction } from '@core/entities'

export interface GetAuctionsByStatusPort {
  byStatus(status: Auction['status']): Promise<Result<Error, Auction[]>> | Result<Error, Auction[]>
}
