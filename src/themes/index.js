import React from 'react'
import {
  ThemeProvider as StyledComponentsThemeProvider,
  css,
} from 'styled-components'

export { GlobalStyle } from './GlobalStyle'

const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
}

const mediaQuery = Object.keys(breakpoints).reduce((accumulator, label) => {
  accumulator[label] = (...args) => css`
    @media (min-width: ${breakpoints[label]}px) {
      ${css(...args)}
    }
  `
  return accumulator
}, {})

const black = '#000000'
const white = '#FFFFFF'

const theme = {
  mediaQuery,
  fontFamilies: {},
  colors: {
    black,
    white,
  },
}

export default function ThemeProvider({ children }) {
  return (
    <StyledComponentsThemeProvider theme={theme}>
      {children}
    </StyledComponentsThemeProvider>
  )
}
