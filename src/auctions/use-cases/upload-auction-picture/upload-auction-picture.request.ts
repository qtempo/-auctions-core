import { Auction } from '@auctions/domain'

export type UploadAuctionPictureRequest = Pick<Auction, 'id' | 'seller'> & {
  pictureBase64: string
}