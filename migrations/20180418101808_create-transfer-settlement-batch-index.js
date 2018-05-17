'use strict'

exports.up = function (knex, Promise) {
  return knex.schema.createTableIfNotExists('transferSettlementBatchIndex', (t) => {
    t.bigIncrements('id').primary()

    // t.biginteger('transferSettlementBatchId').unsigned().notNullable().references('transferSettlementBatchId').inTable('transferSettlementBatch').onDelete('CASCADE').index()
    t.bigInteger('transferSettlementBatchId').unsigned()
    t.foreign('transferSettlementBatchId').references('transferSettlementBatchId').inTable('transferSettlementBatch')

    t.string('transferId', 36).notNullable()
    t.foreign('transferId').references('transferId').inTable('transfer')

    t.dateTime('createdDate').defaultTo(knex.fn.now()).notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('transferSettlementBatchIndex')
}
