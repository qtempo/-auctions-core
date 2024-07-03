import { describe, it, mock } from 'node:test'
import { ok, deepEqual } from 'node:assert'

import { DomainEvents } from '@core/domain.events'
import { AuctionsError } from '@core/auctions.error'
import { AuctionsNotification } from '@core/entities'
import { errorResultAssert } from './error-result.assert'

describe('process-auctions.use-case', () => {
  it('should fail cause event "name" is miss on registerer', async () => {
    const dispatched = DomainEvents.register('', () => undefined)
    errorResultAssert(dispatched, 'DomainEvents.register', new AuctionsError('Could\' register an event'))
  })

  it('should fail cause event "dispatcher" is miss on registerer', async () => {
    const dispatched = DomainEvents.register(AuctionsNotification.name, undefined as any)
    errorResultAssert(dispatched, 'DomainEvents.register', new AuctionsError('Could\' register an event'))
  })

  it('should fail cause no events was registered', async () => {
    const event = new AuctionsNotification('recipient', 'subject', 'body')
    const dispatched = await DomainEvents.dispatch(AuctionsNotification.name, event.get())
    errorResultAssert(
      dispatched,
      'DomainEvents.dispatch',
      new AuctionsError(`Dispatcher not found for the event: ${AuctionsNotification.name}`),
    )
  })

  it('should call event dispatcher', async () => {
    const mockDispatcher = mock.fn()
    const event = new AuctionsNotification('recipient', 'subject', 'body')
    DomainEvents.register(AuctionsNotification.name, mockDispatcher)

    const dispatched = await DomainEvents.dispatch(AuctionsNotification.name, event.get())

    ok(dispatched.isRight(), 'DomainEvents.dispatch must be fulfilled')
    ok(mockDispatcher.mock.callCount() === 1, 'Dispatcher mist be called once')
    deepEqual(
      mockDispatcher.mock.calls[0].arguments[0],
      { recipient: 'recipient', subject: 'subject', body: 'body' },
      'Dispatcher must be called with proper arguments',
    )
  })
})