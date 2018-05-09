'use strict'

const Db = require('../../../db')
// const Moment = require('moment')
const Util = require('../../../lib/util')
const Time = require('../../../lib/time')

exports.create = async (transfer) => {
  try {
    return await Db.ilp.insert({
      transferId: transfer.transferId,
      packet: transfer.ilpPacket,
      condition: transfer.condition,
      fulfillment: transfer.fulfillment
    })
  } catch (err) {
    throw new Error(err.message)
  }
}

// exports.getById = async (id) => {
//   try {
//     return await Db.ilp.findOne({ ilpId: id })
//   } catch (err) {
//     throw new Error(err.message)
//   }
// }

exports.getByTransferId = async (transferId) => {
  try {
    return await Db.ilp
      .select({ transferId: transferId })
      .innerJoin('transfer', 'transfer.transferId', 'ilp.transferId')
      .where('expirationDate', '>', `${Time.getCurrentUTCTimeInMilliseconds()}`) // or maybe ${Moment.utc().toISOString()}
  } catch (err) {
    throw new Error(err.message)
  }
}

exports.update = async (ilp, payload) => {
  const fields = {
    transferId: ilp.transferId,
    packet: payload.ilpPacket,
    condition: payload.condition,
    fulfillment: payload.fulfillment
  }
  try {
    return await Db.ilp.update({ilpId: ilp.ilpId}, Util.filterUndefined(fields))
  } catch (err) {
    throw new Error(err.message)
  }
}