export const refCertificates = {
  doc: jest.fn().mockReturnValue({
    get: jest.fn(),
    set: jest.fn(),
    onSnapshot: jest.fn(),
  }),
}
