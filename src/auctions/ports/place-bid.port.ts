import { Auction } from '../domain/Auction'
import { PlaceBidRequest } from '../user-cases/place-bid.use-case'
import { GetAuctionPort } from './get-auction.port'

export interface PlaceBidPort extends GetAuctionPort {
  placeBid(placeBid: PlaceBidRequest): Promise<Auction>
}
