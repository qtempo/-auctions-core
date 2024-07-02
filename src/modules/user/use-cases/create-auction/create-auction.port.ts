import { Result } from '@core/result'
import { Auction } from '@core/entities'
import { CreateAuctionRequest } from './create-auction.request'

export interface CreateAuctionPort {
  create(request: CreateAuctionRequest): Promise<Result<Error, Auction>> | Result<Error, Auction>
}
