import actionRetry from '../actionRetry'
import asyncTimeout from '../asyncTimeout'
jest.mock('../asyncTimeout')

const actionFn = jest.fn()
describe('actionRetry', () => {
  it('should run properly the function with params', async () => {
    const EXPECTED = {}
    actionFn.mockResolvedValueOnce(EXPECTED)
    await expect(actionRetry(actionFn)).resolves.toEqual(EXPECTED)
  })

  it('should throw and error with status is not correct', async () => {
    const EXPECTED = { response: { status: 400 } }
    actionFn.mockRejectedValueOnce(EXPECTED)
    await expect(actionRetry(actionFn)).rejects.toEqual(EXPECTED)
  })

  it('should run timeout if the error allows retries', async () => {
    const EXPECTED = { response: { status: 500 } }
    const NEW_EXPECT = {}
    actionFn.mockRejectedValueOnce(EXPECTED)
    asyncTimeout.mockResolvedValueOnce(NEW_EXPECT)
    const result = await actionRetry(actionFn)
    expect(result).toEqual(NEW_EXPECT)
    const [actualFn] = asyncTimeout.mock.calls[0]
    actionFn.mockResolvedValueOnce(NEW_EXPECT)
    const mockResolve = jest.fn()
    await actualFn(mockResolve)
    expect(mockResolve).toBeCalledWith(NEW_EXPECT)
  })

  it('should throw an error if retries are zero', async () => {
    await expect(actionRetry(actionFn, null, 0)).rejects.toEqual(
      new Error(`Max retries exceded in the action ${actionFn.name}`)
    )
  })
})
