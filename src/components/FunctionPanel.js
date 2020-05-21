import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import AmountInput from './AmountInput'
import { useContract } from '../hooks/ethereum'
import {
  MAX_UINT256,
  GAS_FEE_RESERVATION,
  ERC20_STATUS,
  amountFormatter,
  bigToHex,
  etherToWei,
  isValidFloat,
  safeToString,
} from '../utils'
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
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:focus {
    outline: none;
  }
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
  balance,
  tCDPAddress,
  daiAddress,
  collateral = new BigNumber(0),
  debt = new BigNumber(0),
  tCDPBalance = new BigNumber(0),
  tCDPTotalSupply = new BigNumber(0),
  daiBalance = new BigNumber(0),
  daiAllowance = new BigNumber(0),
}) {
  const [tab, setTab] = useState(DEPOSIT)
  const [ethAmount, setEthAmount] = useState('0')
  const [tCDPAmount, setTCDPAmount] = useState('0')

  const depositState = {
    receiveDai: new BigNumber(ethAmount).times(tCDPTotalSupply).div(collateral),
    receiveTCDP: new BigNumber(ethAmount).times(debt).div(collateral),
  }

  const withdrawState = {
    payDai: new BigNumber(tCDPAmount).times(debt).div(tCDPTotalSupply),
    receiveEth: new BigNumber(tCDPAmount)
      .times(collateral)
      .div(tCDPTotalSupply),
  }
  withdrawState.warning = daiBalance.lt(etherToWei(withdrawState.payDai))
    ? ERC20_STATUS.INSUFFICIENT_BALANCE
    : daiAllowance.lt(etherToWei(withdrawState.payDai))
    ? ERC20_STATUS.INSUFFICIENT_ALLOWANCE
    : ERC20_STATUS.OK

  const tCDP = useContract(tCDPAddress, abiTCDP)
  const dai = useContract(daiAddress, abiERC20)

  const mint = () => {
    tCDP.mint({
      value: bigToHex(etherToWei(ethAmount).minus(GAS_FEE_RESERVATION)),
    })
  }

  const burn = () => {
    tCDP.burn(bigToHex(etherToWei(tCDPAmount)))
  }

  const approveDai = () => {
    dai.approve(tCDPAddress, bigToHex(MAX_UINT256))
  }

  const setMaxEthAmount = useCallback(() => {
    setEthAmount(amountFormatter(balance, 18, 18, true))
  }, [balance])

  const setNewEthAmount = useCallback(
    (value) => {
      if (value === '') {
        setEthAmount('0')
      }
      if (!isValidFloat(value)) {
        return
      }
      const newAmount = etherToWei(new BigNumber(value))
      if (newAmount.gt(balance)) {
        setMaxEthAmount()
      } else {
        setEthAmount(value)
      }
    },
    [balance, setMaxEthAmount],
  )

  const setMaxTCDPAmount = useCallback(() => {
    setTCDPAmount(amountFormatter(tCDPBalance, 18, 18, true))
  }, [tCDPBalance])

  const setNewTCDPAmount = useCallback(
    (value) => {
      if (value === '') {
        setTCDPAmount('0')
      }
      if (!isValidFloat(value)) {
        return
      }
      const newAmount = etherToWei(new BigNumber(value))
      if (newAmount.gt(tCDPBalance)) {
        setMaxTCDPAmount()
      } else {
        setTCDPAmount(value)
      }
    },
    [tCDPBalance, setMaxTCDPAmount],
  )

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
              onChange={(event) => setNewEthAmount(event.target.value)}
              onMax={setMaxEthAmount}
            />
          </Fieldset>
          <Fieldset>
            <Label>You will receive</Label>
            <ResultText>
              {safeToString(depositState.receiveDai)} tCDP +{' '}
              {safeToString(depositState.receiveTCDP)} DAI
            </ResultText>
          </Fieldset>
          <Button onClick={mint} active={new BigNumber(ethAmount).gt(0)}>
            deposit
          </Button>
        </TabPanelContent>
      </TabPanel>
      <TabPanel value={tab} index={WITHDRAW}>
        <TabPanelContent>
          <Fieldset>
            <Label>Withdraw tCDP</Label>
            <AmountInput
              value={tCDPAmount}
              onChange={(event) => setNewTCDPAmount(event.target.value)}
              onMax={setMaxTCDPAmount}
            />
          </Fieldset>
          <Fieldset>
            <Label>You need repay </Label>
            <ResultText>{safeToString(withdrawState.payDai)} DAI</ResultText>
          </Fieldset>
          <Fieldset>
            <Label>You will receive</Label>
            <ResultText>
              {safeToString(withdrawState.receiveEth)} ETH
            </ResultText>
          </Fieldset>
          {withdrawState.warning ? (
            <WaringText>
              {
                {
                  [ERC20_STATUS.INSUFFICIENT_BALANCE]:
                    'insufficient dai balance',
                  [ERC20_STATUS.INSUFFICIENT_ALLOWANCE]:
                    'insufficient dai allowance',
                }[withdrawState.warning]
              }
            </WaringText>
          ) : null}
          {withdrawState.warning === ERC20_STATUS.INSUFFICIENT_ALLOWANCE ? (
            <Button onClick={approveDai} active={true}>
              approve
            </Button>
          ) : (
            <Button onClick={burn} active={new BigNumber(tCDPAmount).gt(0)}>
              withdraw
            </Button>
          )}
        </TabPanelContent>
      </TabPanel>
    </PanelWrapper>
  )
}
