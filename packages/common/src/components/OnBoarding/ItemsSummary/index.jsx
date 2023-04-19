import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { FileSearchOutlined } from '@ant-design/icons'
import Collapse from 'antd/lib/collapse'

import Certificates from '../Certificates'
import { ROLES } from '../../../constants/person'
import { Alert, Container, PanelTitle } from './style'

const { ASSISTANT } = ROLES
const { Panel } = Collapse

const ItemsSummary = (props) => {
  const {
    fillingId,
    handleClickDontHave,
    iconsPath,
    instanceRowClick,
    items,
    loading,
    personalInfoTab,
    removeCertificates,
    removeInstance,
    role,
    notifyLoading,
    setRefListGroup,
    syncInstanceCertificates,
    taxobject,
    updateCertificatePassword,
    loadSummary,
    markCertificateAsCancel,
    isAccountantAssisted,
  } = props

  const isLoading = useSelector(({ general }) => general.loadingCount > 0)
  // First, we filter the instances who have certificates
  const itemsSummary = items.filter((item) => {
    const hasCertificates = item.instances.find(
      (instance) => instance.certificates.length > 0
    )
    // Only returns the item when there is certificates inside it
    // or when the instaces has no certificates, however there more one of
    // those(This is something to cover personal info) and the assistant is
    // looking that
    if (hasCertificates || (role === ASSISTANT && item.instances.length > 1)) {
      return item
    }
  })

  // After we search all groups who start whit tab code and we filter the instances
  // Finally, we filter only items who be type 'tab'
  const arrayCollapse = items
    .map((tab) => {
      const groups = itemsSummary.filter((item) =>
        item.code.startsWith(tab.code)
      )
      const instances = groups.map((group) => group.instances)
      return {
        ...tab,
        instances: [].concat.apply([], instances),
      }
    })
    .filter((item) => item.type === 'tab' && item.instances.length > 0)

  return (
    <Container>
      {!itemsSummary.length && !isLoading && (
        <Alert
          message="Para poder Elaborar tu declaración de renta, es necesario que selecciones e ingreses tu información en las pestañas de Bienes, Ingresos, Deducciones, Ahorros y préstamos"
          showIcon
          type="warning"
        />
      )}
      {arrayCollapse.length > 0 && (
        <Collapse
          bordered
          defaultActiveKey={arrayCollapse.map((tab) => tab.id)}
          className={'collapse'}
        >
          {arrayCollapse.map((tab) => {
            return (
              <Panel
                forceRender
                key={tab.id}
                id={tab.code}
                header={
                  <PanelTitle>
                    <FileSearchOutlined className="panel-icon" />
                    {tab.text}
                  </PanelTitle>
                }
              >
                {tab.instances.map((instance) => {
                  const isInfoPersonal =
                    instance.code.startsWith(personalInfoTab)
                  const showBtnRemove =
                    !isInfoPersonal ||
                    (isInfoPersonal &&
                      tab.instances.length > 1 &&
                      role === ASSISTANT)
                  const { group_code: groupCode } = instance

                  return (
                    <div
                      key={instance.instance_id}
                      data-testid="instance-row"
                      onClick={() => instanceRowClick(instance, tab.id)}
                    >
                      <Certificates
                        codePath={groupCode}
                        fillingId={fillingId}
                        handleClickDontHave={handleClickDontHave}
                        iconsPath={iconsPath}
                        instance={instance}
                        loading={loading}
                        markCertificateAsCancel={markCertificateAsCancel}
                        personalInfoTab={personalInfoTab}
                        removeCertificates={removeCertificates}
                        removeInstance={removeInstance}
                        notifyLoading={notifyLoading}
                        setRefListGroup={setRefListGroup}
                        showBtnRemove={showBtnRemove}
                        taxobject={taxobject}
                        updateCertificatePassword={updateCertificatePassword}
                        syncInstanceCertificates={syncInstanceCertificates}
                        loadSummary={loadSummary}
                        isAccountantAssisted={isAccountantAssisted}
                      />
                    </div>
                  )
                })}
              </Panel>
            )
          })}
        </Collapse>
      )}
    </Container>
  )
}

ItemsSummary.propTypes = {
  fillingId: PropTypes.string.isRequired,
  handleClickDontHave: PropTypes.func.isRequired,
  iconsPath: PropTypes.string,
  instanceRowClick: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  personalInfoTab: PropTypes.string.isRequired,
  removeCertificates: PropTypes.func.isRequired,
  removeInstance: PropTypes.func.isRequired,
  role: PropTypes.string,
  notifyLoading: PropTypes.func.isRequired,
  setRefListGroup: PropTypes.func.isRequired,
  syncInstanceCertificates: PropTypes.func.isRequired,
  taxobject: PropTypes.any,
  updateCertificatePassword: PropTypes.func.isRequired,
  loadSummary: PropTypes.func.isRequired,
  markCertificateAsCancel: PropTypes.func.isRequired,
  isAccountantAssisted: PropTypes.bool,
}

ItemsSummary.defaultProps = {
  items: [],
}

export default ItemsSummary
