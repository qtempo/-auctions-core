import { AuctionID } from '@core/entities'
import { UploadAuctionPictureRepository } from './upload-auction-picture.repository'

export class MockUploadAuctionPictureRepository extends UploadAuctionPictureRepository {
  protected persistPicture(id: AuctionID, pictureBuffer: Buffer): Promise<string> {
    return Promise.resolve(`${id}_${pictureBuffer}`)
  }
}