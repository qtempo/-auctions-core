import { UseCase } from '../../../core/base.use-case'
import { left, right } from '../../../core/result'
import { AuctionsError } from '../../../core/auctions.error'
import { Auction, AuctionID } from '../../domain/auction'
import { AuctionEntity } from '../../entities/auction.entity'

import { GetAuctionPort } from './get-auction.port'
import { AuctionNotFoundError } from './auction-not-found.error'

export class GetAuctionUseCase implements UseCase<AuctionID, Auction> {
  constructor(private readonly port: GetAuctionPort) {}

  public async execute(id: AuctionID) {
    try {
      const validation = AuctionEntity.isIdValid(id)
      if (validation.isLeft()) {
        return left(validation.value)
      }

      const auction = await this.port.get(id)
      if (AuctionEntity.isIdValid(auction?.id).isLeft()) {
        return left(new AuctionNotFoundError(id))
      }

      return right(auction)
    } catch (error) {
      return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
    }
  }
}
