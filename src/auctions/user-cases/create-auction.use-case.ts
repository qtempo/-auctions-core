import { ok } from 'node:assert'
import { randomUUID } from 'node:crypto'

import { UseCase } from '../../core/base.use-case'
import { Auction } from '../entities/Auction'
import { CreateAuctionPort } from '../ports/create-auction.port'
import { CreateAuctionError } from '../errors/create-auction.error'

type CreateAuctionType = Pick<Auction, 'title' | 'seller'>

export class CreateAuctionUseCase implements UseCase<CreateAuctionType, Promise<Auction>> {
  constructor(private readonly createAuctionPort: CreateAuctionPort) {}

  public async execute({ title, seller }: CreateAuctionType) {
    ok(title, new CreateAuctionError(`auction's "title" not provided`))
    ok(seller, new CreateAuctionError(`auction's "seller" not provided`))

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
