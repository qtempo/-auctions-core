import { Query } from '../../core/base.query'
import { Auction } from '../entities/Auction'

export interface GetExpiredAuctionsPort extends Query<void, Auction[]> {}
