'use strict'

const Hapi = require('hapi')
const ErrorHandling = require('@mojaloop/central-services-error-handling')
const P = require('bluebird')
const Migrator = require('../lib/migrator')
const Db = require('../db')
const Plugins = require('./plugins')
const Config = require('../lib/config')
const Sidecar = require('../lib/sidecar')
const RequestLogger = require('../lib/request-logger')
const Uuid = require('uuid4')
const UrlParser = require('../lib/urlparser')
const Logger = require('@mojaloop/central-services-shared').Logger
// const Participant = require('../domain/participant')
const Boom = require('boom')
const RegisterHandlers = require('../handlers/register')

const migrate = (runMigrations) => {
  return runMigrations ? Migrator.migrate() : P.resolve()
}

const connectDatabase = async () => await Db.connect(Config.DATABASE_URI)

/**
 * @function createServer
 *
 * @description Create HTTP Server
 *
 * @param {number} port Port to register the Server against
 * @param modules list of Modules to be registered
 * @returns {Promise<Server>} Returns the Server object
 */
const createServer = (port, modules) => {
  return (async () => {
    const server = await new Hapi.Server({
      port,
      routes: {
        validate: {
          options: ErrorHandling.validateRoutes(),
          failAction: async (request, h, err) => {
            throw Boom.boomify(err)
          }
        }
      }
    })
    server.ext('onRequest', function (request, h) {
      const transferId = UrlParser.idFromTransferUri(`${Config.HOSTNAME}${request.url.path}`)
      request.headers.traceid = request.headers.traceid || transferId || Uuid()
      RequestLogger.logRequest(request)
      return h.continue
    })
    server.ext('onPreResponse', function (request, h) {
      RequestLogger.logResponse(request)
      return h.continue
    })
    await Plugins.registerPlugins(server)
    await server.register(modules)
    await server.start()
    Logger.info('Server running at: ', server.info.uri)
    return server
  })()
}

/**
 * @function createHandlers
 *
 * @description Create method to register specific Handlers specified by the Module list as part of the Setup process
 *
 * @typedef handler
 * @type {Object}
 * @property {string} type The type of Handler to be registered
 * @property {boolean} enabled True|False to indicate if the Handler should be registered
 * @property {string[]} [fspList] List of FSPs to be registered
 *
 * @param {handler[]} handlers List of Handlers to be registered
 * @returns {Promise<boolean>} Returns true if Handlers were registered
 */
const createHandlers = async (handlers) => {
  let handlerIndex
  let server = {
    connection: {},
    register: {},
    ext: {},
    start: new Date(),
    info: {
    },
    handlers: handlers
  }

  for (handlerIndex in handlers) {
    var handler = handlers[handlerIndex]
    if (handler.enabled) {
      Logger.info(`Handler Setup - Registering ${JSON.stringify(handler)}!`)
      switch (handler.type) {
        case 'prepare':
          await RegisterHandlers.transfers.registerPrepareHandlers(handler.fspList)
          break
        case 'position':
          await RegisterHandlers.positions.registerPositionHandlers(handler.fspList)
          break
        case 'transfer':
          await RegisterHandlers.transfers.registerTransferHandler()
          break
        case 'fulfil':
          await RegisterHandlers.transfers.registerFulfillHandler()
          break
        case 'reject':
          await RegisterHandlers.transfers.registerRejectHandler()
          break
        default:
          // Logger.warn(`Handler Setup - ${JSON.stringify(handler)} is not a valid handler to register!`)
          var error = `Handler Setup - ${JSON.stringify(handler)} is not a valid handler to register!`
          Logger.error(error)
          throw new Error(error)
      }
    }
  }

  return server
}

// Migrator.migrate is called before connecting to the database to ensure all new tables are loaded properly.
const initialize = async function ({service, port, modules = [], runMigrations = false, runHandlers = true}) {
  await migrate(runMigrations)
  await connectDatabase()
  await Sidecar.connect(service)
  let server
  if (service === 'api') {
    server = await createServer(port, modules)
    if (runHandlers) {
      await RegisterHandlers.registerAllHandlers()
    }
  } else if (service === 'handlers') {
    server = await createHandlers(modules)
  }
  return server
}

module.exports = {
  initialize,
  createServer,
  createHandlers
}
