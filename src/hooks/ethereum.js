import { useState, useMemo, useCallback, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'

import {
  injected as injectedConnector,
  network as networkConnector,
} from '../connectors'
import { getContract, getGasPrice } from '../utils'
import { READ_ONLY } from '../constants'
import abiTCDP from '../constants/abis/tCDP.json'
import abiERC20 from '../constants/abis/erc20.json'

export function useContract(address, abi, withSignerIfPossible = true) {
  const { account, library } = useWeb3React()

  return useMemo(() => {
    try {
      return getContract(
        address,
        abi,
        library,
        withSignerIfPossible ? account : undefined,
      )
    } catch {
      return null
    }
  }, [address, abi, library, account, withSignerIfPossible])
}

export function useContractRO(address, abi) {
  const { library } = useWeb3React(READ_ONLY)

  return useMemo(() => {
    try {
      return getContract(address, abi, library)
    } catch {
      return null
    }
  }, [address, abi, library])
}

export function useGasPrice() {
  const [level, setLevel] = useState('fast')
  const getPrice = useCallback(() => getGasPrice(level), [level])

  return { getPrice, setLevel }
}

export function useEagerConnect() {
  const { activate, active, setError } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injectedConnector.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injectedConnector, undefined, true).catch((err) => {
          setError(err)
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, [activate, setError])

  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React()

  useEffect(() => {
    const { ethereum } = window
    if (ethereum && !active && !error && !suppress) {
      const handleNetworkChanged = (networkId) => {
        activate(injectedConnector)
      }
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          activate(injectedConnector)
        }
      }

      if (ethereum.on) {
        ethereum.on('networkChanged', handleNetworkChanged)
        ethereum.on('accountsChanged', handleAccountsChanged)
      }

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('networkChanged', handleNetworkChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }

    return () => {}
  }, [active, error, suppress, activate])
}

export function useReadOnlyConnect() {
  const { chainId, active } = useWeb3React()
  const {
    active: activeReadOnly,
    connector: connectorReadOnly,
    activate: activateReadOnly,
  } = useWeb3React(READ_ONLY)

  const changeChainId = useCallback(
    (id) => {
      if (connectorReadOnly === networkConnector) {
        connectorReadOnly.changeChainId(id)
      }
    },
    [connectorReadOnly],
  )

  useEffect(() => {
    activateReadOnly(networkConnector)
  }, [activateReadOnly])

  // chainId of read-only web3 is followed by injected connector
  useEffect(() => {
    if (active && activeReadOnly) {
      changeChainId(chainId)
    }
  }, [active, activeReadOnly, chainId, changeChainId])

  return changeChainId
}

export function useEthBalance(address, ...reloadSignals) {
  const { library } = useWeb3React(READ_ONLY)
  const [balance, setBalance] = useState(new BigNumber(0))
  useEffect(() => {
    if (!library || !address) {
      return
    }
    library
      .getBalance(address)
      .then((newBalance) => setBalance(new BigNumber(newBalance.toString())))
  }, [address, library, ...reloadSignals]) // eslint-disable-line react-hooks/exhaustive-deps
  return balance
}

export function useCurrentBlockNumber() {
  const { library } = useWeb3React(READ_ONLY)
  const [blockNumber, setBlockNumber] = useState(new BigNumber(0))
  useEffect(() => {
    if (!library) {
      return
    }
    const interval = setInterval(() => {
      library
        .getBlockNumber()
        .then((newBlockNumber) =>
          setBlockNumber(new BigNumber(newBlockNumber.toString())),
        )
    }, 15000) // 15 second for a block
    return () => clearInterval(interval)
  }, [library])
  return blockNumber
}

export function useContractState(
  address,
  abi,
  fnsToWatch = [],
  ...reloadSignals
) {
  const contract = useContractRO(address, abi)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)
  const [contactState, setContactState] = useState({})

  useEffect(() => {
    if (!contract) {
      setError('Contract not available')
      setContactState({})
      return () => {}
    }
    Promise.all(
      fnsToWatch.map((fn) =>
        fn.name ? contract[fn.name](...(fn.args || [])) : contract[fn](),
      ),
    )
      .then((result) => {
        setContactState(
          fnsToWatch.reduce(
            (newContactState, fn, i) => ({
              ...newContactState,
              [fn.name ? fn.name : fn]: result[i]._isBigNumber
                ? new BigNumber(result[i].toString())
                : result[i],
            }),
            {},
          ),
        )
        setError(undefined)
      })
      .catch((error) => {
        if (error.code && error.code === 'CALL_EXCEPTION') {
          return
        }
        setContactState({})
        setError(error)
      })
      .finally(setLoading.bind(null, false))
  }, [contract, address, abi, ...reloadSignals]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    loading,
    error,
    ...contactState,
  }
}

export function useTCDPState(address, ...reloadSignals) {
  const contractState = useContractState(
    address,
    abiTCDP,
    ['collateral', 'debt', 'debtRatio'],
    ...reloadSignals,
  )
  return {
    ...contractState,
    collateralRatio: contractState.debtRatio
      ? new BigNumber(10).pow(new BigNumber(18)).div(contractState.debtRatio)
      : undefined,
  }
}

export function useERC20State(
  address,
  ownerAddress,
  approvedAddress,
  ...reloadSignals
) {
  return useContractState(
    address,
    abiERC20,
    [
      'totalSupply',
      ...(ownerAddress ? [{ name: 'balanceOf', args: [ownerAddress] }] : []),
      ...(ownerAddress && approvedAddress
        ? [{ name: 'allowance', args: [ownerAddress, approvedAddress] }]
        : []),
    ],
    ownerAddress,
    ...reloadSignals,
  )
}
