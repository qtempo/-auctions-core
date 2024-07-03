import { describe, it, mock, Mock } from 'node:test'
import { ok, equal } from 'assert'

import { errorResultAssert } from '@core/__test__/error-result.assert'
import { MockUserAuctionsRepository } from '@user-module/repositories'

import { CreateAuctionError } from '../create-auction.error'
import { CreateAuctionRequest } from '../create-auction.request'
import { CreateAuctionUseCase } from '../create-auction.use-case'

const createErrorCases: Array<{
  name: string
  errorMessage: string
  createOptions: CreateAuctionRequest
}> = [
  {
    name: '"title" validation error',
    errorMessage: 'auction\'s "title" not provided',
    createOptions: {
      title: '',
      seller: 'q',
    },
  },
  {
    name: '"seller" validation error',
    errorMessage: 'auction\'s "seller" not provided',
    createOptions: {
      title: 'q',
      seller: '',
    },
  },
]

describe('create-auction.use-case', async () => {
  for (const { name, createOptions, errorMessage } of createErrorCases) {
    it(name, async () => {
      const adapter = new MockUserAuctionsRepository()
      const createAuction = new CreateAuctionUseCase(adapter)
      const result = await createAuction.execute(createOptions)

      errorResultAssert(
        result,
        'createAuction.execution',
        new CreateAuctionError(errorMessage),
      )
    })
  }

  it('should create an auction', async () => {
    const title = 'title'
    const seller = 'seller'
    const adapter = new MockUserAuctionsRepository()
    adapter.persist = mock.fn()

    const createAuction = new CreateAuctionUseCase(adapter)
    const result = await createAuction.execute({ title, seller })

    ok(result.isRight(), 'createAuction execution must return an "Auction"')
    ok((adapter.persist as unknown as Mock<() => void>).mock.callCount() === 1)

    ok(result.value.id, '"id" must be defined')
    equal(result.value.title, title, '"titles" not match')
    equal(result.value.seller, seller, '"sellers" not match')
    equal(result.value.status, 'OPEN', '"status" must be OPEN')

    const newDate = new Date()
    const [date] = new Date().toISOString().split('T')
    const hour = newDate.getHours()
    const createdAtHours = new Date(result.value.createdAt).getHours()
    // const endingAtHours = new Date(result.value.endingAt).getHours()

    ok(result.value.createdAt.startsWith(date), '"createdAt" day not match')
    ok(result.value.endingAt.startsWith(date), '"endingAt" day not match')
    equal(createdAtHours, hour, '"createdAt" hour not match')
    // todo: need the fix depended on current time of the day
    // equal(endingAtHours, hour + 1, '"endingAt" hour not match')
  })
})
