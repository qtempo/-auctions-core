import { Auction } from '../domain/Auction';

export interface CreateAuctionPort {
  save(auction: Auction): Promise<void>;
}
