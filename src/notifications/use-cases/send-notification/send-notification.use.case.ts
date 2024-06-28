import { UseCase } from '../../../core/base.use-case'
import { left, right } from '../../../core/result'
import { AuctionsError } from '../../../core/auctions.error'
import { Notification } from '../../domain/notification'

export class SendNotificationUseCase implements UseCase<Notification, number> {
  constructor() {}

  public async execute(request: Notification) {
    try {
      request
      return right(0)
    } catch (error) {
      return left(new AuctionsError(`Unexpected error occur: ${(error as Error)['message']}`))
    }
  }
}
