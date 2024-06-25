import { Auction, AuctionID } from '../domain/Auction'
import { GetAuctionPort } from './get-auction.port'

export interface UploadAuctionPicturePort extends GetAuctionPort {
  uploadPicture(id: AuctionID, pictureBuffer: Buffer): Promise<string>
  setAuctionPictureUrl(id: AuctionID, pictureUrl: string): Promise<Auction>
}
