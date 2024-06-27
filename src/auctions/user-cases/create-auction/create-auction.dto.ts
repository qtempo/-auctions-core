import { Auction } from '../../domain/auction'

export type CreateAuctionDTO = Pick<Auction, 'title' | 'seller'>
