import { AbstractConnector } from '@web3-react/abstract-connector'
import invariant from 'tiny-invariant'
import WalletConnectProvider from './WalletConnectProvider'

const __DEV__ = process.env.NODE_ENV !== 'production'

export const URI_AVAILABLE = 'URI_AVAILABLE'

export class UserRejectedRequestError extends Error {
  constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

export class WalletConnectConnector extends AbstractConnector {
  constructor({ rpc, bridge, qrcode, pollingInterval }) {
    invariant(
      Object.keys(rpc).length === 1,
      '@walletconnect/web3-provider is broken with >1 chainId, please use 1',
    )
    super({ supportedChainIds: Object.keys(rpc).map((k) => Number(k)) })

    this.rpc = rpc
    this.bridge = bridge
    this.qrcode = qrcode
    this.pollingInterval = pollingInterval

    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
  }

  handleChainChanged(chainId) {
    if (__DEV__) {
      console.log("Handling 'chainChanged' event with payload", chainId)
    }
    this.emitUpdate({ chainId })
  }

  handleAccountsChanged(accounts) {
    if (__DEV__) {
      console.log("Handling 'accountsChanged' event with payload", accounts)
    }
    this.emitUpdate({ account: accounts[0] })
  }

  handleDisconnect() {
    if (__DEV__) {
      console.log("Handling 'disconnect' event")
    }
    this.emitDeactivate()
    // we have to do this because of a @walletconnect/web3-provider bug
    if (this.walletConnectProvider) {
      this.walletConnectProvider.stop()
      this.walletConnectProvider.removeListener(
        'chainChanged',
        this.handleChainChanged,
      )
      this.walletConnectProvider.removeListener(
        'accountsChanged',
        this.handleAccountsChanged,
      )
      this.walletConnectProvider = undefined
    }

    this.emitDeactivate()
  }

  async activate() {
    if (!this.walletConnectProvider) {
      this.walletConnectProvider = new WalletConnectProvider({
        bridge: this.bridge,
        rpc: this.rpc,
        qrcode: this.qrcode,
        pollingInterval: this.pollingInterval,
      })
      // only doing this here because this.walletConnectProvider.wc doesn't have a removeListener function...
      this.walletConnectProvider.wc.on('disconnect', this.handleDisconnect)
    }

    this.walletConnectProvider.on('chainChanged', this.handleChainChanged)
    this.walletConnectProvider.on('accountsChanged', this.handleAccountsChanged)

    // ensure that the uri is going to be available, and emit an event if there's a new uri
    if (!this.walletConnectProvider.wc.connected) {
      await this.walletConnectProvider.wc.createSession({
        chainId: this.walletConnectProvider.chainId,
      })
      this.emit(URI_AVAILABLE, this.walletConnectProvider.wc.uri)
    }

    const account = await this.walletConnectProvider
      .enable()
      .catch((error) => {
        // TODO ideally this would be a better check
        if (error.message === 'User closed WalletConnect modal') {
          throw new UserRejectedRequestError()
        }

        throw error
      })
      .then((accounts) => accounts[0])

    return { provider: this.walletConnectProvider, account }
  }

  async getProvider() {
    return this.walletConnectProvider
  }

  async getChainId() {
    return this.walletConnectProvider.send('eth_chainId')
  }

  async getAccount() {
    return this.walletConnectProvider
      .send('eth_accounts')
      .then((accounts) => accounts[0])
  }

  deactivate() {
    if (this.walletConnectProvider) {
      this.walletConnectProvider.stop()
      this.walletConnectProvider.removeListener(
        'chainChanged',
        this.handleChainChanged,
      )
      this.walletConnectProvider.removeListener(
        'accountsChanged',
        this.handleAccountsChanged,
      )
    }
  }

  async close() {
    this.walletConnectProvider.wc.killSession()
  }
}
