'use strict'

exports.up = function (knex, Promise) {
  return knex.schema.table('transfer', (t) => {
    t.index('transferId')
    // @NOTE this link has been moved into the transferStateChange table
    // t.index('transferStateChangeId')
    // @NOTE this link has been moved into the transferSettlementBatchIndex table
    // t.index('transferSettlementBatchId')
    t.index('payerParticipantId')
    t.index('payeeParticipantId')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('transfer', (t) => {
    t.dropIndex('transferId')
    // @NOTE this link has been moved into the transferStateChange table
    // t.dropIndex('transferStateChangeId')
    // @NOTE this link has been moved into the transferSettlementBatchIndex table
    // t.dropIndex('transferSettlementBatchId')
    t.dropIndex('payerParticipantId')
    t.dropIndex('payeeParticipantId')
  })
}
