/** Used in jest.config.js */
import 'regenerator-runtime/runtime'
import '@testing-library/jest-dom/extend-expect'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import dotenv from 'dotenv'

dotenv.config({ path: './config/environments/.env.dev' })

process.env.IS_PLAN_PRO_ENABLED = true
process.env.EARLY_ADOPTER_SEASON = true

configure({ adapter: new Adapter() })
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
