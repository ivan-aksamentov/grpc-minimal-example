import grpc from 'grpc'


const PROTO_PATH = __dirname + '/../protos/grpc_minimal.proto'
const SERVICE_NAME = 'GRPCMinimal'
const PACKAGE_NAME = 'grpc_minimal'
const SERVER_HOST = 'localhost'
const SERVER_PORT = 12345

const NAMES = [
  'Alice',
  'Bob',
  'Carol',
  'David',
  'Eve',
  'Faythe',
  'Grace',
]


const handleError = (error) => {
  console.error(error)
  process.exit(-1)
}


/**
 * Implements gRPC client and showcases 4 available types of calls
 */
class Client {
  constructor({ proto_path, service_name, package_name, host, port }) {
    const proto = grpc.load(proto_path)[package_name][service_name]
    this._client = new proto(`${host}:${port}`, grpc.credentials.createInsecure())
  }

  /**
   * Showcases one-request-to-one-response "unary" call
   */
  one_to_one = (request) => {
    return new Promise((resolve, reject) => {
      this._client.one_to_one(request, (error, response) => {
        if(error) {
          return reject(error)
        }
        resolve(response)
      })
    })
  }

  /**
   * Showcases one-request-to-many-responses "server streaming" call
   */
  one_to_many = (request) => {
    return new Promise((resolve, reject) => {
      const responses = []
      const stream = this._client.one_to_many(request)
      stream.on('error', reject)
      stream.on('data', (response) => responses.push(response))
      stream.on('end', () => resolve(responses))
    })
  }

  /**
   * Showcases many-requests-to-one-response "client streaming" call
   */
  many_to_one = (requests) => {
    return new Promise((resolve, reject) => {
      // Open a stream and set response handler
      const stream = this._client.many_to_one((error, response) => {
        if(error) {
          return reject(error)
        }
        return resolve(response)
      })

      // Write requests into the stream, one at a time
      requests.map((request) => stream.write(request), (error) => {
        return reject(error)
      })

      // Close the stream
      stream.end()
    })
  }

  /**
   * Showcases many-requests-to-many-responses "bidirectional streaming" call
   */
  many_to_many = (requests) => {
    return new Promise((resolve, reject) => {
      const responses = []

      // Open a stream and set handlers
      const stream = this._client.many_to_many()
      stream.on('error', reject)
      stream.on('data', (response) => responses.push(response))
      stream.on('end', () => resolve(responses))

      // Write requests into the client side of the stream, one at a time
      requests.map((request) => stream.write(request), (error) => {
        return reject(error)
      })

      // Close the stream on client side
      stream.end()
    })
  }
}

const client = new Client({
  proto_path: PROTO_PATH,
  service_name: SERVICE_NAME,
  package_name: PACKAGE_NAME,
  host: SERVER_HOST,
  port: SERVER_PORT,
})

// Unary
client.one_to_one({ name: 'Alice' })
  .then((response) => {
    console.info('one_to_one   :', response.message)
  })
  .catch(handleError)

// Server streaming
client.one_to_many({ name: 'Alice', n: 3 })
  .then((responses) => {
    console.info('one_to_many  :',
      responses.map((response) => (response.message)),
    )
  })
  .catch(handleError)


const requests = NAMES.map((name) => ({ name }))

// Client streaming
client.many_to_one(requests)
  .then((response) => {
    console.info('many_to_one  :', response)
  })

// Bidirectional streaming
client.many_to_many(requests)
  .then((response) => {
    console.info('many_to_many :', response)
  })
