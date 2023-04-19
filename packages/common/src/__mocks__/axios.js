// This implementation is due to jest does not mock the interceptors
// And popular axios-mocking libraries neither do
// https://github.com/knee-cola/jest-mock-axios/issues/5#issuecomment-473356045

import axios from 'axios'

const mockAxios = jest.genMockFromModule('axios')

mockAxios.interceptors = mockAxios.interceptors || {}
mockAxios.interceptors.response = mockAxios.interceptors.response || {}
mockAxios.interceptors.response.use = jest.fn()
mockAxios.create = () => {
  return mockAxios
}

export default mockAxios
