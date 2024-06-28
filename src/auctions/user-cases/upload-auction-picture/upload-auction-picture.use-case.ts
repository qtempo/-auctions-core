import { UseCase } from '../../../core/base.use-case'
import { left, right } from '../../../core/result'
import { AuctionsError } from '../../../core/auctions.error'
import { Auction } from '../../domain/auction'

import { AuctionUploadPictureError } from './auction-upload-picture.error'
import { UploadPictureServicePort } from './upload-picture-service.port'
import { SetAuctionPictureUrlPort } from './set-auction-picture-url.port'

export type UploadAuctionPictureRequest = Pick<Auction, 'id' | 'seller'> & {
  pictureBase64: string
}

export class UploadAuctionPictureUseCase implements UseCase<UploadAuctionPictureRequest, Auction> {
  constructor(
    private readonly auctionPort: SetAuctionPictureUrlPort,
    private readonly uploadPictureService: UploadPictureServicePort,
  ) { }

  public async execute({ id, seller, pictureBase64 }: UploadAuctionPictureRequest) {
    try {
      const auctionResult = await this.auctionPort.get(id)
      if (auctionResult.isLeft())
        return left(auctionResult.value)

      if (auctionResult.value.seller !== seller)
        return left(new AuctionUploadPictureError('Only seller allowed to perform this action.'))

      const uploadResult = await this.uploadPictureService.uploadPicture(id, pictureBase64)
      if (uploadResult.isLeft())
        return left(uploadResult.value)

      const updatedResult = await this.auctionPort.setPictureUrl(id, uploadResult.value)
      if (updatedResult.isLeft())
        return left(updatedResult.value)

      return right(updatedResult.value)
    } catch (error) {
      return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
    }
  }
}
