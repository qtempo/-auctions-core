import { ok } from 'assert'
import { AuctionsAppError } from '../../core/auctions-app.error'
import { UseCase } from '../../core/base.use-case'
import { Auction } from '../entities/Auction'
import { GetAuctionByIdPort } from '../ports/get-auction-by-id.port'

export class GetAuctionByIdUseCase implements UseCase<Auction['id'], Promise<Auction>> {
  constructor(private readonly getByIdPort: GetAuctionByIdPort) {}

  public async execute(id: Auction['id']) {
    ok(id, new AuctionsAppError(`"id" must be provided`))
    return await this.getByIdPort.get(id)
  }
}
