import { UseCase, useCaseHandler } from '@core/base.use-case'
import { right } from '@core/result'
import { ProcessAuctionsPort } from './process-auctions.port'

export class ProcessAuctionsUseCase implements UseCase<void, number> {
  constructor(private readonly port: ProcessAuctionsPort) { }

  public async execute() {
    return await useCaseHandler(async () => {
      const expiredAuctions = await this.port.getExpiredAuctions()
      const closePromises = expiredAuctions.map(a => this.port.closeAuction(a))
      await Promise.all(closePromises)
      return right(expiredAuctions.length)
    })

  }
}
