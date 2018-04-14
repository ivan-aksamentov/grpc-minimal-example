import _ from 'lodash'

import grpc from 'grpc'


const PROTO_PATH = __dirname + '/../protos/grpc_minimal.proto'
const SERVICE_NAME = 'GRPCMinimal'
const PACKAGE_NAME = 'grpc_minimal'
const SERVER_HOST = 'localhost'
const SERVER_PORT = 12345


/**
 * Implements gRPC server and showcases 4 available types of handlers
 */
class Server {
  constructor({ proto_path, service_name, package_name, host, port }) {
    const proto = grpc.load(proto_path)[package_name][service_name]

    this._server = new grpc.Server()
    this._server.addService(proto.service, {
      one_to_one: this.one_to_one,
      one_to_many: this.one_to_many,
      many_to_one: this.many_to_one,
      many_to_many: this.many_to_many,
    })

    this._server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure())
    console.info(`Listening on port: ${port}`)
    this._server.start()
  }

  /**
   * Showcases one-request-to-one-response unary handler
   */
  one_to_one = (call, callback) => {
    const name = call.request.name
    const response = { message: `Hello, ${name}` }
    const error = null
    callback(error, response)
  }

  /**
   * Showcases one-request-to-many-responses "server streaming" handler
   */
  one_to_many = (call) => {
    const name = call.request.name
    const n = call.request.n
    _.times(n, (i) => {
      const response = { message: `Hello, ${name} #${i}` }
      call.write(response)
    })
    call.end()
  }

  /**
   * Showcases many-requests-to-one-response "client streaming" handler
   */
  many_to_one = (call, callback) => {
    const names = []
    call.on('data', ({ name }) => {
      names.push(name)
    })
    call.on('end', () => {
      const response = { message: 'Hello, ' + names.join(', ') }
      callback(null, response)
    })
  }

  /**
   * Showcases many-requests-to-many-responses "bidirectional streaming" call
   */
  many_to_many = (call) => {
    call.on('data', ({ name, n }) => {
      if(name.length > n) {
        call.write({ message: `Hello, ${name}` })
      }
    })
    call.on('end', () => {
      call.end()
    })
  }
}

const server = new Server({
  proto_path: PROTO_PATH,
  service_name: SERVICE_NAME,
  package_name: PACKAGE_NAME,
  host: SERVER_HOST,
  port: SERVER_PORT,
})
