import { Result } from '@core/result'
import { AuctionID } from '@core/entities'

export interface UploadAuctionPictureServicePort {
  upload(id: AuctionID, pictureBase64: string): Promise<Result<Error, string>> | Result<Error, string>
}
