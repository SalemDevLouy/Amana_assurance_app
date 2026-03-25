'use client'
import { SessionProvider } from 'next-auth/react'
import { FC, ReactNode } from 'react'

interface SessionProviderProps {
  children:ReactNode;
}
const Provider:FC<SessionProviderProps> = ({children}) => {
  return (
    <SessionProvider >
      {children}
    </SessionProvider>
  )
}

export default Provider