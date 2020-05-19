import React, { useState } from 'react'
import styled from 'styled-components'

const InputBox = styled.div`
  width: 100%;
  height: 48px;
  padding: 0 20px;
  border: 1px solid
    ${({ theme, active }) => (active ? theme.colors.primary : 'transparent')};
  border-radius: 8px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.white : '#EBEFF2'};
  display: flex;
  align-items: center;
`

const InputBase = styled.input`
  flex: 1 1 100%;
  width: 100%;
  border: 0;
  padding: 0;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary900};
  font-size: 18px;

  &:focus {
    outline: none;
  }
`

const MaxButton = styled.button.attrs(() => ({ type: 'button' }))`
  margin-left: 10px;
  border: 0;
  padding: 0;
  background-color: transparent;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

export default function AmountInput(props) {
  const {
    placeholder,
    value = '',
    onChange = () => {},
    onMax = () => {},
  } = props

  const [isFocus, setIsFocus] = useState(false)

  return (
    <div>
      <InputBox active={isFocus}>
        <InputBase
          type='number'
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        <MaxButton onClick={onMax}>Max</MaxButton>
      </InputBox>
    </div>
  )
}
