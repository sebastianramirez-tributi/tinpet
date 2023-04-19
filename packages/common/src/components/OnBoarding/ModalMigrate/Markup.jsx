import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExportOutlined,
} from '@ant-design/icons'

import {
  ContainerHead,
  ModalTitle,
  Text,
  ContentModalFooter,
  ButtonMigrate,
  ButtonMigrateContinue,
} from './styles'

const Markup = ({
  onCancelPreload,
  onContinue,
  buttonLoadInfo,
  showConfirm,
  successLoad,
  onPreload,
  migrationErrorStatus,
  wasMigrated,
}) => {
  if (showConfirm) {
    return (
      <Fragment>
        <ContainerHead>
          <InfoCircleOutlined />
          <ModalTitle>
            {translate(
              'filings.onboarding.modalMigrate.uploadPreviousYearInfo.title'
            )}
          </ModalTitle>
        </ContainerHead>
        <Text>
          {translate(
            'filings.onboarding.modalMigrate.uploadPreviousYearInfo.text'
          )}
        </Text>
        <ContentModalFooter>
          <ButtonMigrate
            variant="outlined"
            loading={buttonLoadInfo}
            onClick={onCancelPreload}
          >
            {translate(
              'filings.onboarding.modalMigrate.uploadPreviousYearInfo.button.notContinue'
            )}
          </ButtonMigrate>
          <ButtonMigrate
            loading={buttonLoadInfo}
            spin={buttonLoadInfo}
            onClick={onPreload}
          >
            {translate(
              'filings.onboarding.modalMigrate.uploadPreviousYearInfo.button.uploadInfo'
            )}
          </ButtonMigrate>
        </ContentModalFooter>
      </Fragment>
    )
  }
  if (!showConfirm && successLoad && !migrationErrorStatus) {
    return (
      <Fragment>
        <ContainerHead>
          <CheckCircleOutlined />
          <ModalTitle>
            {translate(
              'filings.onboarding.modalMigrate.successfulUpload.title'
            )}
          </ModalTitle>
        </ContainerHead>
        <Text>
          {translate(
            'filings.onboarding.modalMigrate.successfulUpload.text.part1'
          )}
          <ExportOutlined />
          &nbsp;
          {translate(
            'filings.onboarding.modalMigrate.successfulUpload.text.part2'
          )}
        </Text>
        <ContentModalFooter>
          <ButtonMigrateContinue onClick={onContinue}>
            {translate(
              'filings.onboarding.modalMigrate.successfulUpload.button'
            )}
          </ButtonMigrateContinue>
        </ContentModalFooter>
      </Fragment>
    )
  }
  return (
    <Fragment>
      <ContainerHead>
        <CloseCircleOutlined />
        <ModalTitle>
          {translate(
            'filings.onboarding.modalMigrate.unsuccessfulUpload.title'
          )}
        </ModalTitle>
      </ContainerHead>
      <Text>
        {translate('filings.onboarding.modalMigrate.unsuccessfulUpload.text')}
      </Text>
      <ContentModalFooter>
        <ButtonMigrate
          variant="outlined"
          loading={buttonLoadInfo}
          onClick={onCancelPreload}
        >
          {translate(
            'filings.onboarding.modalMigrate.unsuccessfulUpload.button.continueWithoutUpload'
          )}
        </ButtonMigrate>
        <ButtonMigrate
          loading={buttonLoadInfo}
          spin={buttonLoadInfo}
          onClick={onPreload}
        >
          {translate(
            'filings.onboarding.modalMigrate.unsuccessfulUpload.button.retryUpload'
          )}
        </ButtonMigrate>
      </ContentModalFooter>
    </Fragment>
  )
}
Markup.propTypes = {
  onPreload: PropTypes.func,
  onCancelPreload: PropTypes.func,
  onRetryPreload: PropTypes.func,
  onContinue: PropTypes.func,
  buttonLoadInfo: PropTypes.bool,
  showConfirm: PropTypes.bool,
  successLoad: PropTypes.bool,
  migrationErrorStatus: PropTypes.bool,
  wasMigrated: PropTypes.bool,
}

export default Markup
