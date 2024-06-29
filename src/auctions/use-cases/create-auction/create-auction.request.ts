import { Auction } from '@auctions/domain'

export type CreateAuctionRequest = Pick<Auction, 'title' | 'seller'>
