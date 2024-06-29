import { randomUUID } from 'crypto'

import { AuctionsError } from '@core/auctions.error'
import { Result, left, right } from '@core/result'

import { Auction, AuctionID, auctionStatuses } from '@auctions/domain/auction'
import { CreateAuctionError } from '@auctions/use-cases/create-auction/create-auction.error'
import { CreateAuctionPort } from '@auctions/use-cases/create-auction/create-auction.port'
import { CreateAuctionRequest } from '@auctions/use-cases/create-auction/create-auction.request'
import { AuctionNotFoundError } from '@auctions/use-cases/get-auction/auction-not-found.error'
import { GetAuctionPort } from '@auctions/use-cases/get-auction/get-auction.port'
import { GetAuctionsByStatusPort } from '@auctions/use-cases/get-auctions-by-status/get-auctions-by-status.port'
import { AuctionPlaceBidError } from '@auctions/use-cases/place-bid/auction-place-bid.error'
import { AuctionPlaceBidPort } from '@auctions/use-cases/place-bid/auction-place-bid.port'
import { AuctionPlaceBidRequest } from '@auctions/use-cases/place-bid/auction-place-bid.request'
import { SetAuctionPictureUrlPort } from '@auctions/use-cases/upload-auction-picture/set-auction-picture-url.port'

/**
 * acts as "template" for an infrastructure
 * and as "ports" for use cases
 */
export abstract class AuctionRepository
implements CreateAuctionPort, GetAuctionPort, GetAuctionsByStatusPort, AuctionPlaceBidPort, SetAuctionPictureUrlPort
{
  constructor(private _auction?: Auction) {}

  protected abstract persist(auction: Auction): Promise<void>
  protected abstract queryById(auctionId: AuctionID): Promise<Auction>
  protected abstract queryByStatus(status: Auction['status']): Promise<Auction[]>
  protected abstract persistBid(request: AuctionPlaceBidRequest): Promise<Auction>
  protected abstract persistAuctionPictureUrl(id: AuctionID, pictureUrl: string): Promise<Auction>

  private isIdValid(auctionID: AuctionID): Result<AuctionsError, true> {
    const rule = new RegExp(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)
    return rule.test(auctionID) ? right(true) : left(new AuctionsError('provide a proper auction "id"'))
  }

  public async create({ title, seller }: CreateAuctionRequest): Promise<Result<CreateAuctionError, Auction>> {
    if (!title) {
      return left(CreateAuctionError.titleValidationFail())
    }

    if (!seller) {
      return left(CreateAuctionError.sellerValidationFail())
    }

    const now = new Date()
    const endDate = new Date()
    endDate.setHours(now.getHours() + 1)
    const auction: Auction = {
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
    await this.persist(auction)

    return right(auction)
  }

  public async get(auctionID: AuctionID): Promise<Result<AuctionNotFoundError | AuctionsError, Auction>> {
    const validation = this.isIdValid(auctionID)
    if (validation.isLeft()) {
      return left(validation.value)
    }

    const auction = await this.queryById(auctionID)
    if (this.isIdValid(auction?.id).isLeft()) {
      return left(new AuctionNotFoundError(auctionID))
    }
    this._auction = auction

    return right(auction)
  }

  public async byStatus(status: Auction['status']): Promise<Result<Error, Auction[]>> {
    if (!auctionStatuses.includes(status)) {
      return left(new AuctionsError('"status" not supported, can\'t perform get'))
    }
    const auctions = await this.queryByStatus(status)

    return right(auctions)
  }

  public async placeBid(
    request: AuctionPlaceBidRequest,
  ): Promise<Result<AuctionPlaceBidError | AuctionNotFoundError, Auction>> {
    if (!this._auction) {
      return left(new AuctionNotFoundError(request.id))
    }
    if (this._auction.status === 'CLOSED') {
      return left(new AuctionPlaceBidError('Cannot bid on closed auctions'))
    }
    if (request.bidder === this._auction.seller) {
      return left(new AuctionPlaceBidError('Can\'t bid on your own auctions!'))
    }
    if (request.bidder === this._auction.highestBid.bidder) {
      return left(new AuctionPlaceBidError('You are already the highest bidder!'))
    }
    if (request.amount <= this._auction.highestBid.amount) {
      return left(new AuctionPlaceBidError(`Bid must be higher than: ${this._auction.highestBid.amount}`))
    }
    const auction = await this.persistBid(request)

    return right(auction)
  }

  public async setPictureUrl(id: AuctionID, pictureUrl: string): Promise<Result<Error, Auction>> {
    const auction = await this.persistAuctionPictureUrl(id, pictureUrl)
    if (!auction?.id) {
      return left(new AuctionNotFoundError(id))
    }
    return right(auction)
  }
}
