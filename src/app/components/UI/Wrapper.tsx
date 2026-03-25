import React from 'react'

export default function Wrapper({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className='bg-[#06060f] w-full h-full min-h-screen overflow-y-auto p-6 pt-20 md:pt-6'>
      {children}
    </div>
  )
}
