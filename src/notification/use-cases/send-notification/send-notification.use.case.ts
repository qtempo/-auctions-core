import { right } from '@core/result'
import { UseCase, useCaseHandler } from '@core/base.use-case'
import { AuctionsNotification } from '@core/entities'
import { SendNotificationPort } from './send-notification.port'

export class SendNotificationUseCase implements UseCase<AuctionsNotification, void> {
  constructor(private readonly notificationPort: SendNotificationPort) {}

  public async execute(request: AuctionsNotification) {
    return await useCaseHandler(async () => {
      await this.notificationPort.send(request)
      return right(void 0)
    })
  }
}
