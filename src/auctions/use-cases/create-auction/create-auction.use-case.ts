import { left, right } from '@core/result'
import { Auction } from '@auctions/domain'
import { UseCase, useCaseHandler } from '@core/base.use-case'
import { CreateAuctionPort } from './create-auction.port'
import { CreateAuctionRequest } from './create-auction.request'

export class CreateAuctionUseCase implements UseCase<CreateAuctionRequest, Auction> {
  constructor(private readonly createAuctionPort: CreateAuctionPort) {}

  public async execute(request: CreateAuctionRequest) {
    return await useCaseHandler(async () => {
      const createResult = await this.createAuctionPort.create(request)
      if (createResult.isLeft()) {
        return left(createResult.value)
      }
      return right(createResult.value)
    })
  }
}
