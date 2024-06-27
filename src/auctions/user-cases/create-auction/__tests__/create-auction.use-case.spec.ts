import { describe, mock, it, Mock } from 'node:test'
import { ok } from 'node:assert'

import { CreateAuctionUseCase } from '../create-auction.use-case'
import { CreateAuctionPort } from '../create-auction.port'
import { CreateAuctionError } from '../create-auction.error'
import { CreateAuctionDTO } from '../create-auction.dto'

const createErrorCases: Array<{
  name: string
  errorMessage: string
  createOptions: CreateAuctionDTO
}> = [
  {
    name: '"title" validation error',
    errorMessage: `auction's "title" not provided`,
    createOptions: {
      title: '',
      seller: 'q',
    },
  },
  {
    name: '"seller" validation error',
    errorMessage: `auction's "seller" not provided`,
    createOptions: {
      title: 'q',
      seller: '',
    },
  },
]

describe('create-auction.use-case', async () => {
  for (const { name, createOptions, errorMessage } of createErrorCases) {
    it(name, async () => {
      const createAuction = new CreateAuctionUseCase({ save: mock.fn() })
      const result = await createAuction.execute(createOptions)

      ok(result.isLeft(), `createAuction execution must return an "${CreateAuctionError.name}"`)
      ok(result.value.name === CreateAuctionError.name, `createAuction execution returns wrong error type`)
      ok(result.value.message === errorMessage, `createAuction execution returns wrong error message`)
    })
  }

  it('should create an auction', async () => {
    const title = 'title'
    const seller = 'seller'
    const adapter: CreateAuctionPort = { save: mock.fn() }
    const createAuction = new CreateAuctionUseCase(adapter)
    const result = await createAuction.execute({ title, seller })

    ok(result.isRight(), `createAuction execution must return an "Auction"`)
    ok((adapter.save as unknown as Mock<() => void>).mock.callCount() === 1)

    ok(result.value.id, '"id" must be defined')
    ok(result.value.title === title, '"titles" not match')
    ok(result.value.seller === seller, '"sellers" not match')
    ok(result.value.status === 'OPEN', '"status" must be OPEN')

    const newDate = new Date()
    const [date] = new Date().toISOString().split('T')
    const hour = newDate.getHours()
    const createdAtHours = new Date(result.value.createdAt).getHours()
    // const endingAtHours = new Date(result.value.endingAt).getHours()

    ok(result.value.createdAt.startsWith(date), '"createdAt" day not match')
    ok(result.value.endingAt.startsWith(date), '"endingAt" day not match')
    ok(createdAtHours === hour, '"createdAt" hour not match')
    // todo: need the fix depended on time
    // ok(endingAtHours === hour + 1, '"endingAt" hour not match')
  })
})
