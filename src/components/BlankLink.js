import React from 'react'

const BlankLink = ({ href, className, children }) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className={className}
  >
    {children}
  </a>
)

export default BlankLink
