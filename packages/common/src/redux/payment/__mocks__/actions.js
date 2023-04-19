import { PAYMENT_STATUS } from '../../../constants/payment'

export const PaymentCancel = jest.fn().mockReturnValue({
  status: PAYMENT_STATUS.DECLINED,
})

export const PaymentPending = jest.fn()
export const getUserReferals = jest.fn()
