import { SidebarTrigger } from '../../ui/sidebar'
import ChatSection from './ChatSection'

const RightTop = () => {
  return (
    <div className='w-full h-23/28 flex rounded-t-2xl'>
      <SidebarTrigger className="ml-1 mt-1 text-cyan-400"/>
      <ChatSection/>
    </div>
  )
}

export default RightTop
