import { randomUUID } from 'crypto'

import { Result, left, right } from '../../core/result'
import { AuctionsError } from '../../core/auctions.error'
import { Auction, AuctionID, auctionStatuses } from '../domain/auction'

import { CreateAuctionRequest } from '../user-cases/create-auction/create-auction.request'
import { CreateAuctionError } from '../user-cases/create-auction/create-auction.error'
import { AuctionPlaceBidError } from '../user-cases/place-bid/auction-place-bid.error'
import { AuctionUploadPictureError } from '../user-cases/upload-auction-picture/auction-upload-picture.error'
import { AuctionPlaceBidRequest } from '../user-cases/place-bid/auction-place-bid.request'
import { CreateAuctionPort } from '../user-cases/create-auction/create-auction.port'
import { GetAuctionPort } from '../user-cases/get-auction/get-auction.port'
import { AuctionNotFoundError } from '../user-cases/get-auction/auction-not-found.error'
import { GetAuctionsByStatusPort } from '../user-cases/get-auctions-by-status/get-auctions-by-status.port'
import { AuctionPlaceBidPort } from '../user-cases/place-bid/auction-place-bid.port'

/**
 * acts as "template" for an infrastructure
 * and as "ports" for use cases
 */
export abstract class AuctionRepository
implements CreateAuctionPort, GetAuctionPort, GetAuctionsByStatusPort, AuctionPlaceBidPort
{
  constructor(private _auction?: Auction) {}

  public set auction(value: Auction) {
    this._auction = value
  }

  public abstract persist(auction: Auction): Promise<void>
  public abstract queryById(auctionId: AuctionID): Promise<Auction>
  public abstract queryByStatus(status: Auction['status']): Promise<Auction[]>
  public abstract persistBid(request: AuctionPlaceBidRequest): Promise<Auction>

  public static isIdValid(auctionID: AuctionID): Result<AuctionsError, true> {
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
    const validation = AuctionRepository.isIdValid(auctionID)
    if (validation.isLeft()) {
      return left(validation.value)
    }

    const auction = await this.queryById(auctionID)
    if (AuctionRepository.isIdValid(auction?.id).isLeft()) {
      return left(new AuctionNotFoundError(auctionID))
    }
    this.auction = auction

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

  public static verifyPictureBuffer(pictureBase64: string): Result<AuctionUploadPictureError, Buffer> {
    const base64string = pictureBase64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64string, 'base64')
    if (buffer.toString('base64') !== base64string) {
      return left(new AuctionUploadPictureError('Invalid base64 image.'))
    }
    return right(buffer)
  }
}
