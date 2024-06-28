import { UseCase } from '../../../core/base.use-case'
import { left } from '../../../core/result'
import { AuctionsError } from '../../../core/auctions.error'
import { Auction } from '../../domain/auction'
import { GetAuctionsByStatusPort } from './get-auctions-by-status.port'

export class GetAuctionsByStatusUseCase implements UseCase<Auction['status'], Auction[]> {
  constructor(private readonly getByStatusPort: GetAuctionsByStatusPort) {}

  public async execute(status: Auction['status']) {
    try {
      return await this.getByStatusPort.byStatus(status)
    } catch (error) {
      return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
    }
  }
}
