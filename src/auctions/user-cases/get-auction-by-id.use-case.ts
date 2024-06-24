import { ok } from 'assert'
import { UseCase } from '../../core/base.use-case'
import { GetAuctionByIdPort } from '../ports/get-auction-by-id.port'
import { Auction, AuctionID } from '../entities/Auction'
import { AuctionsAppError } from '../../core/auctions-app.error'
import { AuctionNotFoundError } from '../errors/auction-not-found.error'

export class GetAuctionByIdUseCase implements UseCase<AuctionID, Auction> {
  constructor(private readonly getByIdPort: GetAuctionByIdPort) {}

  public async execute(id: AuctionID) {
    ok(id, new AuctionsAppError(`"id" must be provided`))
    const auction = await this.getByIdPort.get(id)
    ok(auction?.id, new AuctionNotFoundError(id))

    return auction
  }
}
