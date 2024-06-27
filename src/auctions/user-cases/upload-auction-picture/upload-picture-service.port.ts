import { AuctionID } from '../../domain/auction'

export interface UploadPictureServicePort {
  uploadPicture(id: AuctionID, pictureBuffer: Buffer): Promise<string>
}
