import React from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  useEagerConnect,
  useInactiveListener,
  useReadOnlyConnect,
} from '../hooks/ethereum'

export default function Web3Manager(props) {
  const { children } = props
  const { active, error } = useWeb3React()

  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)
  useReadOnlyConnect()

  if (!active && error instanceof UnsupportedChainIdError) {
    return <h1>Wrong Network</h1>
  } else {
    return children
  }
}
