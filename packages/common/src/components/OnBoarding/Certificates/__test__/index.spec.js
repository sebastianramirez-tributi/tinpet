import React from 'react'
import { fireEvent } from '@testing-library/react'
import {
  mockWithProviders,
  rootContextProvider,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import { CERTIFICATE_TYPES } from '../../../../constants/certificates.js'
import Certificates from '../index'
jest.mock('../../Upload')

const setup = (props = {}) => {
  const defaultProps = {
    codePath: '9.9.9',
    fillingId: 'filing-id',
    handleClickDontHave: jest.fn(),
    iconsPath: 'icons/path',
    instance: {
      instance_id: 'instance-id',
      code: '9.9.9',
      value: 'Instance value',
      group_code: '9.9.9',
    },
    loading: false,
    personalInfoTab: '1.',
    removeCertificates: jest.fn(),
    removeInstance: jest.fn(),
    notifyLoading: jest.fn(),
    setRefListGroup: jest.fn(),
    showBtnRemove: false,
    taxobject: 'tax-object-uuid',
    updateCertificatePassword: jest.fn(),
    syncInstanceCertificates: jest.fn(),
    loadSummary: jest.fn(),
    markCertificateAsCancel: jest.fn(),
    ...props,
  }
  const wrapper = mockWithProviders(<Certificates {...defaultProps} />, [
    themeProvider(),
    rootContextProvider(),
  ])
  return { wrapper, props: defaultProps }
}

describe('<Certificates /> spec', () => {
  it('should render default title', () => {
    const { wrapper, props } = setup()
    const {
      instance: { value },
    } = props
    expect(wrapper.getByText(value)).toBeTruthy()
    expect(wrapper.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render certificate with delete button and call removeInstance when is clicked', () => {
    const { wrapper, props } = setup({ showBtnRemove: true })
    const { removeInstance } = props
    const deleteButton = wrapper.getByRole('button')
    expect(deleteButton).toBeTruthy()
    fireEvent.click(deleteButton)
    expect(removeInstance).toBeCalled()
  })

  it('should disable button when loading prop is true', () => {
    const { wrapper } = setup({ showBtnRemove: true, loading: true })
    const deleteButton = wrapper.getByRole('button')
    expect(deleteButton.disabled).toBeTruthy()
  })

  it('should not render delete button for certificate with instance code starting for personal info tab code', () => {
    const PERSONAL_INFO_TAB = '100.'
    const { wrapper } = setup({
      personalInfoTab: PERSONAL_INFO_TAB,
      instance: {
        instance_id: 'custom-instance-id',
        code: PERSONAL_INFO_TAB + '1.1',
        value: 'Personal Info',
        group_code: PERSONAL_INFO_TAB + '1.1',
        certificates: [],
      },
    })
    const deleteIcon = wrapper.queryByRole('button')
    expect(deleteIcon).not.toBeInTheDocument()
  })

  it('should render pseudo certificate copy when `isAccountantAssisted` is true and `is_pseudo_certificate` is true', () => {
    const { wrapper } = setup({
      isAccountantAssisted: true,
      instance: {
        instance_id: 'instance-id',
        code: '9.9.9',
        value: 'Instance value',
        group_code: '9.9.9',
        certificates: [
          {
            is_pseudo_certificate: true,
            values: {},
          },
        ],
      },
    })
    expect(
      wrapper.getByText(
        'Este certificado contiene campos que deben ser diligenciados con el cliente.'
      )
    ).toBeInTheDocument()
  })
})

it('should show REQUIRED_LEVEL_MSG when required_level is zero', () => {
  const { wrapper } = setup({
    instance: {
      instance_id: 'instance-id',
      code: '9.9.9',
      value: 'Instance value',
      group_code: '9.9.9',
      certificates: [
        {
          values: {},
          required_level: 0,
          text: 'Certificate example 1',
        },
        {
          values: {},
          required_level: 1,
          text: 'Certificate example 2',
        },
      ],
    },
  })
  expect(
    wrapper.queryByText(
      '* Esta información es opcional. Sin embargo, incluirla podría ayudarte.'
    )
  ).toBeInTheDocument()
})

it('should not show REQUIRED_LEVEL_MSG when required_level is zero and certificate_kind is `tax_report`', () => {
  const { wrapper } = setup({
    instance: {
      instance_id: 'instance-id',
      code: '9.9.9',
      value: 'Instance value',
      group_code: '9.9.9',
      certificates: [
        {
          values: {},
          required_level: 0,
          text: 'Certificate example 1',
          certificate_kind: CERTIFICATE_TYPES.TAX_REPORT,
        },
        {
          values: {},
          required_level: 1,
          text: 'Certificate example 2',
        },
      ],
    },
  })
  expect(
    wrapper.queryByText(
      '* Esta información es opcional. Sin embargo, incluirla podría ayudarte.'
    )
  ).not.toBeInTheDocument()
})

it('should show ¿Cómo conseguirlo? when there is certificate_url', () => {
  const CERT_URL = 'https://example.com/certificate'
  const { wrapper } = setup({
    instance: {
      instance_id: 'instance-id',
      code: '9.9.9',
      value: 'Instance value',
      group_code: '9.9.9',
      certificates: [
        {
          values: {
            certificate_url: CERT_URL,
          },
          required_level: 0,
          text: 'Certificate example 1',
        },
        {
          values: {},
          required_level: 1,
          text: 'Certificate example 2',
        },
      ],
    },
  })
  const link = wrapper.getByRole('link')
  expect(link).toBeInTheDocument()
  expect(link.href).toBe(CERT_URL)
})
