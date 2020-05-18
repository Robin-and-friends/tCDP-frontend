import React from 'react'
import styled from 'styled-components'
import { ReactComponent as Logo } from '../assets/logo.svg'
import Web3Status from './Web3Status'

const HeaderWrapper = styled.header`
  width: 100%;
  max-width: 1232px;
  margin: 0 auto;
  padding: 32px 16px;
  display: flex;
  justify-content: space-between;
`

export default function Header() {
  return (
    <HeaderWrapper>
      <a href='/'>
        <Logo />
      </a>
      <Web3Status />
    </HeaderWrapper>
  )
}
