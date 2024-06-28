import { UseCase } from '../../../core/base.use-case'
import { left, right } from '../../../core/result'
import { AuctionsError } from '../../../core/auctions.error'
import { Auction } from '../../domain/auction'

import { CreateAuctionRequest } from './create-auction.request'
import { CreateAuctionPort } from './create-auction.port'

export class CreateAuctionUseCase implements UseCase<CreateAuctionRequest, Auction> {
  constructor(private readonly createAuctionPort: CreateAuctionPort) {}

  public async execute(request: CreateAuctionRequest) {
    try {
      const createResult = await this.createAuctionPort.create(request)
      if (createResult.isLeft()) {
        return left(createResult.value)
      }
      return right(createResult.value)
    } catch (error) {
      return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
    }
  }
}
