import { ok } from 'node:assert'
import { UseCase } from '../../core/base.use-case'
import { Auction } from '../domain/Auction'
import { UploadAuctionPicturePort } from '../ports/upload-auction-picture.port'
import { UploadPictureError } from '../errors/upload-picture.error'

export type UploadAuctionPictureRequest = Pick<Auction, 'id' | 'seller'> & {
  pictureBase64: string
}

export class UploadAuctionPictureUseCase implements UseCase<UploadAuctionPictureRequest, Auction> {
  constructor(private readonly port: UploadAuctionPicturePort) {}

  public async execute({ id, seller, pictureBase64 }: UploadAuctionPictureRequest) {
    ok(id, new UploadPictureError(`"id" is missing`))
    const auction = await this.port.get(id)
    ok(auction.seller === seller, new UploadPictureError(`Only seller allowed to perform this action.`))

    const base64string = pictureBase64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64string, 'base64')
    ok(buffer.toString('base64') !== base64string, new UploadPictureError(`Invalid base64 string.`))
    const pictureUrl = await this.port.uploadPicture(id, buffer)

    return await this.port.setAuctionPictureUrl(id, pictureUrl)
  }
}
