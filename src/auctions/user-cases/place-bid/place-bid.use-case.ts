import { AuctionsError } from '../../../core/auctions.error'
import { UseCase } from '../../../core/base.use-case'
import { left, right } from '../../../core/result'
import { Auction } from '../../domain/auction'
import { AuctionEntity } from '../../entities/auction.entity'

import { AuctionPlaceBidDTO } from './auction-place-bid.dto'
import { AuctionPlaceBidPort } from './auction-place-bid.port'

export class PlaceBidUseCase implements UseCase<AuctionPlaceBidDTO, Auction> {
  constructor(private readonly placeBidPort: AuctionPlaceBidPort) {}

  public async execute(request: AuctionPlaceBidDTO) {
    try {
      const idValidation = AuctionEntity.isIdValid(request.id)
      if (idValidation.isLeft()) {
        return left(idValidation.value)
      }

      const auction = await this.placeBidPort.get(request.id)
      const verifyResult = new AuctionEntity(auction).verifyBid(request)
      if (verifyResult.isLeft()) {
        return left(verifyResult.value)
      }

      const updatedAuction = await this.placeBidPort.placeBid(request)

      return right(updatedAuction)
    } catch (error) {
      return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
    }
  }
}
