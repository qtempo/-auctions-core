import { Query } from '../../core/base.query'
import { Auction, AuctionID } from '../domain/Auction'

export interface GetAuctionPort extends Query<AuctionID, Auction> {}
