import notification from 'antd/lib/notification'

const NotificationAntd = (props) => {
  notification[props.type]({
    key: props.key,
    duration: props.duration,
    message: props.message,
    placement: props.placement,
    description: props.description,
    className: props.className,
    style: props.style,
  })
}

export default NotificationAntd
