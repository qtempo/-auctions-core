import { ok } from 'node:assert'
import { UseCase } from '../../core/base.use-case'
import { PlaceBidPort, PlaceBidType } from '../ports/place-bid.port'
import { Auction } from '../entities/Auction'
import { PlaceBidError } from '../errors/place-bid.error'

export class PlaceBidUseCase implements UseCase<PlaceBidType, Auction> {
  constructor(private readonly placeBidPort: PlaceBidPort) {}

  public async execute(args: PlaceBidType) {
    const { id, bidder, amount } = args
    ok(id, new PlaceBidError(`"id" is missing`))
    const auction = await this.placeBidPort.get(id)

    ok(auction.status === 'OPEN', new PlaceBidError(`Cannot bid on closed auctions`))
    ok(amount > auction.highestBid.amount, new PlaceBidError(`Bid must be higher than: ${auction.highestBid.amount}`))
    ok(bidder !== auction.seller, new PlaceBidError(`Can't bid on your own auctions!`))
    ok(bidder !== auction.highestBid.bidder, new PlaceBidError(`You are already the highest bidder!`))

    return await this.placeBidPort.placeBid(args)
  }
}
