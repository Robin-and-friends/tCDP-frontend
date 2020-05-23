import React from 'react'
import styled from 'styled-components'
import { ReactComponent as Logo } from '../assets/logo.svg'
import Web3Status from './Web3Status'

const HeaderWrapper = styled.header`
  width: 100%;
  max-width: 1232px;
  margin: 0 auto;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledLogo = styled(Logo)`
  width: 180px;

  ${({ theme }) => theme.mediaQuery.md`
    width: 330px
  `}
`

export default function Header() {
  return (
    <HeaderWrapper>
      <a href='/'>
        <StyledLogo />
      </a>
      <Web3Status />
    </HeaderWrapper>
  )
}
