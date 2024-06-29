import { Auction, AuctionID } from '@auctions/domain'

export type AuctionPlaceBidRequest = Auction['highestBid'] & {
  id: AuctionID
}
