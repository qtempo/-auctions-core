import { UseCase, useCaseHandler } from '@core/base.use-case'
import { Auction } from '@core/entities'
import { GetAuctionsByStatusPort } from './get-auctions-by-status.port'

export class GetAuctionsByStatusUseCase implements UseCase<Auction['status'], Auction[]> {
  constructor(private readonly getByStatusPort: GetAuctionsByStatusPort) {}

  public async execute(status: Auction['status']) {
    return await useCaseHandler(async () => {
      return await this.getByStatusPort.byStatus(status)
    })
  }
}
