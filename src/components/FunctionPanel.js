import React, { useState } from 'react'
import styled from 'styled-components'
import AmountInput from './AmountInput'

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

const Button = styled.button`
  width: 100%;
  height: 48px;
  margin-top: 40px;
  border: 0;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6px 20px -6px #73e6e6;
  cursor: pointer;
`

const DEPOSIT = 'deposit'
const WITHDRAW = 'withdraw'

export default function FunctionPanel() {
  const [tab, setTab] = useState(DEPOSIT)
  const [ethAmount, setEthAmount] = useState('')
  const [tcdpAmount, setTcdpAmount] = useState('')

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
            />
          </Fieldset>
          <Fieldset>
            <Label>You will receive</Label>
            <ResultText>1 tCDP + 100 DAI</ResultText>
          </Fieldset>
          <Button>deposit</Button>
        </TabPanelContent>
      </TabPanel>
      <TabPanel value={tab} index={WITHDRAW}>
        <TabPanelContent>
          <Fieldset>
            <Label>Withdraw tCDP</Label>
            <AmountInput
              value={tcdpAmount}
              onChange={(event) => setTcdpAmount(event.target.value)}
            />
          </Fieldset>
          <Fieldset>
            <Label>You need repay</Label>
            <ResultText>100 DAI</ResultText>
          </Fieldset>
          <Fieldset>
            <Label>You will receive</Label>
            <ResultText>1 ETH</ResultText>
          </Fieldset>
          <Button>withdraw</Button>
        </TabPanelContent>
      </TabPanel>
    </PanelWrapper>
  )
}
