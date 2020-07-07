jest.unmock('./handler')
import { handleRequest } from './handler'

test('handler should handle', async () => {
  const result = await handleRequest({ method: 'TEST' } as any)

  expect(result).toBeInstanceOf(Response)
  expect(await result.text()).toBe('request method: Test TEST')
})
