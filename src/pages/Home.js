import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTCDPState, useERC20State } from '../hooks/ethereum'
import ProtocolSelector from '../components/ProtocolSelector'
import FunctionPanel from '../components/FunctionPanel'
import { ReactComponent as RebalanceIcon } from '../assets/rebalance.svg'
import { ReactComponent as ArrowRightIcon } from '../assets/arrow-right.svg'
import { amountFormatter, percentageFormatter } from '../utils'

const Container = styled.div`
  width: 100%;
  max-width: 1232px;
  margin: 0 auto;
  margin-top: 12px;
  padding: 0 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;

  > * {
    flex: 1 0 512px;
  }

  > * {
    margin: 16px;
  }
`

const Block = styled.section`
  padding: 32px 40px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 12px 30px -12px rgba(183, 197, 204, 0.6);

  &:not(:first-child) {
    margin-top: 32px;
  }
`

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:not(:first-child) {
    margin-top: 28px;
  }
`

const PanelRow = styled.div`
  margin-top: 40px;
`

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 16px 0 32px 20px;
`

const Item = styled.li`
  display: flex;
  align-items: center;

  &:not(:first-child) {
    margin-top: 8px;
  }

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    margin-right: 16px;
    border-radius: 3px;
    background-color: ${({ theme }) => theme.colors.primary};
    display: inline-block;
  }
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin: 32px 0;
  background-color: ${({ theme }) => theme.colors.primary};
`

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
`

const SubTitle = styled.div`
  font-size: 18px;
`

const Text = styled.span`
  font-size: 20px;
  font-weight: 600;
`

const BigText = styled.div`
  margin-top: 14px;
  font-size: 40px;
  font-weight: 700;
`

const Caption = styled.span`
  font-size: 14px;
  color: #808080;
`

const Value = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #45575b;
`

const Bold = styled.span`
  font-weight: 700;
`

const Strong = styled.span`
  color: #f57c00;
`

const StyledArrowRightIcon = styled(ArrowRightIcon)`
  margin: 0 16px;
  align-self: flex-start;
`

const contractAddress = {
  1: {
    compound: '',
    aave: '',
    dai: '',
  },
  4: {
    compound: '0x59f76d251f117aa6546fdbe029ec13b7f28e8911',
    aave: '',
    dai: '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea',
  },
  42: {
    compound: '',
    aave: '',
    dai: '',
  },
}

const protocols = [
  {
    id: 'compound',
    text: 'Compound',
  },
  {
    id: 'aave',
    text: 'AAVE',
  },
]

export default function Home() {
  const { chainId, account, library } = useWeb3React()
  const [balance, setBalance] = useState(new BigNumber(0))
  const [protocol, setProtocol] = useState(protocols[0].id)
  const { dai: daiAddress, [protocol]: tCDPAddress } =
    contractAddress[chainId] || contractAddress[4]
  const { collateral, debt, collateralRatio } = useTCDPState(tCDPAddress)
  const {
    totalSupply: tCDPTotalSupply,
    balanceOf: tCDPBalance,
  } = useERC20State(tCDPAddress, account)
  const { balanceOf: daiBalance, allowance: daiAllowance } = useERC20State(
    daiAddress,
    account,
    tCDPAddress,
  )

  useEffect(() => {
    if (!library || !account) {
      return
    }
    library
      .getBalance(account)
      .then((newBalance) => setBalance(new BigNumber(newBalance.toString())))
    return () => {}
  }, [account, library])

  return (
    <>
      <ProtocolSelector
        protocols={protocols}
        currentProtocolId={protocol}
        setProtocol={setProtocol}
      />
      <Container>
        <Block>
          <Row>
            <Text>CDP ETH Locked</Text>
            <Value>
              {collateral ? `${amountFormatter(collateral, 18)} ETH` : '-'}
            </Value>
          </Row>
          <Row>
            <Text>CDP Borrowing</Text>
            <Value>{debt ? `${amountFormatter(debt, 18)} DAI` : '-'}</Value>
          </Row>
          <Row>
            <Text>CDP Collateralization Ratio</Text>
            <Value>
              {collateralRatio ? percentageFormatter(collateralRatio, 0) : '-'}
            </Value>
          </Row>
          <Row>
            <Text>TotalSupply</Text>
            <Value>
              {tCDPTotalSupply
                ? `${amountFormatter(tCDPTotalSupply, 18)} tCDP`
                : '-'}
            </Value>
          </Row>
          <Row>
            <Text>Your Balance</Text>
            <Value>
              {tCDPBalance ? `${amountFormatter(tCDPBalance, 18)} tCDP` : '-'}
            </Value>
          </Row>
          <PanelRow>
            <FunctionPanel
              tCDPAddress={tCDPAddress}
              daiAddress={daiAddress}
              collateral={collateral}
              debt={debt}
              balance={balance}
              tCDPTotalSupply={tCDPTotalSupply}
              tCDPBalance={tCDPBalance}
              daiBalance={daiBalance}
              daiAllowance={daiAllowance}
            />
          </PanelRow>
        </Block>
        <div>
          <Block>
            <SubTitle>Problem</SubTitle>
            <List>
              <Item>
                <Text>CDP is illquid</Text>
              </Item>
              <Item>
                <Text>Maintaining collateral ratio is annoying</Text>
              </Item>
            </List>
            <SubTitle>Solution</SubTitle>
            <List>
              <Item>
                <Text>Shared, tokenized, "position"</Text>
              </Item>
            </List>
            <SubTitle>Benefit</SubTitle>
            <List>
              <Item>
                <Text>Fungible</Text>
              </Item>
              <Item>
                <Text>Auto-rebalancing</Text>
              </Item>
              <Item>
                <Text>Trade on DEX</Text>
              </Item>
            </List>
          </Block>
          <Block>
            <Row>
              <Title>Next Rebalance</Title>
              <Caption>Learn how rebalancing works</Caption>
            </Row>
            <Divider />
            <Row>
              <div style={{ flex: '1 1' }}>
                <Text>Collateralization Ratio Difference</Text>
                <BigText>20%</BigText>
              </div>
              <StyledArrowRightIcon />
              <div style={{ alignSelf: 'flex-start' }}>
                <Text>
                  <Strong>25% difference required</Strong>
                </Text>
                <Row>
                  <RebalanceIcon />
                  <Text>
                    <Bold>Rebalance Ready!</Bold>
                  </Text>
                </Row>
              </div>
            </Row>
          </Block>
        </div>
      </Container>
    </>
  )
}
