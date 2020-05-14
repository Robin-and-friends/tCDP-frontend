import { NetworkConnector } from '@web3-react/network-connector'
import { InjectedConnector } from './Injected'
import { WalletConnectConnector } from './Walletconnect'

const POLLING_INTERVAL = 8000

const RPC_URLS = {
  1: 'https://mainnet.easydai.app/nZHy9xQ5QJslmP2pCvGSH7JDLxHylM',
  42: `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN || ''}`,
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 42],
})

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 42: RPC_URLS[42] },
  defaultChainId: 1,
  pollingInterval: POLLING_INTERVAL,
})

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})
