import { Auction } from '../../domain/auction'

export interface CreateAuctionPort {
  save(auction: Auction): Promise<Auction>
}
