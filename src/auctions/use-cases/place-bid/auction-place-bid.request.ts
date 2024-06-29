import { Auction, AuctionID } from '@auctions/domain/auction'

export type AuctionPlaceBidRequest = Auction['highestBid'] & {
  id: AuctionID
}
