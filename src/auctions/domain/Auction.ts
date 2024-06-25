import { UUID } from 'node:crypto'

export const auctionStatuses = ['OPEN', 'CLOSED'] as const

export type AuctionID = UUID
export type AuctionSellerEmail = string
export type AuctionBidderEmail = string

export interface Auction {
  id: AuctionID
  title: string
  status: (typeof auctionStatuses)[number]
  createdAt: string
  endingAt: string
  highestBid: {
    amount: number
    bidder: AuctionBidderEmail
  }
  seller: AuctionSellerEmail
  pictureUrl: string
}
