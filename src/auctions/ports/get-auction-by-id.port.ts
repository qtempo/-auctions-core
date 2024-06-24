import { Auction } from '../entities/Auction'

export interface GetAuctionByIdPort {
  get(status: Auction['id']): Promise<Auction>
}
