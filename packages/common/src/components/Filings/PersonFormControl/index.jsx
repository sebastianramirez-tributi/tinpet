import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Input, Select } from 'antd'
// Coverage things
import Form from 'antd/lib/form'

const { Item: FormItem } = Form

// Added this since antd4 is calling onBlur and onFocus
// recursvelly and it's generating a input lag when it's focused
// and blurred
const noop = () => {}

const PersonFormControl = forwardRef(
  ({ controls, options, getFieldProps, ...control }, ref) => {
    if (controls) {
      return (
        <Input.Group compact>
          {controls.map((current, index) => (
            <PersonFormControl
              key={current.name || index}
              getFieldProps={getFieldProps}
              {...getFieldProps(current.name, { rules: current.rules })}
              {...current}
            />
          ))}
        </Input.Group>
      )
    }

    const { name, rules, id, onChange, placeholder, value } = control
    return (
      <FormItem name={name} rules={rules} noStyle>
        {options ? (
          <Select
            id={id}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            ref={ref}
            value={value}
          >
            {options.map(({ value, label }) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <Input
            id={id}
            onBlur={noop}
            onChange={onChange}
            onFocus={noop}
            placeholder={placeholder}
            ref={ref}
            value={value}
          />
        )}
      </FormItem>
    )
  }
)

PersonFormControl.displayName = 'PersonFormControl'

PersonFormControl.propTypes = {
  controls: PropTypes.arrayOf(PropTypes.shape({})),
  options: PropTypes.arrayOf(PropTypes.any),
  getFieldProps: PropTypes.func.isRequired,
}

export default PersonFormControl
