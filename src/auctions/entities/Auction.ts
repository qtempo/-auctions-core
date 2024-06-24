export const auctionStatuses = ['OPEN', 'CLOSED'] as const;

export type SellerEmail = string;
export type BidderEmail = string;

export interface Auction {
  id: string;
  title: string;
  status: (typeof auctionStatuses)[number];
  createdAt: string;
  endingAt: string;
  highestBid: {
    amount: number;
    bidder: BidderEmail;
  };
  seller: SellerEmail;
  pictureUrl: string;
}
