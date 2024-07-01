import { Result, left, right } from '@core/result'
import { AuctionID } from '@core/domain'
import { UploadAuctionPictureError, UploadAuctionPictureServicePort } from '..'

export abstract class UploadAuctionPictureRepository implements UploadAuctionPictureServicePort {
  protected abstract persistPicture(id: AuctionID, pictureBuffer: Buffer): Promise<string>

  public async upload(id: AuctionID, pictureBase64: string): Promise<Result<UploadAuctionPictureError, string>> {
    const base64string = pictureBase64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64string, 'base64')
    if (buffer.toString('base64') !== base64string) {
      return left(new UploadAuctionPictureError('Invalid base64 image.'))
    }
    const pictureUrl = await this.persistPicture(id, buffer)
    return right(pictureUrl)
  }
}