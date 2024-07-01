import { Auction, AuctionID } from '@core/entities'

export type AuctionPlaceBidRequest = Auction['highestBid'] & {
  id: AuctionID
}
