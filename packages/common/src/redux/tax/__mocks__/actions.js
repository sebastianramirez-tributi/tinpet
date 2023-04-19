import { PAYMENT_STATUS } from '../../../constants/payment'

export const createPaymentOrder = jest.fn().mockReturnValue({
  status: PAYMENT_STATUS.CREATED,
})
export const getStatus_payment = jest.fn()
export const AckOrder = jest.fn()
export const taxReceiveInfo = jest.fn()
export const RedeemCoupon = jest.fn()
