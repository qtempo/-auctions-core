import { Auction } from '@core/entities'

export type CreateAuctionRequest = Pick<Auction, 'title' | 'seller'>
