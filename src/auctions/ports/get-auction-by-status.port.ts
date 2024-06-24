import { Query } from '../../core/base.query'
import { Auction } from '../entities/Auction'

export interface GetAuctionByStatusPort extends Query<Auction['status'], Auction[]> {}
