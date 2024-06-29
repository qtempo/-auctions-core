import { Result } from '@core/result'
import { AuctionID } from '@auctions/domain'

export interface UploadPictureServicePort {
  uploadPicture(id: AuctionID, pictureBase64: string): Promise<Result<Error, string>> | Result<Error, string>
}
