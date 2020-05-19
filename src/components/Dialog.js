import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { ReactComponent as CloseIcon } from '../assets/close.svg'
import { transparentize } from 'polished'

const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => transparentize(0.5, theme.colors.black)};
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
`

const Paper = styled.div`
  width: 90%;
  max-width: 20.75rem;
  padding: 0.75rem;
  border-radius: 0.25rem;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 12px 30px -12px rgba(183, 197, 204, 0.6);
`

const CloseButton = styled.button.attrs(() => ({ type: 'button' }))`
  margin: 0;
  margin-left: auto;
  padding: 0;
  border: 0;
  border-radius: 0.25rem;
  background-color: #ebeff2;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

export default function Dialog(props) {
  const { isOpen, onDismiss, children } = props

  return ReactDOM.createPortal(
    <BackDrop isOpen={isOpen}>
      <Paper>
        <CloseButton onClick={onDismiss}>
          <CloseIcon />
        </CloseButton>
        {children}
      </Paper>
    </BackDrop>,
    document.body,
  )
}
