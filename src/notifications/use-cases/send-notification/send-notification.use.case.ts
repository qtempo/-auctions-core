import { UseCase, useCaseHandler } from '@core/base.use-case'
import { right } from '@core/result'

export class SendNotificationUseCase implements UseCase<Notification, number> {
  constructor() {}

  public async execute(request: Notification) {
    return await useCaseHandler(async () => {
      return request && right(0)
    })
  }
}
