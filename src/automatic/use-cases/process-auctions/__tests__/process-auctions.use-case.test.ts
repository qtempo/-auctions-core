import { describe, it, mock } from 'node:test'
import { deepEqual, equal, ok } from 'node:assert'

import { DomainEvents } from '@core/domain.events'
import { AuctionsNotification } from '@core/entities'
import { MockAutomaticProcessAuctionsRepository } from '@automatic-module/repositories'
import { ProcessAuctionsUseCase } from '../process-auctions.use-case'

const eventsToBeSent = [
  [
    {
      recipient: 'seller',
      subject: 'No bids on your auction.',
      body: 'Item "title" didn\'t get any bids.',
    },
  ],
  [
    {
      recipient: 'seller',
      subject: 'Item has been sold!',
      body: 'Woohoo! Item "title" has been sold for: $10',
    },
  ],
  [
    {
      recipient: 'bidder',
      subject: 'You won an auction!',
      body: 'You got yourself a "title" for $10.',
    },
  ],
]

describe('process-auctions.use-case', () => {
  it('should close auctions and send events', async () => {
    const mockDispatcher = mock.fn()
    DomainEvents.register(AuctionsNotification.name, mockDispatcher)

    const useCase = new ProcessAuctionsUseCase(new MockAutomaticProcessAuctionsRepository())
    const result = await useCase.execute()

    ok(result.isRight())
    equal(result.value, 2, 'must be closed 2 auctions')
    equal(mockDispatcher.mock.callCount(), 3, 'must be dispatched 3 events')
    deepEqual(mockDispatcher.mock.calls.map(c => c.arguments), eventsToBeSent)
  })
})
