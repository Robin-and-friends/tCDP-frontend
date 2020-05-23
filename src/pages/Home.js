import React from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import {
  useCurrentBlockNumber,
  useEthBalance,
  useContract,
  useERC20State,
  useTCDPState,
} from '../hooks/ethereum'
import FunctionPanel from '../components/FunctionPanel'
import BlankLink from '../components/BlankLink'
import { ReactComponent as RebalanceIcon } from '../assets/rebalance.svg'
import { ReactComponent as ArrowRightIcon } from '../assets/arrow-right.svg'
import { ReactComponent as AAVEIcon } from '../assets/aave.svg'
import { ReactComponent as CompoundIcon } from '../assets/compound.svg'
import {
  TCDP_STATUS,
  UPPER_COLLATERALIZATION_RATIO,
  IDEAL_COLLATERALIZATION_RATIO,
  LOWER_COLLATERALIZATION_RATIO,
} from '../constants'
import { contractAddress, externalLink } from '../config'
import { defaultChainId } from '../connectors'
import { amountFormatter, percentageFormatter } from '../utils'
import abiTCDP from '../constants/abis/tCDP.json'
import abiFlashMigrator from '../constants/abis/flashMigrator.json'

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

  &:last-child {
    margin-bottom: 16px;
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

  > a {
    color: #808080;
    transition: color 0.1s ease-in-out;

    &:visited {
      color: #808080;
    }
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

const Value = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #45575b;
`

const UnderlyingProtocol = styled.span`
  display: flex;
  align-items: center;
`

const ActivatableSvg = styled.div`
  position: relative;
  width: 2em;
  height: 2em;
  margin: 0 0.5em;

  &:last-child {
    margin-right: 0;
  }

  > svg {
    position: absolute;
    width: auto;
    height: 100%;
    left: 0;
    right: 0;
    margin: auto;
    transition: opacity 0.5s ease-in-out;

    &[data-gray] {
      path {
        fill: #c0c0c0;
      }
    }
    &[data-active='true'] {
      opacity: 1;
    }
    &[data-active='false'] {
      opacity: 0;
    }
  }
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

const FundingRateComparisonBox = styled.div`
  width: 100%;
  margin-top: 32px;
  display: flex;
  align-items: center;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;

    > svg {
      width: auto;
      height: 3em;
    }

    > span {
      margin-top: 16px;
    }
  }
`

const ComparisonArrowRightIcon = styled(ArrowRightIcon)`
  width: 32px;
  height: 32px;
  margin: auto;
`

const ComparisonArrowLeftIcon = styled(ComparisonArrowRightIcon)`
  transform: rotate(180deg);
  transform-origin: 50%;
`

const Button = styled.button`
  width: 100%;
  height: 48px;
  margin-top: 32px;
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

export default function Home() {
  const { chainId = defaultChainId, account } = useWeb3React()
  const blockNumber = useCurrentBlockNumber().toString()
  const balance = useEthBalance(account, blockNumber)
  const {
    dai: daiAddress,
    tCDP: tCDPAddress,
    flashMigrator: flashMigratorAddress,
    soloMargin: soloMarginAddress,
  } = contractAddress[chainId]
  // Contract states
  const {
    isCompoundd: isCompound = true,
    collateral,
    debt,
    debtRatio,
    collateralRatio,
    getUnderlyingPrice,
    CompoundDaiAPR,
    CompoundEthAPR,
    AaveDaiAPR,
    AaveEthAPR,
  } = useTCDPState(tCDPAddress, blockNumber)
  const {
    totalSupply: tCDPTotalSupply,
    balanceOf: tCDPBalance,
  } = useERC20State(tCDPAddress, account, undefined, blockNumber)
  const { balanceOf: daiBalance, allowance: daiAllowance } = useERC20State(
    daiAddress,
    account,
    tCDPAddress,
    blockNumber,
  )
  // Contract instance
  const tCDP = useContract(tCDPAddress, abiTCDP)
  const flashMigrator = useContract(flashMigratorAddress, abiFlashMigrator)
  // Calculate status
  const tCDPStatus =
    (collateralRatio &&
      (collateralRatio.gt(UPPER_COLLATERALIZATION_RATIO)
        ? collateralRatio.isFinite()
          ? TCDP_STATUS.COLLATERALIZATION_RATIO_TOO_HIGH
          : TCDP_STATUS.INITIATE_REQUIRED
        : collateralRatio.lt(LOWER_COLLATERALIZATION_RATIO)
        ? TCDP_STATUS.COLLATERALIZATION_RATIO_TOO_LOW
        : TCDP_STATUS.OK)) ||
    TCDP_STATUS.OK
  const compoundFundingRate = CompoundDaiAPR
    ? CompoundEthAPR.minus(CompoundDaiAPR.div(IDEAL_COLLATERALIZATION_RATIO))
    : undefined
  const aaveFundingRate = AaveDaiAPR
    ? AaveEthAPR.minus(AaveDaiAPR.div(IDEAL_COLLATERALIZATION_RATIO))
    : undefined
  const readyToMigrate =
    compoundFundingRate && aaveFundingRate
      ? isCompound
        ? aaveFundingRate.gt(compoundFundingRate)
        : compoundFundingRate.gt(aaveFundingRate)
      : false

  const rebalance = () => {
    switch (tCDPStatus) {
      case TCDP_STATUS.COLLATERALIZATION_RATIO_TOO_HIGH:
        tCDP.leverage()
        return
      case TCDP_STATUS.COLLATERALIZATION_RATIO_TOO_LOW:
        tCDP.deleverage()
        return
      default:
    }
  }

  const migrate = () => {
    if (readyToMigrate) {
      flashMigrator.flashMigrate(soloMarginAddress)
    }
  }

  return (
    <>
      <Container>
        <Block>
          <Row>
            <Text>Underlying Protocol</Text>
            <UnderlyingProtocol>
              <ActivatableSvg>
                <CompoundIcon data-gray />
                <CompoundIcon data-active={isCompound === true} />
              </ActivatableSvg>
              <ActivatableSvg>
                <AAVEIcon data-gray />
                <AAVEIcon data-active={isCompound === false} />
              </ActivatableSvg>
            </UnderlyingProtocol>
          </Row>
          <Row>
            <Text>ETH Locked</Text>
            <Value>
              {collateral ? `${amountFormatter(collateral, 18)} ETH` : '-'}
            </Value>
          </Row>
          <Row>
            <Text>Borrowing</Text>
            <Value>{debt ? `${amountFormatter(debt, 18)} DAI` : '-'}</Value>
          </Row>
          <Row>
            <Text>Collateralization Ratio</Text>
            <Value>
              {collateralRatio && collateralRatio.isFinite()
                ? percentageFormatter(collateralRatio, 0)
                : '-'}
            </Value>
          </Row>
          <Row>
            <Text>Funding Rate</Text>
            <Value>
              {isCompound === false
                ? aaveFundingRate
                  ? percentageFormatter(aaveFundingRate, 18)
                  : '-'
                : compoundFundingRate
                ? percentageFormatter(compoundFundingRate, 18)
                : '-'}
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
              balance={balance}
              tCDPAddress={tCDPAddress}
              daiAddress={daiAddress}
              collateral={collateral}
              debt={debt}
              debtRatio={debtRatio}
              getUnderlyingPrice={getUnderlyingPrice}
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
                <Text>CDP is illiquid</Text>
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
              <Caption>
                <BlankLink href={externalLink.learnRebalancing}>
                  Learn how rebalancing works
                </BlankLink>
              </Caption>
            </Row>
            <Divider />
            <Row>
              <div style={{ flex: '1 1' }}>
                <Text>Collateralization Ratio Difference</Text>
                <BigText>
                  {(collateralRatio &&
                    collateralRatio.isFinite() &&
                    percentageFormatter(
                      collateralRatio.minus(IDEAL_COLLATERALIZATION_RATIO),
                      0,
                    )) ||
                    '-'}
                </BigText>
              </div>
              <StyledArrowRightIcon />
              <div style={{ alignSelf: 'flex-start' }}>
                <Text>
                  <Strong>25% difference required</Strong>
                </Text>
                {[
                  TCDP_STATUS.COLLATERALIZATION_RATIO_TOO_HIGH,
                  TCDP_STATUS.COLLATERALIZATION_RATIO_TOO_LOW,
                ].includes(tCDPStatus) ? (
                  <Row>
                    <RebalanceIcon
                      style={{ cursor: 'pointer' }}
                      onClick={() => rebalance()}
                    />
                    <Text>
                      <Bold>Rebalance Ready!</Bold>
                    </Text>
                  </Row>
                ) : null}
              </div>
            </Row>
          </Block>
          <Block>
            <Row>
              <Title>Flash Migrate</Title>
              <Caption>
                <BlankLink href={externalLink.learnFlashMigrating}>
                  Learn how flash migrating works
                </BlankLink>
              </Caption>
            </Row>
            <Divider />
            <FundingRateComparisonBox>
              <div>
                <ActivatableSvg style={{ height: '3em' }}>
                  <CompoundIcon data-gray />
                  <CompoundIcon data-active={isCompound === true} />
                </ActivatableSvg>
                <Bold>
                  {compoundFundingRate
                    ? percentageFormatter(compoundFundingRate, 18)
                    : '-'}{' '}
                </Bold>
              </div>
              {compoundFundingRate && aaveFundingRate ? (
                compoundFundingRate.gt(aaveFundingRate) ? (
                  <ComparisonArrowRightIcon />
                ) : (
                  <ComparisonArrowLeftIcon />
                )
              ) : (
                <svg style={{ width: '32px', height: '0' }} />
              )}
              <div>
                <ActivatableSvg style={{ height: '3em' }}>
                  <AAVEIcon data-gray />
                  <AAVEIcon data-active={isCompound === false} />
                </ActivatableSvg>
                <Bold>
                  {aaveFundingRate
                    ? percentageFormatter(aaveFundingRate, 18)
                    : '-'}{' '}
                </Bold>
              </div>
            </FundingRateComparisonBox>
            <Button onClick={() => migrate()} active={readyToMigrate}>
              FLASH MIGRATE
            </Button>
          </Block>
        </div>
      </Container>
    </>
  )
}
