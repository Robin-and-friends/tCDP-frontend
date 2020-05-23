const infuraProjectId = process.env.REACT_APP_INFURA_PROJECT_ID || ''

const contractAddress = {
  1: {
    dai:
      process.env.REACT_APP_CONTRACT_ADDRESS_1_DAI ||
      '0x6b175474e89094c44da98b954eedeac495271d0f',
    tCDP: process.env.REACT_APP_CONTRACT_ADDRESS_1_TCDP || '',
    flashMigrator:
      process.env.REACT_APP_CONTRACT_ADDRESS_1_FLASH_MIGRATOR || '',
    soloMargin:
      process.env.REACT_APP_CONTRACT_ADDRESS_1_SOLO_MARGIN ||
      '0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e',
  },
  4: {
    dai:
      process.env.REACT_APP_CONTRACT_ADDRESS_4_DAI ||
      '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea',
    tCDP:
      process.env.REACT_APP_CONTRACT_ADDRESS_4_TCDP ||
      '0xae5e23e7c1820E10c8aB850B456D36aED6225bff',
    flashMigrator:
      process.env.REACT_APP_CONTRACT_ADDRESS_4_FLASH_MIGRATOR || '',
    soloMargin: process.env.REACT_APP_CONTRACT_ADDRESS_4_SOLO_MARGIN || '',
  },
}

const externalLink = {
  learnRebalancing:
    process.env.REACT_APP_EXTERNAL_LINK_LEARN_REBALANCING ||
    'https://tokenized-cdp.netlify.app',
  learnFlashMigrating:
    process.env.REACT_APP_EXTERNAL_LINK_LEARN_FLASH_MIGRATING ||
    'https://tokenized-cdp.netlify.app',
}

export { infuraProjectId, contractAddress, externalLink }
