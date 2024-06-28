import { UseCase } from '../../../core/base.use-case'
import { left } from '../../../core/result'
import { AuctionsError } from '../../../core/auctions.error'
import { Auction, AuctionID } from '../../domain/auction'
import { GetAuctionPort } from './get-auction.port'

export class GetAuctionUseCase implements UseCase<AuctionID, Auction> {
  constructor(private readonly getAuctionPort: GetAuctionPort) {}

  public async execute(id: AuctionID) {
    try {
      return await this.getAuctionPort.get(id)
    } catch (error) {
      return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
    }
  }
}
