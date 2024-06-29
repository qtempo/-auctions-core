import { Result, left, right } from '@core/result'
import { AuctionID } from '@auctions/domain/auction'
import { AuctionUploadPictureError } from '@auctions/use-cases/upload-auction-picture/auction-upload-picture.error'
import { UploadPictureServicePort } from '@auctions/use-cases/upload-auction-picture/upload-picture-service.port'

export abstract class FileUploadRepository implements UploadPictureServicePort {
  protected abstract persistPicture(id: AuctionID, pictureBuffer: Buffer): Promise<string>

  public async uploadPicture(id: AuctionID, pictureBase64: string): Promise<Result<AuctionUploadPictureError, string>> {
    const base64string = pictureBase64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64string, 'base64')
    if (buffer.toString('base64') !== base64string) {
      return left(new AuctionUploadPictureError('Invalid base64 image.'))
    }
    const pictureUrl = await this.persistPicture(id, buffer)
    return right(pictureUrl)
  }
}