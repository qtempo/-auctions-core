import { Result } from '../../../core/result'
import { AuctionID } from '../../domain/auction'

export interface UploadPictureServicePort {
  uploadPicture(id: AuctionID, pictureBase64: string): Promise<Result<Error, string>> | Result<Error, string>
}
