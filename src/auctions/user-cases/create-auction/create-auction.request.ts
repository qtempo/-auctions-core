import { Auction } from '../../domain/auction'

export type CreateAuctionRequest = Pick<Auction, 'title' | 'seller'>
