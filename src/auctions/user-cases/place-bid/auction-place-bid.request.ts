import { Auction, AuctionID } from '../../domain/auction'

export type AuctionPlaceBidRequest = Auction['highestBid'] & {
  id: AuctionID
}
