'use strict'

// const Crypto = require('crypto')
// const base64url = require('base64-url')
// // const cc = require('five-bells-condition')
//
// // const myFulfilment = new cc.PreimageSha256()
// // const stringInputToEncode = 'hello world'
// //
// // myFulfilment.setPreimage(new Buffer(stringInputToEncode))
// //
// // // Calculate the condition
// // const condition = myFulfilment.getConditionUri()
// // console.log(`Condition: ${condition}`)
// //
// // // Calculate the fulfilment
// // const fulfilment = myFulfilment.serializeUri()
// // console.log(`fulfilment: ${fulfilment}`)
// //
// // // Calculate the condition from the fulfilmentcc.fu
// // const conditionResult = cc.fulfillmentToCondition(fulfilment)
// //
// // // Print results and if the conditions match
// // console.log(`Validate condition result = ${conditionResult} | match result = ${condition === conditionResult}`)
//
// // const secret = '123456789'
// // const ilpPacket = 'simple'
//
// // Function to calculateConditionFromFulfil
// const calculateConditionFromFulfil = (fulfilment) => {
//   // TODO: The following hashing code should be moved into a re-usable common-shared-service at a later point
//   var hashSha256 = Crypto.createHash('sha256')
//   // var calculatedCondition = fulfilment // based on 6.5.1.2, the hash should be done on the decoded value as per the next line
//   var calculatedCondition = base64url.decode(fulfilment)
//   // calculatedCondition = hashSha256.update(calculatedCondition)
//   calculatedCondition = hashSha256.digest(new Buffer(calculatedCondition)).toString('base64')
//   calculatedCondition = base64url.escape(calculatedCondition)
//   console.log(`calculatedCondition=${calculatedCondition}`)
//   return calculatedCondition
// }
//
// // NOTE: This logic is based on v1.0 of the Mojaloop Specification as described in section 6.5.1.2
// const validateFulfilCondition = (fulfilment, condition) => {
//   // TODO: The following hashing code should be moved into a re-usable common-shared-service at a later point
//   var calculatedCondition = calculateConditionFromFulfil(fulfilment)
//   return calculatedCondition === condition
// }
//
// const secret = '123456789111'
// const packet = 'simple11'
//
// // var hmacsignature = Crypto.createHmac('sha256', new Buffer(secret, 'base64'))
// //   .update(packet) // make sure to pass the packet in as a Buffer
// //   .digest()
// //   .toString('base64')
//
// var hmacsignature = Crypto.createHmac('sha256', new Buffer(secret, 'utf8'))
//   .update(new Buffer(packet, 'utf8')) // make sure to pass the packet in as a Buffer
//   .digest()
//   .toString('base64')
//
// console.log(`hmacsignature=${hmacsignature} | length:${hmacsignature.length}`)
//
// var hashSha256 = Crypto.createHash('sha256')
//
// var generatedFulfilFromSecret = hmacsignature
//
// // generatedFulfilFromSecret = hashSha256.update(hmacsignature)
// // // console.log(conditionHashedFulfil)
// // generatedFulfilFromSecret = base64url.escape(hashSha256.digest(hmacsignature)
// //   .toString('base64'))
//
// generatedFulfilFromSecret = base64url.escape(hashSha256.update(hmacsignature).digest(hmacsignature)
//   .toString('base64'))
//
// console.log(`Generated Fulfil from Secret: ${generatedFulfilFromSecret} | length:${generatedFulfilFromSecret.length}`)
//
// var generatedFulfilFromSecretCondition = calculateConditionFromFulfil(generatedFulfilFromSecret)
//
// console.log(`Generated Condition from fulfil: ${generatedFulfilFromSecretCondition} | length:${generatedFulfilFromSecretCondition.length}`)
// // console.log(`Compare generated fulfilment vs condition: ${validateFulfilCondition(generatedFulfilFromSecret,generatedFulfilFromSecretCondition)}`)
//
// // const validateFulfilCondition = (fulfilment, condition) => {
// //   // TODO: The following hashing code should be moved into a re-usable common-shared-service at a later point
// //   const Crypto = require('crypto')
// //   var hashSha256 = Crypto.createHash('sha256')
// //   var calculatedCondition = fulfilment
// //   calculatedCondition = hashSha256.update(calculatedCondition)
// //   calculatedCondition = hashSha256.digest(calculatedCondition).toString('base64').slice(0, -1) // removing the trailing '=' as per the specification
// //   console.log(`calculatedCondition=${calculatedCondition}`)
// //   return calculatedCondition === condition
// // }
//
// console.log(`Compare generated fulfilment vs condition: ${validateFulfilCondition(generatedFulfilFromSecret, generatedFulfilFromSecretCondition)}`)
//
// //
// // const validateFulfilConditionv2 = (fulfilment, condition) => {
// //   // TODO: The following hashing code should be moved into a re-usable common-shared-service at a later point
// //   var hashSha256 = Crypto.createHash('sha256')
// //   var calculatedCondition = base64url.decode(fulfilment)
// //   calculatedCondition = hashSha256.update(calculatedCondition)
// //   // calculatedCondition = hashSha256.digest(calculatedCondition).toString('base64').slice(0, -1) // removing the trailing '=' as per the specification
// //   calculatedCondition = hashSha256.digest(calculatedCondition).toString('base64')
// //   calculatedCondition = base64url.escape(calculatedCondition)
// //   console.log(`calculatedCondition=${calculatedCondition}`)
// //   return calculatedCondition === condition
// // }
// //
// // // const base64url = require('base64-url')
// // //
// // // const validateFulfilConditionv2 = (fulfilment, condition) => {
// // //   // TODO: The following hashing code should be moved into a re-usable common-shared-service at a later point
// // //   // const fulfilDecoded = Buffer.from(`${fulfilment}=`, 'base64').toString('ascii')
// // //   // const conditionDecoded = Buffer.from(`${condition}=`, 'base64').toString('ascii')
// // //   // const Crypto = require('crypto')
// // //   // var hashSha256 = Crypto.createHash('sha256')
// // //   // var calculatedCondition = fulfilDecoded
// // //   // calculatedCondition = hashSha256.update(calculatedCondition)
// // //   // calculatedCondition = hashSha256.digest(calculatedCondition).toString('base64').slice(0, -1) // removing the trailing '=' as per the specification
// // //   // console.log(`calculatedCondition=${calculatedCondition}`)
// // //
// // //   const fiveBellsConditionFormat = `ni:///sha-256;${condition}`
// // //   const FiveBellsCondition = require('five-bells-condition')
// // //   const calculatedCondition = FiveBellsCondition.fulfillmentToCondition(fiveBellsConditionFormat)
// // //   return calculatedCondition === fiveBellsConditionFormat
// // // }
// //
// // // let res = validateFulfilCondition('nYu2PGqfRDWnHbT649q0gc+7DcIq8iwcwHAQQa5T2HY', 'vJyJoxWiEbx+bYI8NWJ8GSETXEK2kxKaPVDex0OKv/U')
// //
// // // console.log(`validateFulfilCondition(Condition, conditionHashedFulfil)=${res}`)
// //
// let con
// let ful
// //
// // // own test
// // con = 'kiMJr_dTMV7Xif2m4qxo_opDJKgKFdJC-lm4nKHMiY8'
// // con = 'otTwY9oJKLBrWmLI4h0FEw4ksdZtoAkX3qOVAygUlTI'
// // ful = 'uU0nuZNNPgilLlLX2n2r-sSE7-N6U4DukIj3rOLvzek'
// //
// // // pre-decode hash test
// // con = 'otTwY9oJKLBrWmLI4h0FEw4ksdZtoAkX3qOVAygUlTI'
// // ful = 'uU0nuZNNPgilLlLX2n2r-sSE7-N6U4DukIj3rOLvzek'
// //
// // // integration tes
// // // con = '47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU'
// // // ful = 'oAKAAA'
// //
// // // swagger example
// con = 'LjdeWbAvm9Qo_3x3kuUkodMo-ENmh-SPnSMDrXuZhsM'
// ful = '9cvK2DW9xNxF1GbiBBdXbjX-LrJzC7EkiZkyycDnoNM'
// // con = 'LjdeWbAvm9Qo_3x3kuUkodMo-ENmh-SPnSMDrXuZhsM'
// // ful = 'WLctttbu2HvTsa1XWvUoGRcQozHsqeu9Ahl2JW9Bsu8'
// //
// // console.log(`ful=${ful}`)
// // console.log(`con=${con}`)
// //
// let res = validateFulfilCondition(ful, con)
// // let res = validateFulfilConditionv2(ful, con)
// //
// console.log(`validateFulfilCondition(Condition, conditionHashedFulfil)=${res}`)
// // //
// // // res = validateFulfilConditionv2(con, ful)
// // // console.log(`validateFulfilCondition(Condition, conditionHashedFulfil)=${res}`)
// //
//
// let condition = 'otTwY9oJKLBrWmLI4h0FEw4ksdZtoAkX3qOVAygUlTI'
//
// let fulfilment = 'uU0nuZNNPgilLlLX2n2r-sSE7-N6U4DukIj3rOLvzek'
//
// let res1 = validateFulfilCondition(fulfilment, condition)
// // let res = validateFulfilConditionv2(ful, con)
// //
// console.log(`validateFulfilCondition(Condition, conditionHashedFulfil)=${res1}`)
//
// let fulfil1 = 'UNlJ98hZTY_dsw0cAqw4i_UN3v4utt7CZFB4yfLbVFA'
// let condit1 = 'GRzLaTP7DJ9t4P-a_BA0WA9wzzlsugf00-Tn6kESAfM'
//
// let res2 = validateFulfilCondition(fulfil1, condit1)
//
// console.log(`validateFulfilCondition(Condition, conditionHashedFulfil)=${res2}`)
//
// const FiveBellsCondition = require('five-bells-condition')
//
// // const validateCondition = (conditionUri) => {
// //   try {
// //     return FiveBellsCondition.validateCondition(conditionUri)
// //   } catch (error) {
// //     console.log(error)
// //   }
// // }
//
// const validateFulfilment = (fulfilment, condition) => {
//   try {
//     const fulfilmentCondition = FiveBellsCondition.fulfillmentToCondition(fulfilment)
//     if (fulfilmentCondition === condition) {
//       return FiveBellsCondition.validateFulfillment(fulfilment, condition)
//     }
//   } catch (error) {
//     console.log(error)
//   }
//   // throw new Errors.UnmetConditionError()
// }
//
// // let fulfil2 = `ni://sha-256;${fulfil1}`
// let fulfil2 = `ni:///sha-256;${fulfil1}?fpt=preimage-sha-256&cost=0`
// // let condit2 = `ni://sha-256;${condit1}`
// let condit2 = `ni://sha-256;${condit1}?fpt=preimage-sha-256&cost=0`
//
// let res3 = validateFulfilment(fulfil2, condit2)
// // let res3 = validateFulfilment(new Buffer(fulfil2), new Buffer(condit2))
//
// // console.log(`validateFulfilCondition(Condition, conditionHashedFulfil)=${res3}`)
//
// // let test = FiveBellsCondition.fromFulfillmentBinary(fulfil1)
//
// // const parsedFulfillment = FiveBellsCondition.fromFulfillmentUri(fulfil1)
//

//
// console.log('\n\n\n\n\n\n\n')
console.log('===================================')

const Crypto = require('crypto')
// const base64url = require('base64-url')
const base64url = require('base64url')

const l1pSecret = 'secret'
const l1pPacket = 'AQAAAAAAAABkC3ByaXZhdGUuYm9iggXcZXlKMGNtRnVjMkZqZEdsdmJrbGtJam9pWVRnek1qTmlZell0WXpJeU9DMDBaR1l5TFdGbE9ESXRaVFZoT1RrM1ltRm1PRGs1SWl3aWNYVnZkR1ZKWkNJNkltSTFNV1ZqTlRNMExXVmxORGd0TkRVM05TMWlObUU1TFdWaFpESTVOVFZpT0RBMk9TSXNJbkJoZVdWbElqcDdJbkJoY25SNVNXUkpibVp2SWpwN0luQmhjblI1U1dSVWVYQmxJam9pVFZOSlUwUk9JaXdpY0dGeWRIbEpaR1Z1ZEdsbWFXVnlJam9pTVRZeE16VTFOVEV5TVRJaUxDSndZWEowZVZOMVlrbGtUM0pVZVhCbElqb2lVRUZUVTFCUFVsUWlMQ0ptYzNCSlpDSTZJakV5TXpRaWZTd2liV1Z5WTJoaGJuUkRiR0Z6YzJsbWFXTmhkR2x2YmtOdlpHVWlPaUl4TWpNMElpd2libUZ0WlNJNklrcDFjM1JwYmlCVWNuVmtaV0YxSWl3aWNHVnljMjl1WVd4SmJtWnZJanA3SW1OdmJYQnNaWGhPWVcxbElqcDdJbVpwY25OMFRtRnRaU0k2SWtwMWMzUnBiaUlzSW0xcFpHUnNaVTVoYldVaU9pSlFhV1Z5Y21VaUxDSnNZWE4wVG1GdFpTSTZJbFJ5ZFdSbFlYVWlmU3dpWkdGMFpVOW1RbWx5ZEdnaU9pSXhPVGN4TFRFeUxUSTFJbjE5TENKd1lYbGxjaUk2ZXlKd1lYSjBlVWxrU1c1bWJ5STZleUp3WVhKMGVVbGtWSGx3WlNJNklrMVRTVk5FVGlJc0luQmhjblI1U1dSbGJuUnBabWxsY2lJNklqRTJNVE0xTlRVeE1qRXlJaXdpY0dGeWRIbFRkV0pKWkU5eVZIbHdaU0k2SWxCQlUxTlFUMUpVSWl3aVpuTndTV1FpT2lJeE1qTTBJbjBzSW0xbGNtTm9ZVzUwUTJ4aGMzTnBabWxqWVhScGIyNURiMlJsSWpvaU5UWTNPQ0lzSW01aGJXVWlPaUpOYVdOb1lXVnNJRXB2Y21SaGJpSXNJbkJsY25OdmJtRnNTVzVtYnlJNmV5SmpiMjF3YkdWNFRtRnRaU0k2ZXlKbWFYSnpkRTVoYldVaU9pSk5hV05vWVdWc0lpd2liV2xrWkd4bFRtRnRaU0k2SWtwbFptWnlaWGtpTENKc1lYTjBUbUZ0WlNJNklrcHZjbVJoYmlKOUxDSmtZWFJsVDJaQ2FYSjBhQ0k2SWpFNU5qTXRNREl0TVRjaWZYMHNJbUZ0YjNWdWRDSTZleUpqZFhKeVpXNWplU0k2SWxWVFJDSXNJbUZ0YjNWdWRDSTZJakV3TUNKOUxDSjBjbUZ1YzJGamRHbHZibFI1Y0dVaU9uc2ljMk5sYm1GeWFXOGlPaUpVVWtGT1UwWkZVaUlzSW5OMVlsTmpaVzVoY21sdklqb2liRzlqWVd4c2VTQmtaV1pwYm1Wa0lITjFZaTF6WTJWdVlYSnBieUlzSW1sdWFYUnBZWFJ2Y2lJNklsQkJXVVZGSWl3aWFXNXBkR2xoZEc5eVZIbHdaU0k2SWtOUFRsTlZUVVZTSWl3aWNtVm1kVzVrU1c1bWJ5STZleUp2Y21sbmFXNWhiRlJ5WVc1ellXTjBhVzl1U1dRaU9pSmlOVEZsWXpVek5DMWxaVFE0TFRRMU56VXRZalpoT1MxbFlXUXlPVFUxWWpnd05qa2lmU3dpWW1Gc1lXNWpaVTltVUdGNWJXVnVkSE1pT2lJeE1qTWlmU3dpYm05MFpTSTZJbE52YldVZ2JtOTBaUzRpTENKbGVIUmxibk5wYjI1TWFYTjBJanA3SW1WNGRHVnVjMmx2YmlJNlczc2lhMlY1SWpvaWEyVjVNU0lzSW5aaGJIVmxJam9pZG1Gc2RXVXhJbjBzZXlKclpYa2lPaUpyWlhreUlpd2lkbUZzZFdVaU9pSjJZV3gxWlRJaWZWMTlmUT09'

// var hmacsignature = Crypto.createHmac('sha256', new Buffer(secret, 'base64'))
//   .update(packet) // make sure to pass the packet in as a Buffer
//   .digest()
//   .toString('base64')

const caluclateFulfil = (base64EncodedPacket, rawSecret) => {
  var hmacsignature = Crypto.createHmac('sha256', new Buffer(base64url(rawSecret), 'ascii'))
    .update(new Buffer(base64EncodedPacket, 'ascii')) // make sure to pass the packet in as a Buffer

  var generatedFulfilment = hmacsignature.digest('base64')

  // console.log(`caluclateFulfil:: generatedFulfilment=${generatedFulfilment} | length:${generatedFulfilment.length}`)

  return base64url.fromBase64(generatedFulfilment)
}

// const caluclateFulfil = (packet, secret) => {
//   // var hmacsignature = Crypto.createHmac('sha256', new Buffer(secret, 'utf8'))
//   //   .update(new Buffer(packet, 'utf8')) // make sure to pass the packet in as a Buffer
//   //   .digest()
//   var hmacsignature = Crypto.createHmac('sha256', secret)
//     .update(packet).digest() // make sure to pass the packet in as a Buffer
//
//   console.log(`caluclateFulfil:: hmacsignature=${hmacsignature} | length:${hmacsignature.length}`)
//
//   var based64EncodedFulfil = hmacsignature.digest('base64')
//   // created a SHA256 Hash of the hmac pre-image
//   // var hashSha256 = Crypto.createHash('sha256')
//   //
//   // var based64EncodedFulfil = hashSha256.update(hmacsignature, 'utf8').digest()
//   // return base64url.encode(hmacsignature)
//   // return hmacsignature
//   return base64url.encode(based64EncodedFulfil, 'utf8')
//   // return base64url.encode(hmacsignature, 'utf8')
// }

var l1pGeneratedFulfilment = caluclateFulfil(l1pPacket, l1pSecret)

var l1pProvidedFulfilment = 'fEGpcud1ZXZDCyTIkJjf4P5TEW80R0igI72nMAg9dE8'

console.log(`l1pGeneratedFulfilment=${l1pGeneratedFulfilment}`)

console.log(`l1pProvidedFulfilment=${l1pProvidedFulfilment}`)

console.log(`Do they match? ${l1pGeneratedFulfilment === l1pProvidedFulfilment}`)

const calculateConditionFromFulfil = (fulfilment) => {
  // TODO: The following hashing code should be moved into a re-usable common-shared-service at a later point
  var hashSha256 = Crypto.createHash('sha256')
  var preimage = base64url.decode(fulfilment, 'ascii')
  // var preimage = base64url.decode(fulfilment, 'utf8')
  // var preimage = base64url.decode(fulfilment)
  // if (preimage.length !== 32) {
  //   throw new Error('Interledger preimages must be exactly 32 bytes.')
  // }
  // var decodedBufferFulfilment = new Buffer(decodedFulfilment, 'ascii')
  var calculatedConditionDigest = hashSha256.update(new Buffer(preimage, 'ascii')).digest('base64')
  console.log(`calculatedConditionDigest=${calculatedConditionDigest}`)
  return base64url.fromBase64(calculatedConditionDigest)
}

// NOTE: This logic is based on v1.0 of the Mojaloop Specification as described in section 6.5.1.2
// const validateFulfilCondition = (fulfilment, condition) => {
//   // TODO: The following hashing code should be moved into a re-usable common-shared-service at a later point
//   var calculatedCondition = calculateConditionFromFulfil(fulfilment)
//   return calculatedCondition === condition
// }

var l1pProvidedCondition = 'mEw-mqZdYOnuzv4oOVbd9yCXZ5b6xcfO5lUvfpec1KY'

var l1pGeneratedCondition = calculateConditionFromFulfil(l1pGeneratedFulfilment)

console.log(`l1pGeneratedCondition=${l1pGeneratedCondition}`)

console.log(`l1pProvidedCondition=${l1pProvidedCondition}`)

console.log(`Do they match? ${l1pGeneratedCondition === l1pProvidedCondition}`)

