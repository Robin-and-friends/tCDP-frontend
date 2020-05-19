import React, { useMemo } from 'react'
import styled from 'styled-components'
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

export default function Home() {
  const collateral = null
  const debt = null
  const collateralRatio = useMemo(() => {
    if (collateral && debt) {
      return collateral.div(debt)
    }
  }, [collateral, debt])

  const totalSupply = null
  const balance = null

  return (
    <>
      <ProtocolSelector />
      <Container>
        <Block>
          <Row>
            <Text>CDP ETH Locked</Text>
            <Value>
              {collateral ? `${amountFormatter(collateral)} ETH` : '-'}
            </Value>
          </Row>
          <Row>
            <Text>CDP Borrowing</Text>
            <Value>{debt ? `${amountFormatter(debt)} DAI` : '-'}</Value>
          </Row>
          <Row>
            <Text>CDP Collateralization Ratio</Text>
            <Value>
              {collateralRatio ? percentageFormatter(collateralRatio) : '-'}
            </Value>
          </Row>
          <Row>
            <Text>TotalSupply</Text>
            <Value>
              {totalSupply ? `${amountFormatter(totalSupply)} tCDP` : '-'}
            </Value>
          </Row>
          <Row>
            <Text>Your Balance</Text>
            <Value>{balance ? `${amountFormatter(balance)} tCDP` : '-'}</Value>
          </Row>
          <PanelRow>
            <FunctionPanel />
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
