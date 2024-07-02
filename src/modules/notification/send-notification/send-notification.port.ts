import { AuctionsNotification } from '@core/entities'
import { Result } from '@core/result'

export interface SendNotificationPort {
  send(notification: AuctionsNotification): Promise<Result<Error, void>> | Result<Error, void>
}