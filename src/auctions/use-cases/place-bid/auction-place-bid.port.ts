import { Auction } from '@auctions/domain/auction'
import { Result } from '@core/result'

import { GetAuctionPort } from '../get-auction/get-auction.port'
import { AuctionPlaceBidRequest } from './auction-place-bid.request'

export interface AuctionPlaceBidPort extends GetAuctionPort {
  placeBid(placeBid: AuctionPlaceBidRequest): Promise<Result<Error, Auction>> | Result<Error, Auction>
}
