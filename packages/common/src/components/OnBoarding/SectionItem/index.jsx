import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  CheckCircleOutlined,
  QuestionOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import Tooltip from 'antd/lib/tooltip'
import { OBJECT_ACTIVE_AMOUNT, STATUS } from '../../../constants/onboarding'
import Counter from '../Counter'
import { Item, ItemContent, Image, Text, Help } from './style'

const ICON_BY_STATUS = {
  complete: CheckCircleOutlined,
  partial: ToolOutlined,
}

const TOOLTIP_BY_STATUS = {
  complete: '',
  partial: 'Información pendiente',
}

class SectionItem extends Component {
  constructor(props) {
    super(props)
    const { item } = props
    const {
      group_instances: groupInstances,
      has_onboarding: hasOnboarding,
      status,
    } = item

    this.state = {
      data: item,
      showQRC: false,
      dataQRC: null,
      showCounter: groupInstances.length > 0 && !hasOnboarding,
      status:
        status === STATUS.NEW && groupInstances.length
          ? STATUS.COMPLETE
          : status,
    }

    this.setActiveCounter = this.setActiveCounter.bind(this)
    this.handleIncrease = this.handleIncrease.bind(this)
    this.handleDecrease = this.handleDecrease.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    const { item } = props
    if (item !== state.data) {
      return { data: item }
    }
    return null
  }

  onClickItem(item) {
    if (item.has_onboarding) {
      this.props.onShowQRC(item)
      window.scrollTo(0, 0)
    } else {
      this.setState({ showCounter: true, status: STATUS.COMPLETE })
    }
  }

  setActiveCounter(value, groupStatus) {
    this.setState({ status: groupStatus, showCounter: value })
  }

  handleHelpClick(evt) {
    evt.stopPropagation()
  }

  async handleIncrease(count) {
    const { onIncrease } = this.props
    const { data } = this.state
    await onIncrease(data, count)
    if (count === OBJECT_ACTIVE_AMOUNT) {
      this.setActiveCounter(true, STATUS.COMPLETE)
    }
  }

  async handleDecrease(count) {
    const { onDecrease } = this.props
    const { data } = this.state
    const instanceId = data.group_instances[count]
    await onDecrease(instanceId, count)
    if (!count) {
      this.setActiveCounter(false)
    }
  }

  render() {
    const { iconsPath, setRefListGroup } = this.props
    const { data, showCounter, status } = this.state
    const { code } = data || {}
    const HelpIcon = ICON_BY_STATUS[status] || QuestionOutlined
    const tooltip = TOOLTIP_BY_STATUS[status] ?? data.help.description

    return (
      <Fragment key={code}>
        <div
          id={code}
          ref={(ref) => setRefListGroup(ref, data)}
          data-testid="section-item"
        >
          <Item
            status={status}
            className="item_container"
            onClick={() => this.onClickItem(data)}
          >
            <Tooltip placement="top" title={tooltip}>
              <Help onClick={this.handleHelpClick} status={status}>
                <HelpIcon />
              </Help>
            </Tooltip>
            <ItemContent>
              <Image
                style={{
                  backgroundImage: `url(${iconsPath}${code}.svg)`,
                }}
              />
              <Text>{data.text}</Text>
            </ItemContent>
            {showCounter && (
              <Counter
                instancesLimit={data.instances_limit}
                instanceCounter={data.group_instances.length}
                onIncrease={this.handleIncrease}
                onDecrease={this.handleDecrease}
              />
            )}
          </Item>
        </div>
      </Fragment>
    )
  }
}

SectionItem.propTypes = {
  iconsPath: PropTypes.string.isRequired,
  item: PropTypes.shape({
    group_instances: PropTypes.arrayOf(PropTypes.string),
    has_onboarding: PropTypes.bool,
    status: PropTypes.string,
  }).isRequired,
  onDecrease: PropTypes.func.isRequired,
  onIncrease: PropTypes.func.isRequired,
  onShowQRC: PropTypes.func.isRequired,
  setRefListGroup: PropTypes.func.isRequired,
}

export default SectionItem
