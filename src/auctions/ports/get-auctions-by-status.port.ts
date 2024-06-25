import { Query } from '../../core/base.query'
import { Auction } from '../domain/Auction'

export interface GetAuctionsByStatusPort extends Query<Auction['status'], Auction[]> {}
