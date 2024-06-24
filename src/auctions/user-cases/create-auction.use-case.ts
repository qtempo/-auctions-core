import { ok } from 'node:assert'
import { randomUUID } from 'node:crypto'

import { UseCase } from '../../core/base.use-case'
import { CreateAuctionPort } from '../ports/create-auction.port'
import { CreateAuctionError } from '../errors/create-auction.error'
import { Auction } from '../entities/Auction'

type CreateAuctionType = Pick<Auction, 'title' | 'seller'>

export class CreateAuctionUseCase implements UseCase<CreateAuctionType, Auction> {
  constructor(private readonly createAuctionPort: CreateAuctionPort) {}

  public async execute({ title, seller }: CreateAuctionType) {
    ok(title, new CreateAuctionError('title'))
    ok(seller, new CreateAuctionError('seller'))

    const now = new Date()
    const endDate = new Date()
    endDate.setHours(now.getHours() + 1)
    const auctionToCreate: Auction = {
      id: randomUUID(),
      title,
      seller,
      status: 'OPEN',
      createdAt: now.toISOString(),
      endingAt: endDate.toISOString(),
      highestBid: {
        amount: 0,
        bidder: '',
      },
      pictureUrl: '',
    }

    await this.createAuctionPort.save(auctionToCreate)

    return auctionToCreate
  }
}
