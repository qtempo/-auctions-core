import { Auction, AuctionID } from '@core/domain'

export type AuctionPlaceBidRequest = Auction['highestBid'] & {
  id: AuctionID
}
