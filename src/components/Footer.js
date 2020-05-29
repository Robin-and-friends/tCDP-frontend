import React from 'react'
import styled from 'styled-components'

const FooterWrapper = styled.footer`
  margin: 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  > *:not(:first-child) {
    margin-left: 16px;
  }
`

const Link = styled.a`
  font-size: 16px;
  color: #808080;
`

export default function Footer() {
  return (
    <FooterWrapper>
      <Link
        href='https://etherscan.io/address/0xda4C9Ee8373Fd1095379a3Dd457A0c78968aAF03#code'
        target='_blank'
        rel='noopener noreferrer'
      >
        tCDP
      </Link>
      <Link
        href='https://etherscan.io/address/0x228679770b2d8a281a466765ba55e0dfd8441ae6#code'
        target='_blank'
        rel='noopener noreferrer'
      >
        Flash Migrater
      </Link>
      <Link
        href='https://github.com/Robin-and-friends/tCDP'
        target='_blank'
        rel='noopener noreferrer'
      >
        Github
      </Link>
      <Link
        href='https://www.youtube.com/watch?v=582LaYJ0deA'
        target='_blank'
        rel='noopener noreferrer'
      >
        Youtube
      </Link>
    </FooterWrapper>
  )
}
