import { AuctionsError } from '../../../core/auctions.error'
import { UseCase } from '../../../core/base.use-case'
import { left, right } from '../../../core/result'
import { Auction } from '../../domain/auction'

import { AuctionPlaceBidRequest } from './auction-place-bid.request'
import { AuctionPlaceBidPort } from './auction-place-bid.port'

export class PlaceBidUseCase implements UseCase<AuctionPlaceBidRequest, Auction> {
  constructor(private readonly placeBidPort: AuctionPlaceBidPort) {}

  public async execute(request: AuctionPlaceBidRequest) {
    try {
      const auctionResult = await this.placeBidPort.get(request.id)
      if (auctionResult.isLeft()) {
        return left(auctionResult.value)
      }

      const placeBidResult = await this.placeBidPort.placeBid(request)
      if (placeBidResult.isLeft()) {
        return left(placeBidResult.value)
      }

      return right(placeBidResult.value)
    } catch (error) {
      return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
    }
  }
}
