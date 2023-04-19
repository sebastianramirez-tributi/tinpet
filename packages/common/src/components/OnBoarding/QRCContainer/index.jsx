import React, { Fragment, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Menu from 'antd/lib/menu'
import Layout from 'antd/lib/layout'
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import {
  QuestionRender,
  QuestionRenderErrorBoundary,
} from '@tributi-co/tributi-components'

import { usePersonalInfo } from '../../../helpers/hooks'
import { captureSentryException } from '../../../sentry'
import {
  DeleteButton,
  ItemWrapper,
  QRCContainer,
  AddButton,
  QuestionRenderError,
} from './style'

const { Content, Sider } = Layout
const { Item } = Menu

const QRCContentTab = ({
  activeKey,
  addCollapse,
  answerOnboardingGroup,
  answersRender,
  changeActiveKey,
  codePath,
  counter,
  data,
  disabledAdd,
  iconsPath,
  lastAnswersKeys,
  questionsbyGroup,
  removeInstance,
  setRefQRC,
}) => {
  const qrcRef = useRef(null)
  const { personalInfo } = usePersonalInfo()
  const { currentFiling, isEnhancedRole } = personalInfo

  const panelGenerator = (instanceAnswers, index) => {
    const handleItemClick = (evt) => {
      changeActiveKey(evt.domEvent, index)
    }
    const kind = currentFiling.kind
    const suraIcons = kind === 'SDSURA' ? 'should-declare/' : ''
    const lastAnswers = lastAnswersKeys[activeKey]
    const isEqual = activeKey === index
    const hasAnswers =
      instanceAnswers !== undefined || lastAnswers !== undefined
    const showDeleteIcon =
      (isEqual && activeKey !== 0) || (isEqual && index === 0 && hasAnswers)

    return (
      <Item id={index} key={index} onClick={handleItemClick}>
        <div className="text-icon">
          <div
            className={`circle-cont ${
              instanceAnswers && `circle-cont--${instanceAnswers.status}`
            }`}
          >
            {index + 1}
          </div>
          <img
            className="normal"
            src={`${iconsPath}${suraIcons}${codePath}.svg`}
          />
          <img
            className="selected"
            src={`${iconsPath}${suraIcons}${codePath}.svg`}
          />
          <div className="text-item-tree">{data.text}</div>
        </div>
        {showDeleteIcon && (
          <DeleteButton
            color="danger"
            onClick={removeInstance(instanceAnswers, index)}
            size="md"
            variant="outlined"
            icon={DeleteOutlined}
          />
        )}
      </Item>
    )
  }

  const umbrellaAnswer = answersRender
    ? answersRender.filter((taxInput) => taxInput.is_umbrella)
    : []
  const answersKey = answerOnboardingGroup[activeKey]
  const taxInputs =
    answersKey && answersKey.tax_inputs.length > 0
      ? answersKey.tax_inputs
      : umbrellaAnswer
  const lastAnswers =
    lastAnswersKeys[activeKey] && lastAnswersKeys[activeKey].bulkAnswers

  useLayoutEffect(() => {
    setRefQRC(qrcRef, activeKey)
  }, [qrcRef, activeKey, setRefQRC])

  return (
    <Fragment>
      <ItemWrapper>
        <Sider width={350}>
          <Menu
            selectedKeys={[activeKey.toString()]}
            mode="inline"
            className={`aside-menu index-${activeKey}`}
          >
            {answerOnboardingGroup.map((item, index) =>
              panelGenerator(item, index)
            )}
          </Menu>
          <AddButton
            hidden={data.instances_limit === 1}
            disabled={disabledAdd}
            onClick={addCollapse}
          >
            <PlusCircleOutlined />
            <span>Agregar otro</span>
          </AddButton>
        </Sider>

        <Content className={`index-${activeKey}`}>
          <QRCContainer>
            <QuestionRenderErrorBoundary
              logServiceCallback={captureSentryException}
              fallback={
                <QuestionRenderError>
                  <p>
                    <b>Algo pasó y no pudimos cargar esta sección</b>, puede ser
                    el navegador o una de las extensiones. Puedes intentar
                    desactivando las extensiones o con otro navegador.
                  </p>
                  <p>
                    Si sigues teniendo problemas, comunícate con el chat en
                    vivo.
                  </p>
                </QuestionRenderError>
              }
            >
              <QuestionRender
                answers={lastAnswers || taxInputs}
                country={currentFiling.country_code}
                enableIconHelp
                enableEnhancedInputInfo={isEnhancedRole}
                hideSaveButton
                key={`${activeKey}-${counter}`}
                markMandatoryFields
                noStyle
                qrcType="OB"
                questions={questionsbyGroup}
                ref={qrcRef}
                taxYear={currentFiling.tax_year}
                taxableKind={currentFiling.taxable_kind}
              />
            </QuestionRenderErrorBoundary>
          </QRCContainer>
        </Content>
      </ItemWrapper>
    </Fragment>
  )
}

QRCContentTab.propTypes = {
  activeKey: PropTypes.number,
  addCollapse: PropTypes.func,
  answerOnboardingGroup: PropTypes.arrayOf(
    PropTypes.shape({
      tax_inputs: PropTypes.arrayOf(PropTypes.shape({})),
    })
  ),
  answersRender: PropTypes.arrayOf(PropTypes.shape({})),
  changeActiveKey: PropTypes.func,
  codePath: PropTypes.string,
  counter: PropTypes.number,
  data: PropTypes.shape({
    instances_limit: PropTypes.number,
    text: PropTypes.string,
  }),
  disabledAdd: PropTypes.bool,
  iconsPath: PropTypes.string,
  lastAnswersKeys: PropTypes.arrayOf(PropTypes.object),
  questionsbyGroup: PropTypes.arrayOf(PropTypes.shape({})),
  removeInstance: PropTypes.func,
  setRefQRC: PropTypes.func,
}

export default QRCContentTab
