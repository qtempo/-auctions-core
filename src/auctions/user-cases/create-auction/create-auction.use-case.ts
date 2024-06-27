import { UseCase } from '../../../core/base.use-case'
import { left, right } from '../../../core/result'
import { AuctionsError } from '../../../core/auctions.error'
import { Auction } from '../../domain/auction'
import { AuctionEntity } from '../../entities/auction.entity'

import { CreateAuctionDTO } from './create-auction.dto'
import { CreateAuctionPort } from './create-auction.port'

export class CreateAuctionUseCase implements UseCase<CreateAuctionDTO, Auction> {
  constructor(private readonly createAuctionPort: CreateAuctionPort) {}

  public async execute(request: CreateAuctionDTO) {
    try {
      const creationResult = AuctionEntity.create(request)
      if (creationResult.isLeft()) {
        return left(creationResult.value)
      }

      await this.createAuctionPort.save(creationResult.value)

      return right(creationResult.value)
    } catch (error) {
      return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
    }
  }
}
