import { AuctionID } from '@auctions/domain'

export class AuctionNotFoundError extends Error {
  name = 'AuctionNotFoundError' as const

  constructor(id: AuctionID) {
    super(`auction with id: ${id} doesn't exist`)
  }
}
