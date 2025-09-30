import RightTop from './RightTop'
import RightBottom from './RightBottom'

const RightSection = () => {
  return (
    <main className="w-full h-[calc(100vh-1rem)] md:h-[calc(100vh-0.5rem)] bg-gray-950 border border-white/30 my-auto mx-auto rounded-2xl md:mr-1 md:my-1 flex flex-col">
      <RightTop/>
      <RightBottom/>
    </main>
  )
}

export default RightSection
