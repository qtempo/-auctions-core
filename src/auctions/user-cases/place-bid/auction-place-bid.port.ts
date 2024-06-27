import { Auction } from '../../domain/auction'
import { GetAuctionPort } from '../get-auction/get-auction.port'
import { AuctionPlaceBidDTO } from './auction-place-bid.dto'

export interface AuctionPlaceBidPort extends GetAuctionPort {
  placeBid(placeBid: AuctionPlaceBidDTO): Promise<Auction>
}
