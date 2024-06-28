import { UseCase } from '../../../core/base.use-case'
import { left, right } from '../../../core/result'
import { AuctionsError } from '../../../core/auctions.error'
import { Auction } from '../../domain/auction'
import { AuctionRepository } from '../../repositories/auction.repository'

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
      const idValidation = AuctionRepository.isIdValid(id)
      if (idValidation.isLeft())
        return left(idValidation.value)

      const auctionResult = await this.auctionPort.get(id)
      if (auctionResult.isLeft())
        return left(auctionResult.value)

      const auction = auctionResult.value
      if (auction.seller !== seller)
        return left(new AuctionUploadPictureError('Only seller allowed to perform this action.'))

      const pictureVerified = AuctionRepository.verifyPictureBuffer(pictureBase64)
      if (pictureVerified.isLeft())
        return left(pictureVerified.value)

      const pictureUrl = await this.uploadPictureService.uploadPicture(id, pictureVerified.value)
      const updated = await this.auctionPort.setPictureUrl(id, pictureUrl)

      return right(updated)
    } catch (error) {
      return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
    }
  }
}
