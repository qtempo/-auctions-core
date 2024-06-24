import { Auction } from '../entities/Auction'

export interface GetAuctionByStatusPort {
  get(status: Auction['status']): Promise<Auction[]>
}
