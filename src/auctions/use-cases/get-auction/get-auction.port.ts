import { Query } from '@core/base.query'
import { AuctionID, Auction } from '@auctions/domain/auction'

export interface GetAuctionPort extends Query<Error, AuctionID, Auction> {}
