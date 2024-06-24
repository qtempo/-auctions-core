import { Auction, AuctionID } from '../entities/Auction'
import { GetAuctionByIdPort } from './get-auction-by-id.port'

export type PlaceBidType = Auction['highestBid'] & {
  id: AuctionID
}

export interface PlaceBidPort extends GetAuctionByIdPort {
  placeBid(placeBid: PlaceBidType): Promise<Auction>
}
