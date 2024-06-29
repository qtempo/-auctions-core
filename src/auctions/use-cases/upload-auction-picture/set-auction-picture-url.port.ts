import { Result } from '@core/result'
import { AuctionID, Auction } from '@auctions/domain'
import { GetAuctionPort } from '../get-auction/get-auction.port'

export interface SetAuctionPictureUrlPort extends GetAuctionPort {
  setPictureUrl(id: AuctionID, pictureUrl: string): Promise<Result<Error, Auction>> | Result<Error, Auction>
}
