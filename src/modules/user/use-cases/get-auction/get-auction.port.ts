import { Query } from '@core/base.query'
import { AuctionID, Auction } from '@core/domain'

export interface GetAuctionPort extends Query<Error, AuctionID, Auction> {}
