import { right } from '@core/result'
import { UseCase, useCaseHandler } from '@core/base.use-case'
import { AuctionsNotification } from '@automatic-module'

export class SendNotificationUseCase implements UseCase<AuctionsNotification, number> {
  constructor() {}

  public async execute(request: AuctionsNotification) {
    return await useCaseHandler(async () => {
      return request && right(0)
    })
  }
}
