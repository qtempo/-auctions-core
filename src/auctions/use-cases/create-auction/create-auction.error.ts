export class CreateAuctionError extends Error {
  name = 'CreateAuctionError' as const

  constructor(message: string) {
    super(message)
  }

  public static titleValidationFail() {
    return new CreateAuctionError('auction\'s "title" not provided')
  }

  public static sellerValidationFail() {
    return new CreateAuctionError('auction\'s "seller" not provided')
  }
}
