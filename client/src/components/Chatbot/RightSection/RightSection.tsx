import RightTop from './RightTop'
import RightBottom from './RightBottom'

const RightSection = () => {
  return (
    <main className="w-full h-[calc(100vh-1.5rem)] md:h-[calc(100vh-1.5rem)] bg-gray-950 border border-white/30 rounded-2xl my-3 md:mr-4 mr-2 flex flex-col">
      <RightTop/>
      <RightBottom/>
    </main>
  )
}

export default RightSection
