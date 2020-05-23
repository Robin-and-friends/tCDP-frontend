import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import AmountInput from './AmountInput'
import { useContract } from '../hooks/ethereum'
import {
  DUST,
  TCDP_STATUS,
  ZERO_UINT256,
  MAX_UINT256,
  GAS_FEE_RESERVATION,
  ERC20_STATUS,
  IDEAL_COLLATERALIZATION_RATIO,
} from '../constants'
import { amountFormatter, bigToHex, etherToWei, weiToEther } from '../utils'
import abiTCDP from '../constants/abis/tCDP.json'
import abiERC20 from '../constants/abis/erc20.json'

const PanelWrapper = styled.section`
  border-radius: 8px;
  background-color: #f8f9fa;
`

const Tabs = styled.div`
  height: 56px;
  display: flex;
`

const Tab = styled.button`
  flex: 1;
  border: 0;
  border-bottom: 1px solid
    ${({ active, theme }) => (active ? theme.colors.primary : 'transparent')};
  background-color: ${({ active }) => (active ? '#FFFFFF' : 'transparent')};
  background: ${({ active }) =>
    active
      ? 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1) 50%)'
      : 'transparent'};
  color: ${({ active, theme }) => (active ? theme.colors.primary : '#B3B3B3')};
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  ${({ theme }) => theme.mediaQuery.md`
    font-size: 18px
  `}
`

function TabPanel(props) {
  const { value, index, children } = props

  return value === index && children
}

const TabPanelContent = styled.div`
  padding: 28px 24px;
`

const Fieldset = styled.fieldset`
  border: 0;
  padding: 0;

  &:not(:first-child) {
    margin-top: 20px;
  }
`

const Label = styled.label`
  display: block;
  margin-bottom: 12px;
  font-size: 18px;
`

const ResultText = styled.div`
  font-size: 20px;
  font-weight: 700;
`

const WaringText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -40px;
  height: 40px;
  color: ${({ theme }) => theme.colors.waringColor};
`

const Button = styled.button`
  width: 100%;
  height: 48px;
  margin-top: 40px;
  border: 0;
  border-radius: 8px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : '#B3B3B3'};
  color: ${({ theme }) => theme.colors.white};
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${({ active }) => (active ? '0 6px 20px -6px #73e6e6' : '')};
  cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};
`

const DEPOSIT = 'deposit'
const WITHDRAW = 'withdraw'

export default function FunctionPanel({
  tCDPAddress,
  daiAddress,
  balance = ZERO_UINT256,
  collateral = ZERO_UINT256,
  debt = ZERO_UINT256,
  getUnderlyingPrice = ZERO_UINT256,
  tCDPBalance = ZERO_UINT256,
  tCDPTotalSupply = ZERO_UINT256,
  daiBalance = ZERO_UINT256,
  daiAllowance = ZERO_UINT256,
}) {
  const [tab, setTab] = useState(DEPOSIT)
  const [ethAmount, setEthAmount] = useState('')
  const [tCDPAmount, setTCDPAmount] = useState('')
  const [ethAmountBig, tCDPAmountBig] = [
    etherToWei(ethAmount || 0),
    etherToWei(tCDPAmount || 0),
  ]

  const depositState = {
    maxToDeposit: balance.minus(GAS_FEE_RESERVATION).isPositive()
      ? balance.minus(GAS_FEE_RESERVATION)
      : ZERO_UINT256,
  }
  depositState.tCDPStatus = tCDPTotalSupply.lt(DUST)
    ? TCDP_STATUS.INITIATE_REQUIRED
    : TCDP_STATUS.OK
  depositState.etherStatus = ethAmountBig.gt(depositState.maxToDeposit)
    ? ERC20_STATUS.INSUFFICIENT_BALANCE
    : ERC20_STATUS.OK
  depositState.receiveDai =
    depositState.tCDPStatus === TCDP_STATUS.OK
      ? ethAmountBig.times(debt).div(collateral)
      : getUnderlyingPrice.gt(0)
      ? etherToWei(
          ethAmountBig
            .div(IDEAL_COLLATERALIZATION_RATIO)
            .div(getUnderlyingPrice),
        )
      : ZERO_UINT256
  depositState.receiveTCDP =
    depositState.tCDPStatus === TCDP_STATUS.OK
      ? collateral.gt(0) && ethAmountBig.gt(0)
        ? collateral.gt(0) && ethAmountBig.gt(0)
          ? ethAmountBig.times(tCDPTotalSupply).div(collateral)
          : ZERO_UINT256
        : ZERO_UINT256
      : ethAmountBig
  depositState.ok =
    (depositState.tCDPStatus === TCDP_STATUS.INITIATE_REQUIRED
      ? ethAmountBig.gt(DUST)
      : ethAmountBig.gt(0)) && depositState.etherStatus === ERC20_STATUS.OK

  const withdrawState = {
    payDai:
      tCDPTotalSupply.gt(0) && tCDPAmountBig.gt(0)
        ? tCDPAmountBig.times(debt).div(tCDPTotalSupply)
        : ZERO_UINT256,
    receiveEth:
      tCDPTotalSupply.gt(0) && tCDPAmountBig.gt(0)
        ? tCDPAmountBig.times(collateral).div(tCDPTotalSupply)
        : ZERO_UINT256,
  }
  withdrawState.tCDPStatus = tCDPAmountBig.gt(tCDPBalance)
    ? ERC20_STATUS.INSUFFICIENT_BALANCE
    : ERC20_STATUS.OK
  withdrawState.daiStatus = withdrawState.payDai.gt(daiBalance)
    ? ERC20_STATUS.INSUFFICIENT_BALANCE
    : withdrawState.payDai.gt(daiAllowance)
    ? ERC20_STATUS.INSUFFICIENT_ALLOWANCE
    : ERC20_STATUS.OK
  withdrawState.ok =
    tCDPAmountBig.gt(0) &&
    withdrawState.tCDPStatus === ERC20_STATUS.OK &&
    withdrawState.daiStatus === ERC20_STATUS.OK

  const tCDP = useContract(tCDPAddress, abiTCDP)
  const dai = useContract(daiAddress, abiERC20)

  const initiate = () => {
    if (depositState.ok) {
      tCDP.initiate(bigToHex(depositState.receiveDai), {
        value: bigToHex(ethAmountBig),
      })
    }
  }

  const mint = () => {
    if (depositState.ok) {
      tCDP.mint({ value: bigToHex(ethAmountBig) })
    }
  }

  const burn = () => {
    if (withdrawState.ok) {
      tCDP.burn(bigToHex(tCDPAmountBig))
    }
  }

  const approveDai = () => {
    dai.approve(tCDPAddress, bigToHex(MAX_UINT256))
  }

  const setMaxEthAmount = useCallback(() => {
    setEthAmount(amountFormatter(depositState.maxToDeposit, 18, 18, true))
  }, [depositState.maxToDeposit])

  const setMaxTCDPAmount = useCallback(() => {
    setTCDPAmount(amountFormatter(tCDPBalance, 18, 18, true))
  }, [tCDPBalance])

  return (
    <PanelWrapper>
      <Tabs>
        {[DEPOSIT, WITHDRAW].map((func) => (
          <Tab key={func} active={tab === func} onClick={() => setTab(func)}>
            {func}
          </Tab>
        ))}
      </Tabs>
      <TabPanel value={tab} index={DEPOSIT}>
        <TabPanelContent>
          <Fieldset>
            <Label>Deposit ETH</Label>
            <AmountInput
              value={ethAmount}
              onChange={(event) => setEthAmount(event.target.value)}
              onMax={setMaxEthAmount}
            />
          </Fieldset>
          <Fieldset>
            <Label>You will receive</Label>
            <ResultText>
              {amountFormatter(depositState.receiveTCDP, 18, 18)} tCDP +{' '}
              {amountFormatter(depositState.receiveDai, 18, 18)} DAI
            </ResultText>
          </Fieldset>
          {depositState.tCDPStatus === TCDP_STATUS.INITIATE_REQUIRED ? (
            <Button onClick={initiate} active={depositState.ok}>
              initiate
            </Button>
          ) : (
            <Button onClick={mint} active={depositState.ok}>
              deposit
            </Button>
          )}
        </TabPanelContent>
      </TabPanel>
      <TabPanel value={tab} index={WITHDRAW}>
        <TabPanelContent>
          <Fieldset>
            <Label>Withdraw tCDP</Label>
            <AmountInput
              value={tCDPAmount}
              onChange={(event) => setTCDPAmount(event.target.value)}
              onMax={setMaxTCDPAmount}
            />
          </Fieldset>
          <Fieldset>
            <Label>You need repay </Label>
            <ResultText>
              {amountFormatter(withdrawState.payDai, 18, 18)} DAI
            </ResultText>
          </Fieldset>
          <Fieldset>
            <Label>You will receive</Label>
            <ResultText>
              {amountFormatter(withdrawState.receiveEth, 18, 18)} ETH
            </ResultText>
          </Fieldset>
          <WaringText>
            {
              {
                [ERC20_STATUS.INSUFFICIENT_BALANCE]: 'insufficient dai balance',
                [ERC20_STATUS.INSUFFICIENT_ALLOWANCE]:
                  'insufficient dai allowance',
              }[withdrawState.daiStatus]
            }
          </WaringText>
          {withdrawState.daiStatus === ERC20_STATUS.INSUFFICIENT_ALLOWANCE ? (
            <Button onClick={approveDai} active={true}>
              approve
            </Button>
          ) : (
            <Button onClick={burn} active={withdrawState.ok}>
              withdraw
            </Button>
          )}
        </TabPanelContent>
      </TabPanel>
    </PanelWrapper>
  )
}
