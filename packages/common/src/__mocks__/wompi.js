export const mockOpen = jest.fn()
const mock = jest.fn().mockImplementation(() => {
  return { open: mockOpen }
})

export default mock
