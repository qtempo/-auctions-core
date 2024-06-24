import { ok } from 'assert'
import { UseCase } from '../../core/base.use-case'
import { Auction, auctionStatuses } from '../entities/Auction'
import { AuctionsAppError } from '../../core/auctions-app.error'
import { GetAuctionByStatusPort } from '../ports/get-auction-by-status.port'

export class GetAuctionByStatusUseCase implements UseCase<Auction['status'], Promise<Auction[]>> {
  constructor(private readonly getByStatusPort: GetAuctionByStatusPort) {}

  public async execute(status: Auction['status']) {
    ok(auctionStatuses.includes(status), new AuctionsAppError(`"status" not supported, can't perform get`))
    return await this.getByStatusPort.get(status)
  }
}
