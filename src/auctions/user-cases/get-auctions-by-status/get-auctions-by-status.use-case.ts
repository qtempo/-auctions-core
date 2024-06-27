import { UseCase } from '../../../core/base.use-case'
import { left, right } from '../../../core/result'
import { AuctionsError } from '../../../core/auctions.error'
import { Auction, auctionStatuses } from '../../domain/auction'
import { GetAuctionsByStatusPort } from './get-auctions-by-status.port'

export class GetAuctionsByStatusUseCase implements UseCase<Auction['status'], Auction[]> {
  constructor(private readonly getByStatusPort: GetAuctionsByStatusPort) {}

  public async execute(status: Auction['status']) {
    try {
      if (!auctionStatuses.includes(status)) {
        return left(new AuctionsError(`"status" not supported, can't perform get`))
      }

      const auctions = await this.getByStatusPort.get(status)

      return right(auctions)
    } catch (error) {
      return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
    }
  }
}
