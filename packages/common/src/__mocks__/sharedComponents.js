import React, { forwardRef, useImperativeHandle } from 'react'

const QuestionRender = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({ submit: jest.fn() }))
  return <div data-mocked="qrc" />
})
QuestionRender.displayName = 'QuestionRender'

const CertificateManager = () => <div />
const Dian = () => <div />
const Tabs = () => <div data-mocker="tabs" />
const DianWidget = () => <div data-mocked="DianWidget" />

export { CertificateManager, Dian, QuestionRender, Tabs, DianWidget }
