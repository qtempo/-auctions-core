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
      const createAuction = new CreateAuctionUseCase({ save: mock.fn() })
      await rejects(createAuction.execute(createOptions), {
        name: CreateAuctionError.name,
        message: errorMessage,
      })
    })
  }

  it('should create an auction', async () => {
    const title = 'title'
    const seller = 'seller'
    const adapter: CreateAuctionPort = { save: mock.fn() }
    const createAuction = new CreateAuctionUseCase(adapter)
    const auction = await createAuction.execute({ title, seller })

    ok((adapter.save as unknown as Mock<any>).mock.callCount() === 1)
    ok(auction.id, '"id" must be defined')
    ok(auction.title === title, '"titles" not match')
    ok(auction.seller === seller, '"sellers" not match')
    ok(auction.status === 'OPEN', '"status" must be OPEN')

    const newDate = new Date()
    const [date] = new Date().toISOString().split('T')
    const hour = newDate.getHours()
    const createdAtHours = new Date(auction.createdAt).getHours()
    const endingAtHours = new Date(auction.endingAt).getHours()
    
    ok(auction.createdAt.startsWith(date), '"createdAt" day not match')
    ok(auction.endingAt.startsWith(date), '"endingAt" day not match')
    ok(createdAtHours === hour, '"createdAt" hour not match')
    ok(endingAtHours === hour + 1, '"endingAt" hour not match')
  })
})
