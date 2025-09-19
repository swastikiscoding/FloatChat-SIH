import React from 'react'
import RightTop from './RightTop'
import RightBottom from './RightBottom'

const RightSection = () => {
  return (
    <main className="w-full bg-gray-950 border border-white/30 rounded-2xl my-2 mr-4 flex flex-col">
      <RightTop/>
      <RightBottom/>
    </main>
  )
}

export default RightSection
