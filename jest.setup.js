const makeServiceWorkerEnv = jest.requireActual('service-worker-mock')
// const makeFetchMock = jest.requireActual('service-worker-mock/fetch');

// import makeServiceWorkerEnv from 'service-worker-mock'

// makeServiceWorkerEnv()

Object.assign(global, makeServiceWorkerEnv())

// Object.assign(
//   global,
//   makeServiceWorkerEnv(),
//   makeFetchMock(),
//   // If you're using sinon ur similar you'd probably use below instead of makeFetchMock
//   // fetch: sinon.stub().returns(Promise.resolve())
// )
// jest.resetModules()

const { Response, Request } = jest.requireActual('node-fetch')

global.Response = Response
global.Request = Request
