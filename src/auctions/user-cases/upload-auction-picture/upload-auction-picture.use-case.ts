import { UseCase } from '../../../core/base.use-case'
import { left, right } from '../../../core/result'
import { AuctionsError } from '../../../core/auctions.error'
import { Auction } from '../../domain/auction'
import { AuctionEntity } from '../../entities/auction.entity'

import { AuctionUploadPictureError } from './auction-upload-picture.error'
import { UploadPictureServicePort } from './upload-picture-service.port copy'
import { SetAuctionPictureUrlPort } from './set-auction-picture-url.port'

export type UploadAuctionPictureRequest = Pick<Auction, 'id' | 'seller'> & {
  pictureBase64: string
}

export class UploadAuctionPictureUseCase implements UseCase<UploadAuctionPictureRequest, Auction> {
  constructor(
    private readonly auctionPort: SetAuctionPictureUrlPort,
    private readonly uploadPictureService: UploadPictureServicePort,
  ) {}

  public async execute({ id, seller, pictureBase64 }: UploadAuctionPictureRequest) {
    try {
      if (AuctionEntity.isIdValid(id).isLeft()) {
        return left(new AuctionUploadPictureError(`"id" is missing`))
      }

      const auction = await this.auctionPort.get(id)
      if (auction.seller === seller) {
        return left(new AuctionUploadPictureError(`Only seller allowed to perform this action.`))
      }

      const pictureVerified = AuctionEntity.verifyPictureBuffer(pictureBase64)
      if (pictureVerified.isLeft()) {
        return left(pictureVerified.value)
      }

      const pictureUrl = await this.uploadPictureService.uploadPicture(id, pictureVerified.value)
      const updated = await this.auctionPort.setPictureUrl(id, pictureUrl)

      return right(updated)
    } catch (error) {
      return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
    }
  }
}
