import fs from 'node:fs/promises'
import { UUID, randomUUID } from 'node:crypto'
import { describe, it, before } from 'node:test'
import { ok, equal } from 'node:assert'

import { errorResultAssert } from '@core/__test__/error-result.assert'
import { AuctionsError } from '@core/auctions.error'
import { MockUserAuctionsRepository, MockUploadAuctionPictureRepository } from '@user-module/repositories'

import { UploadAuctionPictureError } from '../upload-auction-picture.error'
import { UploadAuctionPictureRequest } from '../upload-auction-picture.request'
import { UploadAuctionPictureUseCase } from '../upload-auction-picture.use-case'

const executeUseCase = async (args: UploadAuctionPictureRequest) => {
  const useCase = new UploadAuctionPictureUseCase(
    new MockUserAuctionsRepository(),
    new MockUploadAuctionPictureRepository(),
  )
  return await useCase.execute(args)
}

describe('upload-auction-picture.use-case', () => {
  let testPictureBase64 = ''

  before(async () => {
    testPictureBase64 = await fs.readFile(`${import.meta.dirname}/signal.jpg`, { encoding: 'base64' })
  })

  it('should fail on auction id verification', async () => {
    const result = await executeUseCase({
      id: (randomUUID() + '123123') as UUID,
      seller: '',
      pictureBase64: '',
    })
    errorResultAssert(result, 'upload.execution', new AuctionsError('provide a proper auction "id"'))
  })

  it('should fail if upload made not buy a seller', async () => {
    const result = await executeUseCase({
      id: randomUUID(),
      seller: 'not-seller',
      pictureBase64: '',
    })
    errorResultAssert(
      result,
      'upload.execution',
      new UploadAuctionPictureError('Only seller allowed to perform this action.'),
    )
  })

  it('should fail on picture validation', async () => {
    const result = await executeUseCase({
      id: randomUUID(),
      seller: 'seller',
      pictureBase64: testPictureBase64 + 'qwerty',
    })
    errorResultAssert(result, 'upload.execution', new UploadAuctionPictureError('Invalid base64 image.'))
  })

  it('should NOT fail on picture validation', async () => {
    const auctionID = randomUUID()
    const result = await executeUseCase({
      id: auctionID,
      seller: 'seller',
      pictureBase64: testPictureBase64,
    })

    ok(result.isRight(), 'execution must be fulfilled')
    equal(result.value.id, auctionID, 'id must be the same')
  })
})
