import { UseCase } from '../../core/base.use-case'
import { GetExpiredAuctionsPort } from '../ports/get-expired-auctions.port'
import { Auction } from '../entities/Auction'

export class GetExpiredAuctionsUseCase implements UseCase<void, Promise<Auction[]>> {
  constructor(private readonly getByStatusPort: GetExpiredAuctionsPort) {}

  public async execute() {
    return await this.getByStatusPort.get()
  }
}
