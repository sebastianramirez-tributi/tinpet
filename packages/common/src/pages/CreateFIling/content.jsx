import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'

import { RootContext } from '../../context'
import RedirectUser from '../../helpers/redirect-user'
import { SURA_RETAIL } from '../../constants/subdomains'
import { CONSUMER_APP } from '../../constants/general'
import TermsAndConditionsControl from '../../components/TermsAndConditionsControl'
import { phoneList } from '../../helpers/phone-list'
import { validatePassport, getCookie } from '../../helpers/collections'
import { Card, CardBody } from '../../components/Card'
import {
  Container,
  ContainerInput,
  RadioButton,
  Title,
  Text,
  ContainerRadio,
  InputRadio,
  StyledButton,
  StyledError,
  StyledSelect,
} from './style'

const FormItem = Form.Item
const InputGroup = Input.Group
const { Option } = Select
export default class CreateFillingPage extends Component {
  state = {
    planID: '',
    phoneNumber: '',
    documentError: false,
    phoneError: false,
    value: 1,
    knownFromAnother: null,
    survey: '',
    documentType: 'cedula_de_ciudadania',
  }

  static contextType = RootContext

  formRef = React.createRef()

  componentDidMount() {
    const { userInfo, navigate, personalInfo } = this.props
    if (
      personalInfo &&
      personalInfo.own_person &&
      personalInfo.own_person.user_document_type &&
      personalInfo.currentFiling &&
      personalInfo.phone &&
      personalInfo.national_id &&
      personalInfo.last_name
    ) {
      // This is a workarround since activeRef from useNavigate is not enable until the component is being properly render. So we need to defer this action util that is ready.
      setTimeout(() => {
        navigate('/filings')
      }, 0)
    } else if (userInfo && userInfo.document_id) {
      this.formRef.current.setFieldsValue({ document_id: userInfo.document_id })
    }
  }

  componentDidUpdate() {
    const {
      personalInfo,
      updateUser,
      navigate,
      context: { subdomainConfig } = {},
    } = this.props
    if (updateUser && updateUser.phone && subdomainConfig) {
      const isSuraApp = subdomainConfig.key === SURA_RETAIL
      RedirectUser.createdUser(personalInfo, navigate, isSuraApp)
    }
  }

  handleSubmit = (values) => {
    const { update } = this.props
    values.phone = values.phone_prefix.split('&')[1] + values.phone
    delete values.phone_prefix
    if (this.state.survey) {
      values.know_from = `${this.state.knownFromAnother}:${this.state.survey}`
    }
    this.setState({ documentError: false })
    let utmParams = {}
    // in case we are having a invalid JSON when get the cookie and the parse fais, we need to fallback with empty utm information
    try {
      utmParams = JSON.parse(getCookie('tributi:utmParams'))
    } catch {
      utmParams = { utm_source: '', utm_campaign: '', utm_medium: '' }
    }
    update(values, utmParams)
  }

  handleSubmitError = ({ errorInfo: err }) => {
    if (typeof err.document_id === 'object' && err.document_id.errors) {
      this.setState({ documentError: err.document_id.errors[0].message })
    } else {
      this.setState({ documentError: false })
    }
    if (typeof err.phone === 'object' && err.phone.errors) {
      this.setState({ phoneError: err.phone.errors[0].message })
    } else {
      this.setState({ phoneError: false })
    }
  }

  validateInputLength = (length, message) => (_, value) => {
    if (value && value.length !== length) {
      return Promise.reject(new Error(message))
    }
    return Promise.resolve()
  }

  validateMinInputLength = (length, message) => (_, value) => {
    const isPassport = this.state.documentType === 'pasaporte'
    if (value && isPassport && !validatePassport(value)) {
      return Promise.reject(new Error('El pasaporte no es válido'))
    } else if (
      !isPassport &&
      ((value && value.length < length) || !/^[0-9]+$/.test(value))
    ) {
      if (!/^[0-9]+$/.test(value))
        return Promise.reject(new Error('El documento no es válido'))
      return Promise.reject(new Error(message))
    }
    return Promise.resolve()
  }

  onsurveyChange = (e) => {
    const name = e.target.value
    this.setState({ survey: name })
  }

  onChange = (e) => {
    this.setState({
      knownFromAnother: e.target.value,
    })
  }

  validateField = (e, target) => {
    if (e.target.value) {
      this.setState({ [target]: false })
    }
  }

  renderRadios = ({ value, text, isOther }) => {
    const { knownFromAnother, survey } = this.state
    const currentIsSelected = knownFromAnother === value
    return (
      <RadioButton key={value} value={value} onChange={this.onChange}>
        {text}
        {isOther && currentIsSelected && (
          <InputRadio value={survey} onChange={this.onsurveyChange} />
        )}
      </RadioButton>
    )
  }

  render() {
    const { knownFrom } = this.context
    const [firstHalf, secondHalf] = knownFrom
    const { personalInfo } = this.props
    const { documentType, documentError, phoneError } = this.state
    const domain = this.props.context
      ? this.props.context.subdomainConfig.key
      : ''
    const isDocumentTypeNumber =
      documentType === 'cedula_de_ciudadania' ||
      documentType === 'cedula_de_extranjeria'
        ? 'number'
        : 'text'

    const signUpProviderFlag = JSON.parse(
      localStorage.getItem('signUpProviderFlag')
    )
    const {
      national_id: documentId,
      user_document_type: userDocumentType,
      phone,
      first_name: firstName,
      last_name: lastName,
    } = personalInfo
    const token = localStorage.jwtToken
    const redirectBC = localStorage.redirectBC
    const termsAccepted = personalInfo.tyc_has_accepted

    const runningApp =
      process.env.CONSUMER_APP === CONSUMER_APP.TRIBUTI
        ? 'Tributi'
        : process.env.CONSUMER_APP === CONSUMER_APP.ACCOUNTANT
        ? 'Contadia'
        : 'Planeación tributaria'

    return (
      <div className="container">
        <Container className="row center-xs">
          <div className="col-xs-12 col-md-10 col-lg-9">
            <Card>
              <CardBody>
                <Form
                  onFinish={this.handleSubmit}
                  ref={this.formRef}
                  scrollToFirstError
                >
                  <Title>{'Por favor completa tu información personal'}</Title>
                  {(signUpProviderFlag || !lastName) && (
                    <Fragment>
                      <FormItem
                        initialValue={firstName}
                        name="first_name"
                        rules={[
                          {
                            required: true,
                            message: 'Por favor ingresa tus nombres.',
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input placeholder="Nombres" />
                      </FormItem>
                      <FormItem
                        initialValue={lastName}
                        name="last_name"
                        rules={[
                          {
                            required: true,
                            message: 'Por favor ingresa tus apellidos.',
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input placeholder="Apellidos" />
                      </FormItem>
                    </Fragment>
                  )}
                  <FormItem>
                    <InputGroup>
                      <ContainerInput>
                        <FormItem
                          name="user_document_type"
                          noStyle
                          initialValue={
                            userDocumentType || 'cedula_de_ciudadania'
                          }
                        >
                          <StyledSelect
                            onChange={(value) =>
                              this.setState({ documentType: value })
                            }
                          >
                            <Option value={'cedula_de_ciudadania'}>
                              {'Cédula de Ciudadanía'}
                            </Option>
                            <Option value={'cedula_de_extranjeria'}>
                              {'Cédula de Extranjería'}
                            </Option>
                            <Option value={'pasaporte'}>{'Pasaporte'}</Option>
                          </StyledSelect>
                        </FormItem>
                        <FormItem
                          initialValue={documentId}
                          name="document_id"
                          rules={[
                            {
                              required: true,
                              message:
                                'Por favor ingresa tu documento de identificación.',
                            },
                            {
                              pattern: /^[^0][0-9]*/,
                              message: translate('signUp.documentId.invalid'),
                            },
                            {
                              validator: this.validateMinInputLength(
                                4,
                                'Recuerda que el número de identificación debe ser mínimo de 4 caracteres.'
                              ),
                            },
                          ]}
                          noStyle
                        >
                          <Input
                            type={isDocumentTypeNumber}
                            placeholder={'Documento de identidad'}
                            onChange={(e) =>
                              this.validateField(e, 'documentError')
                            }
                          />
                        </FormItem>
                      </ContainerInput>
                    </InputGroup>
                    <StyledError>{documentError}</StyledError>
                  </FormItem>

                  <FormItem>
                    <InputGroup>
                      <ContainerInput>
                        <FormItem
                          name="phone_prefix"
                          noStyle
                          initialValue="Colombia&+57"
                        >
                          <StyledSelect>
                            <Option value={`Colombia&`} key={-1}>
                              {`Seleccionar`}
                            </Option>
                            {phoneList.map((phone, index) => (
                              <Option
                                value={`${phone.country}&${phone.code}`}
                                key={index}
                              >
                                {`${phone.country} ( ${phone.code} )`}
                              </Option>
                            ))}
                          </StyledSelect>
                        </FormItem>
                        <FormItem
                          name="phone"
                          initialValue={phone}
                          rules={[
                            {
                              required: true,
                              message: 'Por favor ingresa tu teléfono.',
                            },
                            {
                              validator: this.validateInputLength(
                                10,
                                'Recuerda que el número de télefono debe tener 10 caracteres.'
                              ),
                            },
                          ]}
                          noStyle
                        >
                          <Input
                            placeholder={'Número de celular'}
                            type={'number'}
                            onChange={(e) =>
                              this.validateField(e, 'phoneError')
                            }
                          />
                        </FormItem>
                      </ContainerInput>
                    </InputGroup>
                    <StyledError>{phoneError}</StyledError>
                  </FormItem>
                  {!!knownFrom.length && (
                    <div>
                      <Text>{`¿Cómo te enteraste de ${runningApp}?`}</Text>
                      <FormItem
                        name="know_from"
                        rules={[
                          {
                            required: true,
                            message: `Por favor selecciona cómo te enteraste de ${runningApp}`,
                          },
                        ]}
                      >
                        <Radio.Group className="row">
                          <ContainerRadio className="col-xs-12 col-md-12 col-lg-6">
                            {
                              // We need to split out in two columns since css will lead
                              // some issues
                              firstHalf.map(this.renderRadios)
                            }
                          </ContainerRadio>
                          <ContainerRadio className="col-xs-12 col-md-12 col-lg-6">
                            {secondHalf.map(this.renderRadios)}
                          </ContainerRadio>
                        </Radio.Group>
                      </FormItem>
                    </div>
                  )}
                  {!termsAccepted && (
                    <div className="terms-and-conditions-container">
                      <TermsAndConditionsControl />
                    </div>
                  )}
                  <StyledButton fullWidth size="lg" type="submit">
                    Siguiente
                  </StyledButton>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Container>
      </div>
    )
  }
}

CreateFillingPage.propTypes = {
  error: PropTypes.any,
  isExitoApp: PropTypes.bool,
  context: PropTypes.shape({
    subdomainConfig: PropTypes.shape({
      key: PropTypes.string,
    }),
  }),
  update: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  updateUser: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      phone: PropTypes.string,
    }),
  ]),
  userInfo: PropTypes.shape({
    document_id: PropTypes.string,
  }),
  personalInfo: PropTypes.object,
}
