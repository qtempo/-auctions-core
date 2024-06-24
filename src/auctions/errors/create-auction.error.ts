export class CreateAuctionError extends Error {
  name: 'CreateAuctionError' = 'CreateAuctionError'

  constructor(reason: 'title' | 'seller') {
    super(`auction's "${reason}" not provided`)
  }
}
