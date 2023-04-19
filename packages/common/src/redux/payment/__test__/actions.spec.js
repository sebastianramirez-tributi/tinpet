import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import axios from 'axios'
import message from 'antd/lib/message'

import * as actions from '../actions'
import {
  DECLARATION_SYNC,
  DOCUMENTS_LOADING,
  DOCUMENTS_SUCCESS,
  GET_LITHOGRAPHIC_BEGIN,
  GET_LITHOGRAPHIC_SUCCESS,
  GET_LITHOGRAPHIC_ERROR,
  COUPON_VERIFY,
  COUPON_VERIFY_LOAD,
  COUPON_VERIFY_ERROR,
  PLANS_LOAD,
  PLANS,
  PLANS_ERROR,
  STATUS_TAX_ENGINE,
  PAYMENT_ORDER_INFO,
} from '../../actionTypes'
import { ACTION_TYPES as GENERAL_ACTION_TYPES } from '../../general/actions'
import { captureSentryException } from '../../../sentry'
import { OK, BAD_REQUEST, NOT_FOUND } from '../../../constants/response'
import { FILE_TYPES } from '../../../constants/documents'

jest.mock('../../../sentry')
jest.mock('antd/lib/message')

const middleware = [thunk]
const mockStore = configureMockStore(middleware)
const RealDate = Date.now

describe('payment action creators', () => {
  let store
  beforeAll(() => {
    global.Date.now = jest.fn(() => new Date('2020-07-21T10:20:30Z').getTime())
    global.URL.createObjectURL = jest.fn()
  })
  beforeEach(() => {
    store = mockStore({
      personalInfo: {
        currentFiling: {
          tax_year: 2021,
        },
      },
    })
  })

  afterEach(() => {
    global.URL.createObjectURL.mockReset()
  })

  afterAll(() => {
    global.URL.createObjectURL.mockRestore()
    global.Date.now = RealDate
  })

  describe('Document actions', () => {
    it('Should download properly documents wihtout 160 form', async () => {
      const FORM = '210'
      const ENGINE = 'engine-id'
      const RESPONSE_FIN = new Blob([JSON.stringify({ foo: 'bar' }, null, 2)], {
        type: 'application/pdf',
      })
      const RESPONSE_LIT = new Blob([JSON.stringify({ foo: 'bar' }, null, 2)], {
        type: 'application/pdf',
      })
      const urlSummary = 'http://test.com/summary'
      const urlLithographic = 'http://test.com/lithographic'
      const dataTaxEngine = {
        status: 'valid',
      }
      global.URL.createObjectURL.mockReturnValueOnce(urlSummary)
      global.URL.createObjectURL.mockReturnValueOnce(urlLithographic)
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: STATUS_TAX_ENGINE, data: dataTaxEngine },
        {
          type: DOCUMENTS_SUCCESS,
          payload: {
            actives: undefined,
            summary: urlSummary,
            declaration: urlLithographic,
          },
        },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const endpointFinancialStatus = `${process.env.API_URL}/financial-status/${ENGINE}`
      const endpointLithographic = `${process.env.API_URL}/dian-forms-local-${FORM}/${ENGINE}`
      axios.mockResolvedValueOnce({ data: RESPONSE_FIN, status: OK })
      axios.mockResolvedValueOnce({ data: RESPONSE_LIT, status: OK })
      axios.get.mockReturnValueOnce({ data: dataTaxEngine })
      await store.dispatch(
        actions.downloadDocuments(FORM, ENGINE, FILE_TYPES.LITOGRAFICO)
      )
      expect(axios).toBeCalled()
      // this can be change when the api function will be refactored
      expect(axios).toHaveBeenCalledWith({
        url: endpointFinancialStatus,
        method: 'GET',
        responseType: 'blob',
      })
      expect(axios).toHaveBeenCalledWith({
        url: endpointLithographic,
        method: 'GET',
        responseType: 'blob',
        params: { type: FILE_TYPES.LITOGRAFICO },
      })
      Promise.resolve()
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should get the filing document', async () => {
      const FORM = '210'
      const ENGINE = 'engine-id'
      const RESPONSE = new Blob([JSON.stringify({ foo: 'bar' }, null, 2)], {
        type: 'application/pdf',
      })
      const payload = 'http://test.com/url'
      global.URL.createObjectURL.mockReturnValueOnce(payload)
      const expectedActions = [{ type: DECLARATION_SYNC, payload }]
      axios.mockResolvedValue({ data: RESPONSE, status: OK })
      const url = `${process.env.API_URL}/dian-forms-local-${FORM}/${ENGINE}`
      await store.dispatch(actions.syncFormDeclaration(FORM, ENGINE))
      expect(axios).toBeCalled()
      // this can be change when the api function will be refactored
      expect(axios).toHaveBeenCalledWith({
        url,
        method: 'GET',
        responseType: 'blob',
        params: { type: FILE_TYPES.LITOGRAFICO },
      })
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should handle json in filing document', async () => {
      const FORM = '210'
      const ENGINE = 'engine-id'
      const RESPONSE = new Blob([JSON.stringify({ foo: 'bar' }, null, 2)], {
        type: 'application/json',
      })
      const payload = `pending-${Date.now()}`
      const expectedActions = [{ type: DECLARATION_SYNC, payload }]
      axios.mockResolvedValue({ data: RESPONSE })
      const url = `${process.env.API_URL}/dian-forms-local-${FORM}/${ENGINE}`
      await store.dispatch(actions.syncFormDeclaration(FORM, ENGINE))
      expect(axios).toBeCalled()
      // this can be change when the api function will be refactored
      expect(axios).toHaveBeenCalledWith({
        url,
        method: 'GET',
        responseType: 'blob',
        params: { type: FILE_TYPES.LITOGRAFICO },
      })
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should get file type litografico', async () => {
      const FORM = '210'
      const ENGINE = 'engine-id'
      const RESPONSE = new Blob([JSON.stringify({ foo: 'bar' }, null, 2)], {
        type: 'application/pdf',
      })
      const payload = 'http://test.com/url'
      global.URL.createObjectURL.mockReturnValueOnce(payload)
      const expectedActions = [
        { type: GET_LITHOGRAPHIC_BEGIN },
        { type: GET_LITHOGRAPHIC_SUCCESS },
        { type: DECLARATION_SYNC, payload },
      ]
      const url = `${process.env.API_URL}/dian-forms-local-${FORM}/${ENGINE}`
      axios.mockResolvedValue({ data: RESPONSE, status: OK })
      await store.dispatch(
        actions.getFile(FORM, ENGINE, FILE_TYPES.LITOGRAFICO)
      )
      expect(axios).toBeCalled()
      // this can be change when the api function will be refactored
      expect(axios).toHaveBeenCalledWith({
        url,
        method: 'GET',
        responseType: 'blob',
        params: { type: FILE_TYPES.LITOGRAFICO },
      })
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should failed when the format is not pdf', async () => {
      const FORM = '210'
      const ENGINE = 'engine-id'
      const RESPONSE = new Blob([JSON.stringify({ foo: 'bar' }, null, 2)], {
        type: 'application/json',
      })
      const expectedActions = [
        { type: GET_LITHOGRAPHIC_BEGIN },
        { type: GET_LITHOGRAPHIC_ERROR },
      ]
      const url = `${process.env.API_URL}/dian-forms-local-${FORM}/${ENGINE}`
      axios.mockResolvedValue({ data: RESPONSE })
      await store.dispatch(
        actions.getFile(FORM, ENGINE, FILE_TYPES.LITOGRAFICO)
      )
      expect(axios).toBeCalled()
      // this can be change when the api function will be refactored
      expect(axios).toHaveBeenCalledWith({
        url,
        method: 'GET',
        responseType: 'blob',
        params: { type: FILE_TYPES.LITOGRAFICO },
      })
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should failed when there is an error', async () => {
      const spy = jest.spyOn(message, 'error')
      const FORM = '210'
      const ENGINE = 'engine-id'
      const expectedActions = [
        { type: GET_LITHOGRAPHIC_BEGIN },
        { type: GET_LITHOGRAPHIC_ERROR },
      ]
      const url = `${process.env.API_URL}/dian-forms-local-${FORM}/${ENGINE}`
      axios.mockRejectedValue({ response: { status: 400 } })
      await store.dispatch(
        actions.getFile(FORM, ENGINE, FILE_TYPES.LITOGRAFICO)
      )
      expect(axios).toBeCalled()
      // this can be change when the api function will be refactored
      expect(axios).toHaveBeenCalledWith({
        url,
        method: 'GET',
        responseType: 'blob',
        params: { type: FILE_TYPES.LITOGRAFICO },
      })
      expect(spy).toBeCalled()
      expect(captureSentryException).toBeCalled()
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('Coupon actions', () => {
    it('Should verify coupon properly', async () => {
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: COUPON_VERIFY_LOAD },
        { type: COUPON_VERIFY },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const code = 'test_25'
      const dataResponse = {
        code,
        value: '0.25000000',
        valid_from: '2020-02-13',
        product_plan_discounts: [],
      }
      axios.get.mockResolvedValue({
        response: { status: OK, data: dataResponse },
      })
      await store.dispatch(actions.verifyCoupon(code))
      expect(axios.get).toBeCalled()
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should fail with BAD_REQUEST and put in store the server message', async () => {
      const errorMessage =
        'El cupón de referido es solo válido para tu primera compra'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: COUPON_VERIFY_LOAD },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        { type: COUPON_VERIFY_ERROR, payload: errorMessage },
      ]
      const code = 'referral-code'
      axios.get.mockRejectedValue({
        response: { status: BAD_REQUEST, data: [errorMessage] },
      })
      await store.dispatch(actions.verifyCoupon(code))
      expect(axios.get).toBeCalled()
      expect(captureSentryException).toBeCalled()
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should fail with NOT_FOUND and put in store the message', async () => {
      const errorMessage =
        'Parece que el cupón que trataste de redimir no es válido'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: COUPON_VERIFY_LOAD },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        { type: COUPON_VERIFY_ERROR, payload: errorMessage },
      ]
      const code = 'referral-code'
      axios.get.mockRejectedValue({
        response: { status: NOT_FOUND },
      })
      await store.dispatch(actions.verifyCoupon(code))
      expect(axios.get).toBeCalled()
      expect(captureSentryException).toBeCalled()
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should fail with no response', async () => {
      const spy = jest.spyOn(message, 'error')
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: COUPON_VERIFY_LOAD },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        { type: COUPON_VERIFY_ERROR, payload: null },
      ]
      const code = 'referral-code'
      axios.get.mockRejectedValue({})
      await store.dispatch(actions.verifyCoupon(code))
      expect(axios.get).toBeCalled()
      expect(spy).toBeCalled()
      expect(captureSentryException).toBeCalled()
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('Plans', () => {
    it('Should load plans properly if not changing plan', async () => {
      const PLANS_RESPONSE = [
        {
          id: 'test',
          name: 'Estándar',
          price: '99000.00',
        },
      ]
      const BALANCE = '30000'
      const DISCOUNT_VALUE = 0
      const FROM_PLAN_VALUE = 0
      const FILING_ID = 'test'
      const CHANGING_PLAN = false
      const REFERRAL_REPONSE = {
        referral_balance: BALANCE,
      }
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: PLANS_LOAD },
        {
          type: PLANS,
          payload: {
            couponDetails: null,
            discountValue: DISCOUNT_VALUE,
            fromPlanValue: FROM_PLAN_VALUE,
            orderCoupon: DISCOUNT_VALUE,
            plans: PLANS_RESPONSE,
            referralBalance: BALANCE,
            taxYear: 2021,
            paidValue: 0,
            selectedPlanId: null,
          },
        },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      // Plans
      axios.get.mockResolvedValueOnce({ data: PLANS_RESPONSE })

      // Referrals
      axios.get.mockResolvedValueOnce({ data: REFERRAL_REPONSE })
      await store.dispatch(
        actions.getPlans(
          DISCOUNT_VALUE,
          FROM_PLAN_VALUE,
          FILING_ID,
          CHANGING_PLAN
        )
      )
      expect(axios.get).toBeCalled()
      expect(axios.get).toHaveBeenCalledWith('product-plans')
      expect(axios.get).toHaveBeenCalledWith('users/referrals/')
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should load plans properly if changing plan', async () => {
      const PLANS_RESPONSE = [
        {
          id: 'test',
          name: 'Estándar',
          price: '99000.00',
        },
      ]
      const DISCOUNT_VALUE = undefined
      const FROM_PLAN_VALUE = undefined
      const BALANCE = '30000'
      const FILING_ID = 'test'
      const CHANGING_PLAN = true
      const PAYMENT_ORDER_RESPONSE = {
        discount_by_referrals: BALANCE,
      }
      const data = {
        filling: FILING_ID,
      }
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: PLANS_LOAD },
        {
          type: PLANS,
          payload: {
            discountValue: 0,
            fromPlanValue: 0,
            orderCoupon: 0,
            plans: PLANS_RESPONSE,
            referralBalance: BALANCE,
            couponDetails: undefined,
            taxYear: 2021,
            paidValue: 0,
            selectedPlanId: null,
          },
        },
        {
          type: PAYMENT_ORDER_INFO,
          payload: {
            discount_by_referrals: BALANCE,
          },
        },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      // Plans
      axios.get.mockResolvedValueOnce({ data: PLANS_RESPONSE })

      // payment_order
      axios.post.mockResolvedValueOnce({ data: PAYMENT_ORDER_RESPONSE })
      await store.dispatch(
        actions.getPlans(
          DISCOUNT_VALUE,
          FROM_PLAN_VALUE,
          FILING_ID,
          CHANGING_PLAN
        )
      )
      expect(axios.get).toBeCalled()
      expect(axios.post).toBeCalled()
      expect(axios.get).toHaveBeenCalledWith('product-plans')
      expect(axios.post).toHaveBeenCalledWith('payment-orders', data)
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should capture error if one of the responses failed', async () => {
      const PLANS_RESPONSE = [
        {
          id: 'test',
          name: 'Estándar',
          price: '99000.00',
        },
      ]
      const DISCOUNT_VALUE = undefined
      const FROM_PLAN_VALUE = undefined
      const FILING_ID = 'test'
      const CHANGING_PLAN = true
      const data = {
        filling: FILING_ID,
      }
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: PLANS_LOAD },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        {
          type: PLANS_ERROR,
          payload: 'Hubo un error cargando los planes',
        },
      ]
      // Plans
      axios.get.mockResolvedValueOnce({ data: PLANS_RESPONSE })

      // payment_order
      axios.post.mockRejectedValueOnce({})
      await store.dispatch(
        actions.getPlans(
          DISCOUNT_VALUE,
          FROM_PLAN_VALUE,
          FILING_ID,
          CHANGING_PLAN
        )
      )
      expect(axios.get).toBeCalled()
      expect(axios.post).toBeCalled()
      expect(axios.get).toHaveBeenCalledWith('product-plans')
      expect(axios.post).toHaveBeenCalledWith('payment-orders', data)
      expect(captureSentryException).toBeCalled()
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should handle `requestChangesOnFiling` successfully', async () => {
    const FILING_ID = 'testing-filing-id'
    const TAX_ENGINE_ID = 'testing-tax-engine-id'
    const TAX_ENGINE_RESPONSE = {
      id: TAX_ENGINE_ID,
      reviewRequested: true,
    }

    const expectedActions = [
      {
        data: TAX_ENGINE_RESPONSE,
        type: STATUS_TAX_ENGINE,
      },
    ]

    axios.post.mockResolvedValueOnce({})
    axios.get.mockResolvedValueOnce({ data: TAX_ENGINE_RESPONSE })
    await store.dispatch(
      actions.requestChangesOnFiling(FILING_ID, TAX_ENGINE_ID)
    )

    expect(axios.post).toHaveBeenCalledWith(
      `filings/${FILING_ID}/send-accountant-request`
    )
    expect(axios.get).toHaveBeenCalledWith(`tax-engines/${TAX_ENGINE_ID}`)
    expect(store.getActions()).toEqual(expectedActions)
  })
})
