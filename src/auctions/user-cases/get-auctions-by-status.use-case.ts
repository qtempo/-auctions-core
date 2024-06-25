import { ok } from 'assert'
import { UseCase } from '../../core/base.use-case'
import { Auction, auctionStatuses } from '../domain/Auction'
import { AuctionsAppError } from '../../core/auctions-app.error'
import { GetAuctionsByStatusPort } from '../ports/get-auctions-by-status.port'

export class GetAuctionsByStatusUseCase implements UseCase<Auction['status'], Auction[]> {
  constructor(private readonly getByStatusPort: GetAuctionsByStatusPort) {}

  public async execute(status: Auction['status']) {
    ok(auctionStatuses.includes(status), new AuctionsAppError(`"status" not supported, can't perform get`))
    return await this.getByStatusPort.get(status)
  }
}
