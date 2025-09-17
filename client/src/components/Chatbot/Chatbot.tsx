import React from 'react'
import Sidebar from './SideBar/Sidebar'
import RightSection from './RightSection/RightSection'

const Chatbot = () => {
  return (
    <div className='flex bg-gray-950 h-screen text-white'> 
      <Sidebar/>
      <RightSection/>
    </div>
  )
}

export default Chatbot
