import { NetworkConnector } from '@web3-react/network-connector'
import { InjectedConnector } from './Injected'
import { WalletConnectConnector } from './Walletconnect'

const POLLING_INTERVAL = 8000

const RPC_URLS = {
  1: 'https://mainnet.easydai.app/nZHy9xQ5QJslmP2pCvGSH7JDLxHylM',
  4: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN || ''}`,
}

// TODO: Change defaultChainId to 1
const supportedChainIds = [4]
let defaultChainId = 4

// if (process.env.NODE_ENV === 'development') {
//   supportedChainIds.concat([4])
//   defaultChainId = 4
// }

export const injected = new InjectedConnector({ supportedChainIds })

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
  defaultChainId,
  pollingInterval: POLLING_INTERVAL,
})

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})
