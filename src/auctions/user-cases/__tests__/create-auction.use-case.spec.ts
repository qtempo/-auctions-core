import { describe, mock, it, Mock } from 'node:test'
import { rejects, ok } from 'node:assert'

import { CreateAuctionUseCase } from '../create-auction.use-case'
import { CreateAuctionPort } from '../../ports/create-auction.port'
import { CreateAuctionError } from '../../errors/create-auction.error'

const createErrorCases = [
  {
    name: 'validate "title"',
    errorMessage: `auction's "title" not provided`,
    createOptions: {
      title: '',
      seller: 'q',
    },
  },
  {
    name: 'validate "seller"',
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
      const adapter: CreateAuctionPort = {
        save: mock.fn(),
      }
      const useCase = new CreateAuctionUseCase(adapter)

      await rejects(useCase.execute(createOptions), {
        name: CreateAuctionError.name,
        message: errorMessage,
      })
    })
  }

  it('should create an auction', async () => {
    const adapter: CreateAuctionPort = {
      save: mock.fn(),
    }
    const useCase = new CreateAuctionUseCase(adapter)

    const title = 'title'
    const seller = 'seller'
    const auction = await useCase.execute({ title, seller })

    ok(auction.id, '"id" must be defined')
    ok(auction.title === title, '"titles" not match')
    ok(auction.seller === seller, '"sellers" not match')
    ok(auction.status === 'OPEN', '"status" must be OPEN')

    const date = new Date()
    const day = date.toISOString().split('T')[0]
    const hour = date.getUTCHours()

    ok(auction.createdAt.startsWith(day), '"createdAt" day not match')
    ok(auction.endingAt.startsWith(day), '"endingAt" day not match')
    ok(auction.createdAt.split('T')[1].startsWith(hour + ''), '"createdAt" hour not match')
    ok(auction.endingAt.split('T')[1].startsWith(hour + 1 + ''), '"endingAt" hour not match')

    ok((adapter.save as unknown as Mock<any>).mock.callCount() === 1)
  })
})
