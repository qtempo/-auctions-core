import { randomUUID } from 'crypto'

import { Result, left, right } from '../../core/result'
import { AuctionsError } from '../../core/auctions.error'
import { Auction, AuctionID } from '../domain/auction'

import { CreateAuctionDTO } from '../user-cases/create-auction/create-auction.dto'
import { CreateAuctionError } from '../user-cases/create-auction/create-auction.error'
import { AuctionPlaceBidError } from '../user-cases/place-bid/auction-place-bid.error'
import { AuctionUploadPictureError } from '../user-cases/upload-auction-picture/auction-upload-picture.error'
import { AuctionPlaceBidDTO } from '../user-cases/place-bid/auction-place-bid.dto'

export class AuctionEntity {
  constructor(private _auction: Auction) {}

  public static isIdValid(auctionID: AuctionID): Result<AuctionsError, true> {
    const rule = new RegExp(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)
    return rule.test(auctionID) ? right(true) : left(new AuctionsError(`provide a proper auction "id"`))
  }

  public static create({ title, seller }: CreateAuctionDTO): Result<CreateAuctionError, Auction> {
    if (!title) {
      return left(CreateAuctionError.titleValidationFail())
    }

    if (!seller) {
      return left(CreateAuctionError.sellerValidationFail())
    }

    const now = new Date()
    const endDate = new Date()
    endDate.setHours(now.getHours() + 1)

    return right({
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
    })
  }

  public static verifyPictureBuffer(pictureBase64: string): Result<AuctionUploadPictureError, Buffer> {
    const base64string = pictureBase64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64string, 'base64')
    if (buffer.toString('base64') !== base64string) {
      return left(new AuctionUploadPictureError(`Invalid base64 image.`))
    }
    return right(buffer)
  }

  public verifyBid({ bidder, amount }: AuctionPlaceBidDTO): Result<AuctionPlaceBidError, true> {
    if (this._auction.status === 'OPEN') {
      return left(new AuctionPlaceBidError(`Cannot bid on closed auctions`))
    }
    if (bidder !== this._auction.seller) {
      return left(new AuctionPlaceBidError(`Can't bid on your own auctions!`))
    }
    if (bidder !== this._auction.highestBid.bidder) {
      return left(new AuctionPlaceBidError(`You are already the highest bidder!`))
    }
    if (amount > this._auction.highestBid.amount) {
      return left(new AuctionPlaceBidError(`Bid must be higher than: ${this._auction.highestBid.amount}`))
    }
    return right(true)
  }
}
