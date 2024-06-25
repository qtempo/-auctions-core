import { ok } from 'assert'
import { UseCase } from '../../core/base.use-case'
import { GetAuctionPort } from '../ports/get-auction.port'
import { Auction, AuctionID } from '../domain/Auction'
import { AuctionsAppError } from '../../core/auctions-app.error'
import { AuctionNotFoundError } from '../errors/auction-not-found.error'

export class GetAuctionUseCase implements UseCase<AuctionID, Auction> {
  constructor(private readonly port: GetAuctionPort) {}

  public async execute(id: AuctionID) {
    ok(id, new AuctionsAppError(`"id" must be provided`))
    const auction = await this.port.get(id)
    ok(auction?.id, new AuctionNotFoundError(id))

    return auction
  }
}
