import { Auction, AuctionID } from '../../domain/auction'

export type AuctionPlaceBidDTO = Auction['highestBid'] & {
  id: AuctionID
}
