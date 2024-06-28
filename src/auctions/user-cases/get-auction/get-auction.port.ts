import { Query } from '../../../core/base.query'
import { Auction, AuctionID } from '../../domain/auction'

export interface GetAuctionPort extends Query<Error, AuctionID, Auction> {}
