import React from 'react'
import styled from 'styled-components'

const StatusButton = styled.button`
  min-width: 152px;
  height: 48px;
  padding: 0 24px;
  border: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: 24px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.white};
  font-size: 18px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

export default function Web3Status() {
  return <StatusButton>LOGIN</StatusButton>
}
