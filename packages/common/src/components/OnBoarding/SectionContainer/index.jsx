import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import { isEmpty, stringFormat } from '@tributi-co/core-fe'
import SectionTitle from '../SectionTitle'
import SectionItemContainer from '../SectionItemContainer'
import SectionItemQRC from '../SectionItemQRC'
import { Container, NextButton } from './style'
import { usePersonalInfo } from '../../../helpers/hooks'
import {
  COLLAPSIBLE_GROUP_TYPE,
  OBJECT_ACTIVE_AMOUNT,
  STATUS,
} from '../../../constants/onboarding'
import {
  bulkSaveAnswers,
  deleteInstanceQuestion,
  deleteInstanceQuestionCounter,
  getCurrentAnswerByCode,
  getOnboardingStart,
  getQuestionsByGroup2,
} from '../../../redux/onboarding/actions'

const TITLE =
  'Según tu información en la DIAN, descartamos algunas opciones que ya sabemos que no te aplican; si quieres, puedes revisarlas aquí'
const sectionTitleMap = {
  selected: {
    title: translate('filings.onboarding.selectedObjectsTitle'),
    subtitle: translate('filings.onboarding.selectedObjectSubtitle'),
  },
  relevant: {
    title: translate('filings.onboarding.relevantObjectsTitle'),
    subtitle: translate('filings.onboarding.relevantObjectSubtitle'),
  },
}

const SectionContainer = ({
  bulkSaveAnswers,
  deleteInstanceQuestion,
  deleteInstanceQuestionCounter,
  getQuestionsByGroup2,
  getCurrentAnswerByCode,
  getOnboardingStart,
  groupCode,
  helpLink,
  iconsPath,
  next,
  onSaveSura,
  sectionTitle,
  sectionSubtitle,
  hasMigratedAnswers,
  setPartialInfo,
}) => {
  const [dataQRC, setDataQRC] = useState(null)
  const [showButtonNext, setShowButtonNext] = useState(false)
  const { personalInfo } = usePersonalInfo()
  const { currentFiling } = personalInfo
  const { id: filingId, tax_year: taxYear } = currentFiling

  const getSectionInfo = useCallback(() => {
    getOnboardingStart({ code: groupCode, fillingId: filingId })
  }, [groupCode, filingId]) // eslint-disable-line

  useEffect(() => {
    getSectionInfo()
  }, [getSectionInfo])

  const handleShowQRC = useCallback((item) => {
    setDataQRC(item)
    document.body.scrollIntoView()
  }, [])

  const handleResetQRC = useCallback(() => {
    document.body.scrollIntoView()
    setDataQRC(null)
  }, [])

  const { answerOnboardingGroup, answersRender, questionsbyGroup, sections } =
    useSelector(
      ({
        onboardingReducer: {
          answerOnboardingGroup,
          answersRender,
          questionsbyGroup,
          sections,
        },
      }) => ({
        answerOnboardingGroup,
        answersRender,
        questionsbyGroup,
        sections: sections || {},
      })
    )

  const hasSelectedInfo = useMemo(() => sections.selected?.length, [sections])

  /**
   * Track the groups change and reset QRC and configure
   * the Next button with the proper copy.
   */
  useEffect(() => {
    handleResetQRC()
    setShowButtonNext(hasSelectedInfo)
  }, [handleResetQRC, hasSelectedInfo])

  const handleSetNextButton = useCallback(
    (status) => {
      const buttonStatus = status ? showButtonNext || status : hasSelectedInfo
      setShowButtonNext(buttonStatus)
    },
    [showButtonNext, hasSelectedInfo]
  )

  const showFooter = !isEmpty(sections)
  // TODO: Refactor this since it's very complicated get rid of the reference
  // and it deserve to refactor the SectionItem component as well
  const listG = useCallback(() => {}, [])

  const handleIncrease = useCallback(
    async (item, count) => {
      await bulkSaveAnswers(
        null,
        { code: item.code, taxobject: item.id, fillingId: filingId },
        'noBulk'
      )
      if (count === OBJECT_ACTIVE_AMOUNT) {
        handleSetNextButton(true)
      }
    },
    [bulkSaveAnswers, filingId, handleSetNextButton]
  )

  const handleDecrease = useCallback(
    async (instanceId, count) => {
      await deleteInstanceQuestionCounter({
        instance_id: instanceId,
        fillingId: filingId,
      })
      if (!count) {
        handleSetNextButton(false)
        getSectionInfo()
      }
    },
    [
      deleteInstanceQuestionCounter,
      filingId,
      getSectionInfo,
      handleSetNextButton,
    ]
  )

  const hasPartialInfo = useMemo(
    () =>
      sections.selected
        ?.at(0)
        .objects.some(({ status }) => status === STATUS.PARTIAL),
    [sections.selected]
  )

  useEffect(() => {
    setPartialInfo(hasPartialInfo)
  }, [hasPartialInfo, setPartialInfo])

  return (
    <Container>
      {!dataQRC && (
        <Fragment>
          <SectionTitle
            title={sectionTitle}
            subtitle={sectionSubtitle}
            helpLink={helpLink}
          />
          {Object.keys(sections)
            .sort()
            .reverse()
            .map((sectionName) => {
              const { title = '', subtitle = '' } =
                sectionTitleMap[sectionName] || {}
              return (
                sections[sectionName] && (
                  <SectionItemContainer
                    data={sections[sectionName]}
                    collapsible={sectionName === COLLAPSIBLE_GROUP_TYPE}
                    key={sectionName}
                    iconsPath={iconsPath}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onShowQRC={handleShowQRC}
                    setRefListGroup={listG}
                    collapsibleTitle={TITLE}
                    title={stringFormat(title, { object: sectionTitle })}
                    subtitle={stringFormat(subtitle, {
                      object: sectionTitle.toLowerCase(),
                      year: taxYear,
                    })}
                  />
                )
              )
            })}
          {showFooter && (
            <div className="panel_footer">
              <NextButton size="lg" onClick={next}>
                {showButtonNext ? 'Siguiente' : 'No me aplican'}
              </NextButton>
            </div>
          )}
        </Fragment>
      )}
      {dataQRC && (
        <SectionItemQRC
          answersRender={answersRender}
          answerOnboardingGroup={answerOnboardingGroup}
          bulkSaveAnswers={bulkSaveAnswers}
          currentTab={groupCode}
          data={dataQRC}
          deleteInstanceQuestion={deleteInstanceQuestion}
          fillingId={filingId}
          getSectionInfo={getSectionInfo}
          getQuestionsByGroup2={getQuestionsByGroup2}
          getCurrentAnswerByCode={getCurrentAnswerByCode}
          iconsPath={iconsPath}
          onSetNextButton={handleSetNextButton}
          questionsbyGroup={questionsbyGroup}
          resetQRC={handleResetQRC}
          saveSuraBtn={onSaveSura}
          hasMigratedAnswers={hasMigratedAnswers}
        />
      )}
    </Container>
  )
}

SectionContainer.propTypes = {
  bulkSaveAnswers: PropTypes.func.isRequired,
  deleteInstanceQuestion: PropTypes.func.isRequired,
  deleteInstanceQuestionCounter: PropTypes.func.isRequired,
  getQuestionsByGroup2: PropTypes.func.isRequired,
  getCurrentAnswerByCode: PropTypes.func.isRequired,
  getOnboardingStart: PropTypes.func.isRequired,
  groupCode: PropTypes.string,
  helpLink: PropTypes.string,
  iconsPath: PropTypes.string,
  next: PropTypes.func.isRequired,
  onSaveSura: PropTypes.func,
  person: PropTypes.shape({
    fillings: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
      })
    ),
  }),

  /**
   * Subtitle to show in the sections
   */
  sectionSubtitle: PropTypes.string,

  /**
   * Title of the section
   */
  sectionTitle: PropTypes.string,
  hasMigratedAnswers: PropTypes.bool,
  setPartialInfo: PropTypes.func.isRequired,
}

SectionContainer.defaultProps = {
  helpLink: '',
  iconsPath: '',
  sectionSubtitle: '',
  sectionTitle: '',
  hasMigratedAnswers: false,
}

// to avoid send the dispatch via props in every component we need to bind these
// actions.
const mapDispatchToProps = {
  bulkSaveAnswers,
  deleteInstanceQuestion,
  deleteInstanceQuestionCounter,
  getQuestionsByGroup2,
  getCurrentAnswerByCode,
  getOnboardingStart,
}

export default connect(null, mapDispatchToProps)(SectionContainer)
