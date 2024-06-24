import { Auction, AuctionID } from '../entities/Auction'
import { GetAuctionByIdPort } from './get-auction-by-id.port'

export interface UploadPicturePort extends GetAuctionByIdPort {
  uploadPicture(id: AuctionID, pictureBuffer: Buffer): Promise<string>
  setAuctionPictureUrl(id: AuctionID, pictureUrl: string): Promise<Auction>
}
