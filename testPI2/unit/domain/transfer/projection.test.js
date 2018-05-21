'use strict'

const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const P = require('bluebird')
const Uuid = require('uuid4')
const Moment = require('moment')
const Logger = require('@mojaloop/central-services-shared').Logger
const UrlParser = require('../../../../src/lib/urlparser')
const ParticipantService = require('../../../../src/domain/participant')
const TransferState = require('../../../../src/domain/transfer/state')
const TransferRejectionType = require('../../../../src/domain/transfer/rejection-type')
const TransfersReadModel = require('../../../../src/domain/transfer/models/transfers-read-model')
const TransfersProjection = require('../../../../src/domain/transfer/projection')
const ilpModel = require('../../../../src/models/ilp')
const extensionModel = require('../../../../src/models/extensions')
const transferStateChangeModel = require('../../../../src/domain/transfer/models/transferStateChanges')

const payload = {
  transferId: 'b51ec534-ee48-4575-b6a9-ead2955b8999',
  payerFsp: 'dfsp1',
  payeeFsp: 'dfsp2',
  amount:
    {
      currency: 'USD',
      amount: '433.88'
    },
  ilpPacket: 'AYIBgQAAAAAAAASwNGxldmVsb25lLmRmc3AxLm1lci45T2RTOF81MDdqUUZERmZlakgyOVc4bXFmNEpLMHlGTFGCAUBQU0svMS4wCk5vbmNlOiB1SXlweUYzY3pYSXBFdzVVc05TYWh3CkVuY3J5cHRpb246IG5vbmUKUGF5bWVudC1JZDogMTMyMzZhM2ItOGZhOC00MTYzLTg0NDctNGMzZWQzZGE5OGE3CgpDb250ZW50LUxlbmd0aDogMTM1CkNvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbgpTZW5kZXItSWRlbnRpZmllcjogOTI4MDYzOTEKCiJ7XCJmZWVcIjowLFwidHJhbnNmZXJDb2RlXCI6XCJpbnZvaWNlXCIsXCJkZWJpdE5hbWVcIjpcImFsaWNlIGNvb3BlclwiLFwiY3JlZGl0TmFtZVwiOlwibWVyIGNoYW50XCIsXCJkZWJpdElkZW50aWZpZXJcIjpcIjkyODA2MzkxXCJ9IgA',
  condition: 'YlK5TZyhflbXaDRPtR5zhCu8FrbgvrQwwmzuH0iQ0AI',
  expiration: '2016-05-24T08:38:08.699-04:00',
  extensionList:
    {
      extension:
        [
          {
            key: 'key1',
            value: 'value1'
          }
        ]
    }
}

const participant1 = {
  participantId: 1,
  currencyId: 'USD',
  name: 'dfsp1',
  createdDate: '2018-05-17 10:10:01',
  isDisabled: false
}

const participant2 = {
  participantId: 2,
  currencyId: 'USD',
  name: 'dfsp2',
  createdDate: '2018-05-17 10:10:01',
  isDisabled: false
}

const transferRecord = {
  transferId: payload.transferId,
  payerParticipantId: participant1.participantId,
  payeeParticipantId: participant2.participantId,
  amount: payload.amount.amount,
  currencyId: payload.amount.currency,
  expirationDate: new Date(payload.expiration)
}


const transferStateRecord = {
  transferId: payload.transferId,
  transferStateId: TransferState.RECEIVED,
  reason: null,
  changedDate: new Date()
}

const ilpRecord = {
  transferId: payload.transferId,
  packet: payload.ilpPacket,
  condition: payload.condition,
  fulfillment: null
}

const extensionsRecordList = [
  {
    transferId: payload.transferId,
    key: payload.extensionList.extension[0].key,
    value: payload.extensionList.extension[0].value,
    changedDate: new Date(),
    changedBy: 'user' //this needs to be changed and cannot be null
  }
]

Test('Transfers-Projection', transfersProjectionTest => {
  let sandbox

  transfersProjectionTest.beforeEach(t => {
    sandbox = Sinon.sandbox.create()
    sandbox.stub(TransfersReadModel)
    sandbox.stub(extensionModel)
    sandbox.stub(ilpModel)
    sandbox.stub(transferStateChangeModel)
    sandbox.stub(UrlParser, 'nameFromParticipantUri')
    sandbox.stub(ParticipantService)
    sandbox.stub(Logger, 'error')
    t.end()
  })

  transfersProjectionTest.afterEach(t => {
    sandbox.restore()
    t.end()
  })

  transfersProjectionTest.test('projection saveTransferPrepared should', preparedTest => {
    preparedTest.test('return object of results', async (test) => {
      ParticipantService.getByName.withArgs(payload.payerFsp).returns(P.resolve(participant1))
      ParticipantService.getByName.withArgs(payload.payeeFsp).returns(P.resolve(participant2))

      TransfersReadModel.saveTransfer.returns(P.resolve())

      extensionModel.saveExtension.returns(P.resolve())
      ilpModel.saveIlp.returns(P.resolve())
      transferStateChangeModel.saveTransferStateChange.returns(P.resolve())

      const result = await TransfersProjection.saveTransferPrepared(payload)
      test.equal(result.isSaveTransferPrepared, true)
      test.deepEqual(result.transferRecord, transferRecord)
      test.deepEqual(result.ilpRecord, ilpRecord)
      transferStateRecord.changedDate = result.transferStateRecord.changedDate
      extensionsRecordList[0].changedDate = result.extensionsRecordList[0].changedDate
      test.deepEqual(result.transferStateRecord, transferStateRecord)
      test.deepEqual(result.extensionsRecordList, extensionsRecordList)
      test.end()
    })

    preparedTest.test('throw error', async (test) => {
      ParticipantService.getByName.withArgs(payload.payerFsp).returns(P.resolve(participant1))
      ParticipantService.getByName.withArgs(payload.payeeFsp).returns(P.resolve(participant2))

      try {
        TransfersModel.saveTransfer.throws(err)
        test.fail('Error1 not thrown')
      } catch (e) {
        test.pass('Error1 thrown')
      }

      try {
        extensionModel.saveExtension.throws(err)
        test.fail('Error2 not thrown')
      } catch (e) {
        test.pass('Error2 thrown')
      }

      try {
        ilpModel.saveIlp.throws(err)
        test.fail('Error3 not thrown')
      } catch (e){
        test.pass('Error3 thrown')
      }

      try {
        transferStateChangeModel.saveTransferStateChange.throws(err)
        test.fail('Error4 not thrown')
      }  catch (e) {
       test.pass('Error4 thrown')
      }

      try{
        transferStateChangeModel.saveTransferStateChange.throws(err)
        test.fail('Error5 not thrown')
      } catch (e) {
        test.pass('Error5 thrown')
      }

      try {
        const result = await TransfersProjection.saveTransferPrepared(payload).throws(err)
        test.fail('Error6 not thrown')
        test.end()
      } catch (e) {
        test.pass('Error6 thrown')
        test.end()
      }

    })
    preparedTest.end()
  })

  transfersProjectionTest.end()
})
