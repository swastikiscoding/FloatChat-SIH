import React from 'react'
import ChatSection from './ChatSection'
import InputSection from './InputSection'

const RightSection = () => {
  return (
    <div className="w-4/5 h-full">
      <main className='bg-gray-950 h-full flex flex-col items-center mx-30'>
        <ChatSection />
        <InputSection/>
      </main>
    </div>
  )
}

export default RightSection
