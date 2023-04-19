import React from 'react'
import PropTypes from 'prop-types'
import List from 'antd/lib/list'
import Tooltip from 'antd/lib/tooltip'
import {
  DeleteOutlined,
  TeamOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'

import { useRootContext } from '../../../context.js'
import { CERTIFICATE_TYPES } from '../../../constants/certificates.js'
import UploadModal from '../Upload'
import {
  Certificate,
  CertificateHeader,
  CertificateContent,
  DeleteButton,
  CertificateHeaderTitleContainer,
  AccountantCertificate,
  AccountantCertificateIcon,
  AccountantCertificateText,
  Link,
  QuestionIcon,
} from './styles'

const REQUIRED_LEVEL_MSG =
  '* Esta información es opcional. Sin embargo, incluirla podría ayudarte.'

const Certificates = (props) => {
  const {
    codePath,
    fillingId,
    handleClickDontHave,
    iconsPath,
    instance,
    loading,
    removeCertificates,
    removeInstance,
    notifyLoading,
    setRefListGroup,
    showBtnRemove,
    syncInstanceCertificates,
    taxobject,
    updateCertificatePassword,
    loadSummary,
    markCertificateAsCancel,
    isAccountantAssisted,
  } = props

  const { instance_id: instanceId, certificates = [] } = instance
  const { isAccountantApp } = useRootContext()

  return (
    <Certificate>
      <CertificateHeader>
        <img
          className={'certificates__icon_instance'}
          src={`${iconsPath}${codePath}.svg`}
        />
        <CertificateHeaderTitleContainer>
          <strong className={'certificates__value'}> {instance.value}</strong>
          {showBtnRemove && (
            <Tooltip
              title="Por favor espera a que se carguen los certificados"
              trigger={loading ? 'hover' : 'none'}
            >
              <DeleteButton
                color="danger"
                onClick={(e) => removeInstance(e, instance)}
                icon={DeleteOutlined}
                size="md"
                variant="outlined"
                disabled={loading}
              />
            </Tooltip>
          )}
        </CertificateHeaderTitleContainer>
      </CertificateHeader>
      {certificates && certificates.length > 0 && (
        <List
          itemLayout={'horizontal'}
          dataSource={certificates}
          renderItem={(item) => {
            return (
              <CertificateContent>
                <div
                  data-certificateid={item.id}
                  data-instanceid={item.user_certificate?.instance_id}
                  className={'certificates__container_item'}
                >
                  <div className={'certificates__row row__left'}>
                    <div className={'certificates__content_title'}>
                      <span className={'certificates__title'}>{item.text}</span>
                      <br />
                      <span className={'certificates__msg'}>
                        {item.required_level === 0 &&
                        item.certificate_kind !== CERTIFICATE_TYPES.TAX_REPORT
                          ? REQUIRED_LEVEL_MSG
                          : ''}
                      </span>
                      {item.values?.certificate_url && !isAccountantApp && (
                        <Link
                          href={item.values.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <QuestionIcon as={QuestionCircleOutlined} />
                          ¿Cómo conseguirlo?
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className={'certificates__row row__right'}>
                    <UploadModal
                      ref={(ref) =>
                        setRefListGroup(ref, {
                          instance_id: instanceId,
                          ...item,
                        })
                      }
                      classButton={'button-summary'}
                      certificateCode={item.code}
                      taxobject={taxobject}
                      fillingId={fillingId}
                      fileName={item.text}
                      itemCertificate={item}
                      instanceId={instanceId}
                      onClickDontHave={handleClickDontHave}
                      removeCertificates={removeCertificates}
                      loading={loading}
                      notifyLoading={notifyLoading}
                      syncInstanceCertificates={syncInstanceCertificates}
                      updateCertificatePassword={updateCertificatePassword}
                      loadSummary={loadSummary}
                      markCertificateAsCancel={markCertificateAsCancel}
                    />
                    {isAccountantAssisted && item.is_pseudo_certificate ? (
                      <AccountantCertificate>
                        <AccountantCertificateIcon as={TeamOutlined} />
                        <AccountantCertificateText>
                          Este certificado contiene campos que deben ser
                          diligenciados con el cliente.
                        </AccountantCertificateText>
                      </AccountantCertificate>
                    ) : null}
                  </div>
                </div>
              </CertificateContent>
            )
          }}
        />
      )}
    </Certificate>
  )
}

Certificates.propTypes = {
  codePath: PropTypes.string,
  fillingId: PropTypes.string.isRequired,
  handleClickDontHave: PropTypes.func.isRequired,
  iconsPath: PropTypes.string,
  instance: PropTypes.shape({
    certificates: PropTypes.arrayOf(
      PropTypes.shape({
        is_pseudo_certificate: PropTypes.bool,
      })
    ),
    code: PropTypes.string,
    instance_id: PropTypes.string,
    value: PropTypes.string,
  }),
  loading: PropTypes.bool,
  personalInfoTab: PropTypes.string.isRequired,
  removeCertificates: PropTypes.func.isRequired,
  removeInstance: PropTypes.func.isRequired,
  notifyLoading: PropTypes.func.isRequired,
  setRefListGroup: PropTypes.func.isRequired,
  showBtnRemove: PropTypes.bool,
  syncInstanceCertificates: PropTypes.func.isRequired,
  taxobject: PropTypes.any,
  updateCertificatePassword: PropTypes.func.isRequired,
  loadSummary: PropTypes.func.isRequired,
  markCertificateAsCancel: PropTypes.func.isRequired,
  isAccountantAssisted: PropTypes.bool,
}

export default Certificates
