import React, { Component } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Col from 'antd/lib/col'
import Input from 'antd/lib/input'
import Row from 'antd/lib/row'
import Tooltip from 'antd/lib/tooltip'
import { formatPrice } from '../../../helpers/collections'

import { PAYMENT_STATUS } from '../../../constants/payment'

class PaymentDirect extends Component {
  constructor(props) {
    super(props)
    this.formPayment = React.createRef()
  }

  state = {
    coupon: null,
    visible: false,
    fillingId: localStorage.infoUser
      ? JSON.parse(localStorage.infoUser).fillings[0].id
      : null,
    filling: localStorage.infoUser
      ? JSON.parse(localStorage.infoUser).fillings[0]
      : null,
    name: localStorage.infoUser
      ? `${JSON.parse(localStorage.infoUser).first_name}`
      : '',
  }

  componentDidMount() {
    this.props.getFillingState(this.state.fillingId)
  }

  handleOk = (e) => this.setState({ visible: false })
  handleCancel = (e) => this.setState({ visible: false })
  handleSubmit = (e) => {
    e.preventDefault()
    this.formPayment.current.submit()
    this.props.PaymentPending(this.props.order_id)
  }

  onChangeCoupon = (e) => this.setState({ coupon: e.target.value })
  sendCoupon = () => {
    this.props.RedeemCoupon({
      coupon_code: this.state.coupon,
      filling: this.state.fillingId,
      engine: this.props.payment_order.engine,
    })
  }

  onKeyPressCoupon = (e) => {
    e.preventDefault()
    if (e.target.value) {
      this.setState({ showToolTipCoupon: true })
    }
  }

  get renderContent() {
    const { error, fillingState, codeApproved, codeAmmount, payment_order } =
      this.props
    return (
      <div className="box spotlight">
        <div className="content-q">
          {!fillingState || !fillingState.last_valid_engine ? (
            <div>
              <Row>
                <div className="wrapper-text">
                  <h3 className="payment__validate push--top">
                    😔 Tu link de pago todavía no ha sido habilitado 😔
                  </h3>
                  <h3 className="payment__validate push--top">
                    Por favor contacta al equipo de soporte en el chat en vivo
                    para activarlo
                  </h3>
                </div>
              </Row>
            </div>
          ) : this.state.filling.status === 'paid' ? (
            <div>
              <Row>
                <div className="wrapper-text">
                  <h3 className="payment__validate push--top">
                    🎉 Tu pago ya ha sido realizado 🎉
                  </h3>
                  <h3 className="payment__validate push--top">
                    Te invitamos a descargar tu declaración
                  </h3>
                </div>
              </Row>
              <Col align="center">
                <Link
                  to="/dashboard/revisaypaga"
                  className="btn-primary-tributi payment"
                  type="submit"
                  color="gray"
                >
                  Ver declaración
                </Link>
              </Col>
            </div>
          ) : (
            <div>
              <Row>
                <div className="wrapper-text">
                  <h3 className="payment__total push--top">
                    El pago a Tributi por la elaboración de la declaración de
                    renta es&nbsp;
                    <span className="temporal__coupon__text">
                      ${formatPrice(this.props.amount)}
                    </span>
                  </h3>
                </div>
              </Row>
              <Row className="wrapper-inputs" gutter={8} justify="center">
                {codeApproved ? (
                  <Col span={12} className="col-md-offset-3">
                    <span className="temporal__coupon__text">
                      {' '}
                      Genial ahora tienes un descuento del&nbsp;
                      {codeAmmount * 100}%
                    </span>
                  </Col>
                ) : (
                  <Col span={12} className="col-md-offset-3">
                    <Row>
                      <span color-main="">Tengo un cupón</span>
                    </Row>
                    <Row>
                      <Tooltip
                        visible={this.state.showToolTipCoupon}
                        overlayClassName="tooltip-tributi"
                        placement="right"
                        title="Recuerda hacer clic en este botón para redimir tú cupón."
                      >
                        <Input
                          className="custom"
                          placeholder="Ingresa tu código aquí"
                          addonAfter={
                            <i onClick={this.sendCoupon.bind(this)}>Redimir</i>
                          }
                          value={this.state.coupon}
                          onChange={this.onChangeCoupon}
                          onKeyUp={(e) => this.onKeyPressCoupon(e)}
                        />
                      </Tooltip>
                      {error && <span className="payment__total">{error}</span>}
                    </Row>
                  </Col>
                )}
              </Row>
              <Row className="wrapper-buttons" gutter={16}>
                <Col span={11} align="end">
                  <Link
                    to="/assisted-plan"
                    className="btn-primary-tributi payment"
                    type="submit"
                    color="gray"
                  >
                    Volver
                  </Link>
                </Col>
                <Col span={11} offset={2}>
                  {payment_order && this.rendeFromForPayment()}
                  <button
                    className="btn-primary-tributi payment"
                    onClick={(e) => this.handleSubmit(e)}
                  >
                    Pagar ahora
                  </button>
                </Col>
              </Row>
            </div>
          )}
          <Row className="wrapper-sections">
            <Row>
              <Col span={8} align="center">
                {this.renderSectionInfo(1, '100% Correcta')}
              </Col>
              <Col span={8} align="center">
                {this.renderSectionInfo(2, 'Garantía de por vida')}
              </Col>
              <Col span={8} align="center">
                {this.renderSectionInfo(3, 'Devolución de dinero')}
              </Col>
            </Row>
          </Row>
        </div>
      </div>
    )
  }

  rendeFromForPayment() {
    const { payment_order } = this.props

    return (
      <form
        method="post"
        action={payment_order.gateway_url}
        acceptCharset="UTF-8"
        ref={this.formPayment}
      >
        <input
          name="merchantId"
          type="hidden"
          value={payment_order.merchantId}
        />
        <input
          name="accountId"
          type="hidden"
          value={payment_order.account_id}
        />
        <input
          name="referenceCode"
          type="hidden"
          value={payment_order.reference_code}
        />
        <input name="amount" type="hidden" value={payment_order.amount} />
        <input name="currency" type="hidden" value={payment_order.currency} />
        <input name="signature" type="hidden" value={payment_order.signature} />
        <input
          name="description"
          type="hidden"
          value={payment_order.description}
        />
        <input name="tax" type="hidden" value={payment_order.tax} />
        <input
          name="taxReturnBase"
          type="hidden"
          value={payment_order.tax_return_base}
        />
        <input name="test" type="hidden" value={payment_order.test} />
        <input
          name="buyerEmail"
          type="hidden"
          value={payment_order.buyer_email}
        />
        <input
          name="responseUrl"
          type="hidden"
          value={window.location.origin.concat(payment_order.response_url)}
        />
        <input
          name="confirmationUrl"
          type="hidden"
          value={payment_order.confirmation_url}
        />
      </form>
    )
  }

  renderSectionInfo(type, title) {
    switch (type) {
      case 1: {
        return (
          <div className={`wrapper-section-${type}`}>
            <Row>
              <img
                src={`/images/payment-img-${type}.png`}
                alt={`icon-${type}`}
              />
              <h4 none-margin="">{title}</h4>
            </Row>
            <Row className="wrapper-section-content">
              <span color-gray="">
                Nuestra plataforma tributaria certificada está siempre al día
                con toda la legislación colombiana. ¡No te estreses! La
                declaración de renta está 100% correcta. ¡Garantizado!
              </span>
            </Row>
          </div>
        )
      }
      case 3: {
        return (
          <div className={`wrapper-section-${type}`}>
            <Row>
              <img
                src={`/images/payment-img-${type}.png`}
                alt={`icon-${type}`}
              />
              <h4 none-margin="">{title}</h4>
            </Row>
            <Row className="wrapper-section-content">
              <span color-gray="">
                Te ofrecemos una garantía absoluta de satisfacción. Si por
                alguna razón, no importa cuál, no estás totalmente satisfecho
                con el servicio, te devolvemos el dinero inmediatamente. ¡Total
                satisfacción!
              </span>
            </Row>
          </div>
        )
      }
      default: {
        return (
          <div className={`wrapper-section-${type}`}>
            <Row>
              <img
                src={`/images/payment-img-${type}.png`}
                alt={`icon-${type}`}
              />
              <h4 none-margin="">{title}</h4>
            </Row>
            <Row className="wrapper-section-content">
              <span color-gray="">
                Si algún día necesitas cualquier tipo de soporte para la
                declaración de renta, nuestro equipo tributario especializado te
                brindará asesoría personalizada hasta solucionar todas tus dudas
                ¡Atención ilimitada!
              </span>
            </Row>
          </div>
        )
      }
    }
  }

  render() {
    if (
      this.state.filling.order_info &&
      this.state.filling.order_info.status === PAYMENT_STATUS.APPROVED
    ) {
      return <Navigate replace to="/payment/success" />
    } else if (
      this.state.filling.order_info &&
      this.state.filling.order_info.status === PAYMENT_STATUS.PENDING
    ) {
      return (
        <Navigate
          replace
          to={`/payment/pending/${this.state.filling.order_info.id}`}
        />
      )
    }
    return (
      <div className="wrapper-box">
        <div className="wrapper-payment q-container-extend">
          <div className="row">
            <div className="col-sm-8 content-title col-md-offset-2">
              <h2 className="title-main">
                <img
                  className="icon icon-happy"
                  src="/images/icons/icon-happy.png"
                />
                <span>{this.state.name}, Por favor realiza tu pago...</span>
              </h2>
            </div>
            <div className="col-sm-8 col-md-offset-2 q-container-body content">
              {this.renderContent}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PaymentDirect
