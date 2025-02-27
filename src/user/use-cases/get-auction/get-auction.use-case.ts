import { AuctionID, Auction } from '@core/entities'
import { UseCase, useCaseHandler } from '@core/base.use-case'
import { GetAuctionPort } from './get-auction.port'

export class GetAuctionUseCase implements UseCase<AuctionID, Auction> {
  constructor(private readonly getAuctionPort: GetAuctionPort) {}

  public async execute(id: AuctionID) {
    return await useCaseHandler(async () => {
      return await this.getAuctionPort.get(id)
    })
  }
}
