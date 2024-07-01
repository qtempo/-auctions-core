import { Auction } from '@core/domain'

export type CreateAuctionRequest = Pick<Auction, 'title' | 'seller'>
