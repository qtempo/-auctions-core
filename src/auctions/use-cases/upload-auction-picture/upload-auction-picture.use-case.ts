import { left, right } from '@core/result'
import { Auction } from '@auctions/domain/auction'
import { UseCase, useCaseHandler } from '@core/base.use-case'

import { AuctionUploadPictureError } from './auction-upload-picture.error'
import { SetAuctionPictureUrlPort } from './set-auction-picture-url.port'
import { UploadPictureServicePort } from './upload-picture-service.port'

export type UploadAuctionPictureRequest = Pick<Auction, 'id' | 'seller'> & {
  pictureBase64: string
}

export class UploadAuctionPictureUseCase implements UseCase<UploadAuctionPictureRequest, Auction> {
  constructor(
    private readonly auctionPort: SetAuctionPictureUrlPort,
    private readonly uploadPictureService: UploadPictureServicePort,
  ) {}

  public async execute({ id, seller, pictureBase64 }: UploadAuctionPictureRequest) {
    return await useCaseHandler(async () => {
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
    })
  }
}
