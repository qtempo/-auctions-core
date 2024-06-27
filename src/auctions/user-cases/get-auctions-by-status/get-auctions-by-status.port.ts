import { Query } from '../../../core/base.query'
import { Auction } from '../../domain/auction'

export interface GetAuctionsByStatusPort extends Query<Auction['status'], Auction[]> {}
