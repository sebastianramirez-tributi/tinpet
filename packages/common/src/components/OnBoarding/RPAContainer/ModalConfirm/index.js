import React from 'react'
import PropTypes from 'prop-types'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button } from '@tributi-co/tributi-components'
import { useRootContext } from '../../../../context'
import {
  List,
  Link,
  ModalConfirmHeader,
  ButtonContainer,
  Title,
  StyleModalConfirm,
} from './style'

const noop = () => {}

/**
 * Modal to confirm when answer questions DIAN manualaly
 * @param {Bool} visible : Show o hidden the component
 * @param {Funciton} handleOk  : handle function to "Responder preguntas" button
 * @param {Funciton} handleCancel  : handle function to go back
 */
const ModalConfirm = ({ visible, handleOk, handleCancel }) => {
  const context = useRootContext()
  const { isAccountantApp } = context
  return (
    <StyleModalConfirm
      destroyOnClose
      closable={false}
      visible={visible}
      footer={null}
    >
      <ModalConfirmHeader>
        <ExclamationCircleOutlined />
        <Title>{translate('filings.onboarding.modalConfirm.title')}</Title>
      </ModalConfirmHeader>
      <div>
        <p>{translate('filings.onboarding.modalConfirm.text.first')}</p>
        <List>
          <li>
            {translate('filings.onboarding.modalConfirm.unordereList.item1')}
          </li>
          <li>
            {translate('filings.onboarding.modalConfirm.unordereList.item2')}
          </li>
          {isAccountantApp && (
            <li>
              {translate('filings.onboarding.modalConfirm.unordereList.item3')}
            </li>
          )}
        </List>
        <p>{translate('filings.onboarding.modalConfirm.text.second')}</p>
        <p>
          <br />
          {translate('filings.onboarding.modalConfirm.text.third')}
          <Link
            target="_blank"
            href="https://www.tributi.com/ayuda/recuperar-contrasena-de-muisca"
            rel="noopener noreferrer"
          >
            &nbsp;
            {translate('filings.onboarding.modalConfirm.link.recoverPassword')}
          </Link>
          &nbsp;
          {translate('filings.onboarding.modalConfirm.text.thirdComplement')}
          <br />
        </p>
        <p>
          <br />
          {translate('filings.onboarding.modalConfirm.button.fourth')}
        </p>
        <ButtonContainer>
          <Button onClick={handleCancel}>
            {translate('filings.onboarding.modalConfirm.button.back')}
          </Button>
          <Button variant="outlined" onClick={handleOk}>
            {translate(
              'filings.onboarding.modalConfirm.button.answerQuestions'
            )}
          </Button>
        </ButtonContainer>
      </div>
    </StyleModalConfirm>
  )
}

ModalConfirm.propTypes = {
  visible: PropTypes.bool.isRequired,
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func,
}

ModalConfirm.defaultProps = {
  visible: false,
  handleOk: noop,
  handleCancel: noop,
}

export default ModalConfirm
