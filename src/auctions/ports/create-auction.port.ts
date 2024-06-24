import { Auction } from '../entities/Auction';

export interface CreateAuctionPort {
  save(auction: Auction): Promise<void>;
}
