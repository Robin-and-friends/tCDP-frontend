import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  max-width: 1232px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;

  > *:not(:first-child) {
    margin-left: 16px;
  }
`

const Button = styled.div`
  height: 40px;
  padding: 0 24px;
  border: 0;
  border-radius: 20px;
  background-color: ${({ active }) => (active ? '#FFFFFF' : '#81D8D5')};
  color: '#268080';
  font-size: 18px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

export default function ProtocolSelector({
  protocols,
  currentProtocolId,
  setProtocol,
}) {
  return (
    <Container>
      {protocols.map(({ id, text }) => (
        <Button
          active={currentProtocolId === id}
          onClick={() => setProtocol(id)}
          key={id}
        >
          {text}
        </Button>
      ))}
    </Container>
  )
}
