import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CounterStyle, ButtonsWrapper } from './style'

function Counter({ instanceCounter, instancesLimit, onDecrease, onIncrease }) {
  const [state, setState] = useState({
    count: instanceCounter,
    loading: false,
  })
  const [didMount, setDidMount] = useState(false)
  const { count, loading } = state

  const incrementItem = useCallback(async () => {
    if (count < instancesLimit) {
      const updatedCount = count + 1
      setState((currentState) => ({
        ...currentState,
        count: updatedCount,
        loading: true,
      }))
      await onIncrease(updatedCount)
      setState((currentState) => ({
        ...currentState,
        loading: false,
      }))
    }
  }, [count, instancesLimit, onIncrease])

  const decreaseItem = useCallback(async () => {
    if (count > 0) {
      const updatedCount = count - 1
      setState((currentState) => ({
        ...currentState,
        count: updatedCount,
        loading: true,
      }))
      await onDecrease(updatedCount)
      // this is because when the conter gets to zero, it will be unmounted
      // and this state update should n't apply in this case.
      if (updatedCount > 0) {
        setState((currentState) => ({
          ...currentState,
          loading: false,
        }))
      }
    }
  }, [count, onDecrease])

  /**
   * Run when the component is mounted, that's why
   * we don't need depenencies
   * This effect initializes the counter when there is
   * no data in the object, so it creates the first instance
   */
  useEffect(() => {
    if (!count && !didMount) {
      incrementItem()
    }
    setDidMount(true)
  }, [didMount, count, incrementItem])

  return (
    <CounterStyle>
      <span>Cantidad:</span>
      <ButtonsWrapper>
        <button
          className="btn_action"
          onClick={decreaseItem}
          disabled={loading}
          data-testid="decrease-button"
        >
          <div className="counter_icon"> - </div>
        </button>
        <h5>{count}</h5>
        <button
          className="btn_action"
          onClick={incrementItem}
          disabled={loading}
          data-testid="increase-button"
        >
          <div> + </div>
        </button>
      </ButtonsWrapper>
    </CounterStyle>
  )
}

Counter.propTypes = {
  instanceCounter: PropTypes.number.isRequired,
  instancesLimit: PropTypes.number.isRequired,
  onDecrease: PropTypes.func.isRequired,
  onIncrease: PropTypes.func.isRequired,
}

export default Counter
