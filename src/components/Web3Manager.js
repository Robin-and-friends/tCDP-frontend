import React from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import styled from 'styled-components'
import {
  useEagerConnect,
  useInactiveListener,
  useReadOnlyConnect,
} from '../hooks/ethereum'
import { ReactComponent as WrongNetworkIcon } from '../assets/wrong-network.svg'

const Container = styled.div`
  width: 100%;
  height: 80vh;
  max-width: 1232px;
  margin: 0 auto;
  margin-top: 12px;
  padding: 0 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;

  > * {
    flex: 1 0 512px;
  }

  > * {
    margin: 16px;
  }
`

const Block = styled.section`
  padding: 32px 40px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 12px 30px -12px rgba(183, 197, 204, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:not(:first-child) {
    margin-top: 32px;
  }

  > h1 {
    margin: 1em 0 0 0;
  }
  > svg {
    width: 30%;
  }
`

export default function Web3Manager(props) {
  const { children } = props
  const { active, error } = useWeb3React()

  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)
  useReadOnlyConnect()

  if (!active && error instanceof UnsupportedChainIdError) {
    return (
      <Container>
        <Block>
          <WrongNetworkIcon />
          <h1>Currently tCDP only lives on Ethereum mainnet</h1>
          <p>Please change network to mainnet</p>
        </Block>
      </Container>
    )
  } else {
    return children
  }
}
