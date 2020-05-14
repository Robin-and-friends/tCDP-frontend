import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import UncheckedJsonRpcSigner from './signer'

export function safeAccess(object, path) {
  return object
    ? path.reduce(
        (accumulator, currentValue) =>
          accumulator && accumulator[currentValue]
            ? accumulator[currentValue]
            : null,
        object,
      )
    : null
}

export function isAddress(address) {
  return ethers.utils.isAddress(address)
}

export function shortenAddress(address, digits = 4) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${address.substring(0, digits + 2)}...${address.substring(
    42 - digits,
  )}`
}

export function shortenTransactionHash(hash, digits = 6) {
  return `${hash.substring(0, digits + 2)}...${hash.substring(66 - digits)}`
}

export function getNetworkName(networkId) {
  switch (networkId) {
    case 1: {
      return 'Main Network'
    }
    case 3: {
      return 'Ropsten'
    }
    case 4: {
      return 'Rinkeby'
    }
    case 5: {
      return 'Görli'
    }
    case 42: {
      return 'Kovan'
    }
    default: {
      return 'correct network'
    }
  }
}

const ETHERSCAN_PREFIXES = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
}

export function getEtherscanLink(networkId, data, type) {
  const prefix = `https://${
    ETHERSCAN_PREFIXES[networkId] || ETHERSCAN_PREFIXES[1]
  }etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export async function getGasPrice() {
  const response = await fetch('https://ethgasstation.info/json/ethgasAPI.json')
  const data = await response.json()
  const gasPrice = new BigNumber(data.fast).div(10).times(1e9) // convert unit to wei
  return gasPrice
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account
    ? new UncheckedJsonRpcSigner(library.getSigner(account))
    : library
}

export function getContract(address, abi, library, account) {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new ethers.Contract(
    address,
    abi,
    getProviderOrSigner(library, account),
  )
}

export function amountFormatter(amount, baseDecimals, displayDecimals = 4) {
  if (
    baseDecimals > 18 ||
    displayDecimals > 18 ||
    displayDecimals > baseDecimals
  ) {
    throw Error(
      `Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`,
    )
  }

  if (!amount) {
    return undefined
  }

  if (amount.isZero()) {
    return '0'
  }

  const x = new BigNumber(amount.toString())
  const amountDecimals = 18 - x.decimalPlaces(0).precision(true) + 1

  return x
    .div(new BigNumber(10).pow(new BigNumber(baseDecimals)))
    .toFixed(
      amountDecimals >= displayDecimals ? amountDecimals + 1 : displayDecimals,
    )
}

export function percentageFormatter(amount, baseDecimals, displayDecimals = 2) {
  if (
    baseDecimals > 18 ||
    displayDecimals > 18 ||
    displayDecimals > baseDecimals
  ) {
    throw Error(
      `Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`,
    )
  }

  if (!amount) {
    return undefined
  }

  if (!BigNumber.isBigNumber(amount)) {
    amount = new BigNumber(amount)
  }

  if (amount.isZero()) {
    return '0'
  }

  return `${amount
    .div(new BigNumber(10).pow(new BigNumber(baseDecimals)))
    .times(100)
    .toFixed(displayDecimals)} %`
}
