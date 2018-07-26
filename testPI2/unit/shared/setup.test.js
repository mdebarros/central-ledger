'use strict'

const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const Hapi = require('hapi')
const P = require('bluebird')
const Migrator = require('../../../src/lib/migrator')
const Db = require('../../../src/db')
const Config = require('../../../src/lib/config')
// const Participant = require('../../../src/domain/participant')
const Plugins = require('../../../src/shared/plugins')
const RequestLogger = require('../../../src/lib/request-logger')
const UrlParser = require('../../../src/lib/urlparser')
const Sidecar = require('../../../src/lib/sidecar')
const Proxyquire = require('proxyquire')
const RegisterHandlers = require('../../../src/handlers/register')

Test('setup', setupTest => {
  let sandbox
  let uuidStub
  let oldHostName
  let oldDatabaseUri
  let hostName = 'http://test.com'
  let databaseUri = 'some-database-uri'
  let Setup

  setupTest.beforeEach(test => {
    sandbox = Sinon.sandbox.create()
    sandbox.stub(Hapi, 'Server')
    sandbox.stub(Plugins, 'registerPlugins')
    sandbox.stub(Migrator)
    // sandbox.stub(Participant)
    sandbox.stub(UrlParser, 'idFromTransferUri')
    sandbox.stub(RequestLogger, 'logRequest')
    sandbox.stub(RequestLogger, 'logResponse')

    Sidecar.connect = sandbox.stub()
    Db.connect = sandbox.stub()
    Db.disconnect = sandbox.stub()
    uuidStub = sandbox.stub()
    RegisterHandlers.registerAllHandlers = sandbox.stub().returns(P.resolve())
    RegisterHandlers.transfers.registerPrepareHandlers = sandbox.stub().returns(P.resolve())
    RegisterHandlers.positions.registerPositionHandlers = sandbox.stub().returns(P.resolve())
    RegisterHandlers.transfers.registerTransferHandler = sandbox.stub().returns(P.resolve())
    RegisterHandlers.transfers.registerFulfillHandler = sandbox.stub().returns(P.resolve())
    RegisterHandlers.transfers.registerRejectHandler = sandbox.stub().returns(P.resolve())

    Setup = Proxyquire('../../../src/shared/setup', {
      'uuid4': uuidStub
    })

    oldHostName = Config.HOSTNAME
    oldDatabaseUri = Config.DATABASE_URI
    Config.DATABASE_URI = databaseUri
    Config.HOSTNAME = hostName

    test.end()
  })

  setupTest.afterEach(test => {
    sandbox.restore()
    Config.HOSTNAME = oldHostName
    Config.DATABASE_URI = oldDatabaseUri
    test.end()
  })

  const createServer = () => {
    const server = {
      connection: sandbox.stub(),
      register: sandbox.stub(),
      ext: sandbox.stub(),
      start: sandbox.stub(),
      info: {
        uri: sandbox.stub()
      }
    }
    Hapi.Server.returns(server)
    return server
  }

  setupTest.test('initialize should', initializeTest => {
    const setupPromises = ({service}) => {
      Migrator.migrate.returns(P.resolve())
      Db.connect.returns(P.resolve())
      Sidecar.connect.returns(P.resolve())
      const server = createServer()
      if (service === 'api') {

        // Participant.createLedgerParticipant().returns(P.resolve())
      }
      return server
    }

    initializeTest.test('connect to sidecar', test => {
      const server = setupPromises({})

      const service = 'api'
      Setup.initialize({ service }).then(s => {
        test.ok(Db.connect.calledWith(databaseUri))
        test.ok(Sidecar.connect.calledWith(service))
        test.notOk(Migrator.migrate.called)
        test.equal(s, server)
        test.end()
      })
    })

    initializeTest.test('connect to db and return hapi server', test => {
      const server = setupPromises({})

      const service = 'api'
      Setup.initialize({ service }).then(s => {
        test.ok(Db.connect.calledWith(databaseUri))
        test.notOk(Migrator.migrate.called)
        test.equal(s, server)
        test.end()
      })
    })

    initializeTest.test('run migrations if runMigrations flag enabled', test => {
      setupPromises({})

      Setup.initialize({ runMigrations: true }).then(() => {
        test.ok(Db.connect.called)
        test.ok(Migrator.migrate.called)
        test.end()
      })
    })

    initializeTest.test('ignore handler registrations if runHandlers flag enabled', test => {
      setupPromises({})

      Setup.initialize({ service: 'api', runHandlers: true }).then(() => {
        test.ok(RegisterHandlers.registerAllHandlers.called)
        test.end()
      })
    })

    initializeTest.test('ignore handler registrations if runHandlers flag default', test => {
      setupPromises({})

      Setup.initialize({ service: 'api' }).then(() => {
        test.ok(RegisterHandlers.registerAllHandlers.called)
        test.end()
      })
    })

    initializeTest.test('ignore handler registrations if runHandlers flag disabled', test => {
      setupPromises({})

      Setup.initialize({ runHandlers: false }).then(() => {
        test.ok(RegisterHandlers.registerAllHandlers.called === false)
        test.end()
      })
    })

    initializeTest.test('call createHandlers with all handler types to register', test => {
      setupPromises({})

      var prepareHandler = {
        type: 'prepare',
        enabled: true,
        fspList: ['dfsp1', 'dfsp2']
      }

      var positionHandler = {
        type: 'position',
        enabled: true,
        fspList: ['dfsp1', 'dfsp2']
      }

      var transferHandler = {
        type: 'transfer',
        enabled: true
      }

      var fulfilHandler = {
        type: 'fulfil',
        enabled: true
      }

      var rejectHandler = {
        type: 'reject',
        enabled: true
      }

      var modulesList = [
        prepareHandler,
        positionHandler,
        transferHandler,
        fulfilHandler,
        rejectHandler
      ]

      Setup.initialize({ service: 'handlers', modules: modulesList }).then((s) => {
        test.ok(RegisterHandlers.transfers.registerPrepareHandlers.called)
        test.ok(RegisterHandlers.positions.registerPositionHandlers.called)
        test.ok(RegisterHandlers.transfers.registerTransferHandler.called)
        test.ok(RegisterHandlers.transfers.registerFulfillHandler.called)
        test.ok(RegisterHandlers.transfers.registerRejectHandler.called)
        test.ok(s.start instanceof Date)
        test.same(s.handlers, modulesList)
        test.end()
      })
    })

    initializeTest.test('call createHandlers with an unknown handler type to register', test => {
      setupPromises({})

      var prepareHandler = {
        type: 'prepare',
        enabled: true,
        fspList: ['dfsp1', 'dfsp2']
      }

      var unknownHandler = {
        type: 'unknown',
        enabled: true
      }

      var modulesList = [
        prepareHandler,
        unknownHandler
      ]

      Setup.initialize({ service: 'handlers', modules: modulesList }).then((s) => {
        test.fail()
        test.end()
      }).catch((err) => {
        test.ok(RegisterHandlers.transfers.registerPrepareHandlers.called)
        test.ok(err.message === `Handler Setup - {"type":"${unknownHandler.type}","enabled":${unknownHandler.enabled}} is not a valid handler to register!`)
        test.end()
      })
    })

    initializeTest.end()
  })

  setupTest.end()
})
