import { left, right } from '@core/result'
import { Auction } from '@core/entities'
import { UseCase, useCaseHandler } from '@core/base.use-case'

import { UploadAuctionPictureError } from './upload-auction-picture.error'
import { SetAuctionPictureUrlPort } from './set-auction-picture-url.port'
import { UploadAuctionPictureServicePort } from './upload-auction-picture-service.port'
import { UploadAuctionPictureRequest } from './upload-auction-picture.request'

export class UploadAuctionPictureUseCase implements UseCase<UploadAuctionPictureRequest, Auction> {
  constructor(
    private readonly auctionPort: SetAuctionPictureUrlPort,
    private readonly uploadPictureService: UploadAuctionPictureServicePort,
  ) {}

  public async execute({ id, seller, pictureBase64 }: UploadAuctionPictureRequest) {
    return await useCaseHandler(async () => {
      const auctionResult = await this.auctionPort.get(id)
      if (auctionResult.isLeft())
        return left(auctionResult.value)

      if (auctionResult.value.seller !== seller)
        return left(new UploadAuctionPictureError('Only seller allowed to perform this action.'))

      const uploadResult = await this.uploadPictureService.upload(id, pictureBase64)
      if (uploadResult.isLeft())
        return left(uploadResult.value)

      const updatedResult = await this.auctionPort.setPictureUrl(id, uploadResult.value)
      if (updatedResult.isLeft())
        return left(updatedResult.value)

      return right(updatedResult.value)
    })
  }
}
