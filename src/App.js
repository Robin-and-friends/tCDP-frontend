import React, { Suspense } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import { ethers } from 'ethers'

import Home from './pages/Home'
import Header from './components/Header'
import Web3Manager from './components/Web3Manager'
import ThemeProvider, { GlobalStyle } from './themes'
import { READ_ONLY } from './constants'

const Web3ReadOnlyProvider = createWeb3ReactRoot(READ_ONLY)

function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 10000
  return library
}

function Router() {
  return (
    <Suspense fallback={null}>
      <Header />
      <BrowserRouter>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </Suspense>
  )
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReadOnlyProvider getLibrary={getLibrary}>
        <Web3Manager>
          <ThemeProvider>
            <GlobalStyle />
            <Router />
          </ThemeProvider>
        </Web3Manager>
      </Web3ReadOnlyProvider>
    </Web3ReactProvider>
  )
}

export default App
