import BigNumber from 'bignumber.js'

const READ_ONLY = 'READ_ONLY'

// ERC20_STATUS defines ERC20 status for account
const ERC20_STATUS = {
  OK: 'OK',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_ALLOWANCE: 'INSUFFICIENT_ALLOWANCE',
}

// TCDP_STATUS defines tCDP status
const TCDP_STATUS = {
  OK: 'OK',
  COLLATERALIZATION_RATIO_TOO_HIGH: 'COLLATERALIZATION_RATIO_TOO_HIGH',
  COLLATERALIZATION_RATIO_TOO_LOW: 'COLLATERALIZATION_RATIO_TOO_LOW',
}

// UPPER_COLLATERALIZATION_RATIO defines upper bound of collateralization ratio (1 / 0.35 ~= 286%)
const UPPER_COLLATERALIZATION_RATIO = new BigNumber(1).div(new BigNumber(0.35))
// IDEAL_COLLATERALIZATION_RATIO defines ideal value of collateralization ratio (1 / 0.40 ~= 250%)
const IDEAL_COLLATERALIZATION_RATIO = new BigNumber(1).div(new BigNumber(0.4))
// LOWER_COLLATERALIZATION_RATIO defines upper bound of collateralization ratio (1 / 0.45 ~= 222%)
const LOWER_COLLATERALIZATION_RATIO = new BigNumber(1).div(new BigNumber(0.45))

// ZERO_UINT256 defines zero value for uint256 (0)
const ZERO_UINT256 = new BigNumber(0)
// MAX_UINT256 defines max value for uint256 (2^256-1)
const MAX_UINT256 = new BigNumber(2).pow(256).minus(new BigNumber(1))

// ETHER_DECIMAL defines 1 ether in wei (10^18)
const ETHER_DECIMAL = new BigNumber(10).pow(18)

// GAS_FEE_RESERVATION defines reservation gas fee (0.02 ether),
// useful when user tries to send all balance in a tx
const GAS_FEE_RESERVATION = new BigNumber(0.02).times(ETHER_DECIMAL)

export {
  READ_ONLY,
  ERC20_STATUS,
  TCDP_STATUS,
  UPPER_COLLATERALIZATION_RATIO,
  IDEAL_COLLATERALIZATION_RATIO,
  LOWER_COLLATERALIZATION_RATIO,
  ETHER_DECIMAL,
  ZERO_UINT256,
  MAX_UINT256,
  GAS_FEE_RESERVATION,
}
