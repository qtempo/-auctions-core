import { UseCase, useCaseHandler } from '@core/base.use-case'
import { AuctionsError } from '@core/auctions.error'
import { left, right } from '@core/result'
import { ProcessAuctionsPort } from './process-auctions.port'

export class ProcessAuctionsUseCase implements UseCase<AuctionsError, number> {
  constructor(private readonly port: ProcessAuctionsPort) { }

  public async execute() {
    return await useCaseHandler(async () => {
      const expiredAuctions = await this.port.getExpiredAuctions()
      const closedResult = expiredAuctions.map(a => this.port.closeAuction(a))
      const closedResultResolved = await Promise.all(closedResult)
      const error = closedResultResolved.find(r => r.isLeft())
      if (error?.isLeft())
        return left(error.value)

      return right(expiredAuctions.length)
    })

  }
}
