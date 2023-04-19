import React from 'react'
import { formatPrice } from '../../../helpers/collections'
import FormattedDate from '../../../components/FormattedDate'

const HUMANIZED_PAYMENT_METHOD = {
  ack_manual: 'Pago realizado desde la VA',
  ack_wompi: 'Pago realizado por Wompi',
  ack_payu: 'Pago realizado por PayU',
  ack_onsite: 'Pago realizado por SSO',
  PSE: 'Pago realizado por PSE',
  BANCOLOMBIA_TRANSFER: 'Pago realizado por transferencia bancolombia',
  BANCOLOMBIA_COLLECT: 'Pago realizado por corresponsal bancario',
  CARD: 'Pago realizado por tarjeta',
  NEQUI: 'Pago realizado por nequi',
}

const renderPaymentMethod = (value) =>
  (HUMANIZED_PAYMENT_METHOD[value] && HUMANIZED_PAYMENT_METHOD[value]) || value

const renderDate = (value) => <FormattedDate date={value} />

export default [
  {
    title: 'Plan',
    key: 'description',
    dataIndex: 'description',
    sorter: (a, b) => a.description.length - b.description.length,
  },
  {
    title: 'Estado pago',
    key: 'status',
    dataIndex: 'status',
    sorter: (a, b) => a.status.length - b.status.length,
  },
  {
    title: 'Fecha ultima act',
    key: 'updated_at',
    dataIndex: 'updated_at',
    render: renderDate,
    sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
  },
  {
    title: 'Medio de pago',
    key: 'payment_method',
    dataIndex: 'payment_method',
    render: renderPaymentMethod,
    sorter: (a, b) => a.payment_method.length - b.payment_method.length,
  },
  {
    title: 'Cupón',
    key: 'coupon_code',
    dataIndex: 'coupon_code',
    sorter: (a, b) => a.coupon_code.length - b.coupon_code.length,
  },
  {
    title: '% descuento cupón',
    key: 'coupon_percent',
    dataIndex: 'coupon_percent',
    sorter: (a, b) => a.coupon_percent.length - b.coupon_percent.length,
  },
  {
    title: 'Créditos referidos',
    key: 'discount_by_referrals',
    dataIndex: 'discount_by_referrals',
    render: (value) => (value !== null ? `$${value}` : '$0'),
    sorter: (a, b) =>
      a.discount_by_referrals.length - b.discount_by_referrals.length,
  },
  {
    title: 'Valor de la orden',
    key: 'amount',
    dataIndex: 'amount',
    render: (value) => `$${formatPrice(value)}`,
    sorter: (a, b) => a.amount.length - b.amount.length,
  },
]
