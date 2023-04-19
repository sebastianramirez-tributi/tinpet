import React, { Fragment, memo, useCallback } from 'react'
import { Tooltip } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import {
  BodyContainer,
  CopyClipBoardBtn,
  Description,
  Image,
  LinkContainer,
  LinkTitle,
  LinkLabel,
} from './styles'

function LinkGenerated({ link }) {
  const handleCopyText = useCallback((evt) => {
    window.navigator.clipboard.writeText(
      evt.currentTarget.getAttribute('value')
    )
  }, [])
  return (
    <Fragment>
      <Image src="/images/payment/link-generated.svg" alt="Link Generado" />
      <BodyContainer>
        <LinkTitle>
          {translate('payment.success.online.taxPayment.linkGenerated.title')}
        </LinkTitle>
        <Description>
          {translate(
            'payment.success.online.taxPayment.linkGenerated.subtitle'
          )}
        </Description>
        <LinkLabel>
          {translate('payment.success.online.taxPayment.linkGenerated.text')}
        </LinkLabel>
        <LinkContainer>
          <div>
            <span>{link}</span>
          </div>
          <Tooltip trigger="click" title="Copiado">
            <CopyClipBoardBtn onClick={handleCopyText} value={link}>
              <CopyOutlined />
            </CopyClipBoardBtn>
          </Tooltip>
        </LinkContainer>
      </BodyContainer>
    </Fragment>
  )
}

LinkGenerated.propTypes = {}

export default memo(LinkGenerated)
