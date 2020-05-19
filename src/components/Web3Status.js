import React, { useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import Dialog from './Dialog'
import { injected, walletconnect } from '../connectors'
import { shortenAddress } from '../utils'
import metamaskImage from '../assets/metamask.png'
import walletconnectImage from '../assets/walletconnect.png'

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

const Title = styled.h1`
  margin: 0;
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
`

const LoginButtonGroup = styled.menu`
  margin: 0;
  padding: 20px;

  > *:not(:first-child) {
    margin-top: 14px;
  }
`

const LoginButton = styled.button.attrs(() => ({ type: 'button' }))`
  width: 100%;
  height: 2.5rem;
  padding: 0;
  border: 1px solid #808080;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.white};
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  > img {
    margin-right: 8px;
    width: 20px;
    height: 20px;
  }
`

export default function Web3Status() {
  const { account, error, activate } = useWeb3React()

  const [isOpen, setIsOpen] = useState(false)
  const toggleIsOpen = useCallback(() => setIsOpen(!isOpen), [isOpen])

  const connectInjected = useCallback(async () => {
    try {
      await activate(injected, undefined, true)
      toggleIsOpen()
    } catch (err) {
      console.error(err)
    }
  }, [activate, toggleIsOpen])

  const connectWalletConnect = useCallback(async () => {
    try {
      await activate(walletconnect)
      toggleIsOpen()
    } catch (err) {
      console.error(err)
    }
  }, [activate, toggleIsOpen])

  const renderButtonText = () => {
    if (account) {
      return shortenAddress(account)
    } else if (error) {
      return 'WRONG NETWORK'
    } else {
      return 'LOGIN'
    }
  }

  return (
    <>
      <StatusButton onClick={toggleIsOpen}>{renderButtonText()}</StatusButton>
      <Dialog isOpen={isOpen} onDismiss={toggleIsOpen}>
        <Title>Connect Your Wallet</Title>
        <LoginButtonGroup>
          <LoginButton onClick={connectInjected}>
            <img src={metamaskImage} alt='metamask' />
            METAMASK
          </LoginButton>
          <LoginButton onClick={connectWalletConnect}>
            <img src={walletconnectImage} alt='walletconnect' />
            WALLET CONNECT
          </LoginButton>
        </LoginButtonGroup>
      </Dialog>
    </>
  )
}
