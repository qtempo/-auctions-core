import { AuctionID } from '../domain/auction'
import { FileUploadRepository } from './file-upload.repository'

export class MockFileUploadRepository extends FileUploadRepository {
  protected persistPicture(id: AuctionID, pictureBuffer: Buffer): Promise<string> {
    return Promise.resolve(`${id}_${pictureBuffer}`)
  }
}