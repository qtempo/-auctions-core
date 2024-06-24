import { Query } from '../../core/base.query'
import { Auction, AuctionID } from '../entities/Auction'

export interface GetAuctionByIdPort extends Query<AuctionID, Auction> {}
