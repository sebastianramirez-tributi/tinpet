import React, { Fragment, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { stringFormat } from '@tributi-co/core-fe'

import { formatPriceShareCode } from '../../helpers/collections'
import { usePersonalInfo } from '../../helpers/hooks'
import { shareSocialInfo, CODE_KEY } from '../../constants/referral'

import {
  Container,
  Image,
  Title,
  Content,
  InviteCard,
  InviteCardBody,
  InviteCardContent,
  Subtitle,
  RefCodeContainer,
  RefCodeImg,
  RefCodeText,
  Paragraph,
  ShareCopy,
  ShareIcon,
  ShareLink,
  InviteModal,
} from './style'

const InviteFriends = ({
  showModal,
  handleCancel,
  referralCount,
  referralBalance,
  filerReferredPrice = 0,
  getUserReferals,
}) => {
  const { personalInfo } = usePersonalInfo()
  const { first_name: name, coupons = [] } = personalInfo || {}
  const coupon = coupons.find((coupon) => coupon.type === 'referral') || {}
  const { code } = coupon

  useEffect(() => {
    if (showModal) {
      getUserReferals()
    }
  }, [showModal, getUserReferals])

  const shareInfo = useMemo(
    () =>
      shareSocialInfo.map(({ name, id, type, url }) => {
        const formattedURL = url.replace(CODE_KEY, code)
        return (
          <ShareLink
            href={formattedURL}
            target="_blank"
            rel="noopener noreferrer"
            key={name}
            id={id}
          >
            <ShareIcon component={type} />
          </ShareLink>
        )
      }),
    [code]
  )

  return (
    <InviteModal
      width={700}
      onCancel={handleCancel}
      destroyOnClose
      visible={showModal}
      footer={
        <Fragment>
          <ShareCopy>{translate('referral.footer.share')}</ShareCopy>
          {shareInfo}
        </Fragment>
      }
    >
      <Container>
        <Image alt="icono referir" src="/images/refiere.svg" />
        <Title>
          {stringFormat(translate('referral.header.title'), { name })}
        </Title>
        <Content>
          <InviteCard>
            <InviteCardBody>
              <InviteCardContent>
                <Subtitle>{translate('referral.content.yourCode')}</Subtitle>
                <RefCodeContainer>
                  <RefCodeImg src="/images/referidos/cupon.svg" />
                  <RefCodeText>{code}</RefCodeText>
                </RefCodeContainer>
                <Paragraph
                  data-testid="share-cuopon"
                  dangerouslySetInnerHTML={{
                    __html: translate('referral.content.message'),
                  }}
                />
              </InviteCardContent>
            </InviteCardBody>
          </InviteCard>
          <InviteCard idCustomStyle={'modal__invite_card'}>
            <InviteCardBody>
              <InviteCardContent>
                <Subtitle>{translate('referral.content.earn')}</Subtitle>
                <RefCodeContainer>
                  <RefCodeImg src="/images/referidos/ganado.svg" />
                  <RefCodeText>
                    ${formatPriceShareCode(referralCount * filerReferredPrice)}
                  </RefCodeText>
                </RefCodeContainer>
                <Subtitle>{translate('referral.content.referrals')}</Subtitle>
                <RefCodeContainer>
                  <RefCodeImg src="/images/referidos/referidos.svg" />
                  <RefCodeText>{referralCount}</RefCodeText>
                </RefCodeContainer>
                <Subtitle>{translate('referral.content.balance')}</Subtitle>
                <RefCodeContainer>
                  <RefCodeImg src="/images/referidos/ganado.svg" />
                  <RefCodeText>
                    ${formatPriceShareCode(referralBalance)}
                  </RefCodeText>
                </RefCodeContainer>
              </InviteCardContent>
            </InviteCardBody>
          </InviteCard>
        </Content>
      </Container>
    </InviteModal>
  )
}

InviteFriends.propTypes = {
  showModal: PropTypes.bool,
  handleCancel: PropTypes.func,
  name: PropTypes.string,
  coupon: PropTypes.shape({
    code: PropTypes.string,
  }),
  getUserReferals: PropTypes.func.isRequired,
  referralCount: PropTypes.number,
  referralBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  filerReferredPrice: PropTypes.number,
}

export default InviteFriends
