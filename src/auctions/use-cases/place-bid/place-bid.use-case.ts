import { left, right } from '@core/result'
import { Auction } from '@auctions/domain'
import { UseCase, useCaseHandler } from '@core/base.use-case'

import { AuctionPlaceBidPort } from './auction-place-bid.port'
import { AuctionPlaceBidRequest } from './auction-place-bid.request'

export class PlaceBidUseCase implements UseCase<AuctionPlaceBidRequest, Auction> {
  constructor(private readonly placeBidPort: AuctionPlaceBidPort) {}

  public async execute(request: AuctionPlaceBidRequest) {
    return await useCaseHandler(async () => {
      const auctionResult = await this.placeBidPort.get(request.id)
      if (auctionResult.isLeft()) {
        return left(auctionResult.value)
      }

      const placeBidResult = await this.placeBidPort.placeBid(request)
      if (placeBidResult.isLeft()) {
        return left(placeBidResult.value)
      }

      return right(placeBidResult.value)
    })
  }
}
