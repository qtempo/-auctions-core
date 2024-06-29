import { Auction } from '@auctions/domain/auction'

export type CreateAuctionRequest = Pick<Auction, 'title' | 'seller'>
