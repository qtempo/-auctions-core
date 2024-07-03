import { Query } from '@core/base.query'
import { AuctionID, Auction } from '@core/entities'

export interface GetAuctionPort extends Query<Error, AuctionID, Auction> {}
