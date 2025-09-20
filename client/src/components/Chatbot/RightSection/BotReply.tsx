import { Shell } from "lucide-react"

const BotReply = ( { Text }: { Text: string } ) => {
  return (
    <div className='flex items-center justify-start ml-3'>
      <Shell className='text-cyan-400'/>
      <div className="bg-gray-950 pl-1 pr-3 py-2 rounded-xl w-full ml-2 text-sm font-light text-gray-300">
        {Text}
      </div>
    </div>
  )
}

export default BotReply
