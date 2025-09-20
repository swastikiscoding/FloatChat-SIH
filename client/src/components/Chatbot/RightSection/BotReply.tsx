import { Shell } from "lucide-react"

const BotReply = ( { Text,loading }: { Text: string; loading?: boolean } ) => {
  return (
    <div className='flex items-center justify-start gap-2'>
      <Shell className='text-cyan-400 mt-1'/>
      <div className="bg-gray-950 pl-2 pr-3 py-2 rounded-xl w-full ml-2 text-sm font-light text-gray-300">
        {loading ? (
          <div className="flex flex-col gap-1 w-full">
            <div className="animate-pulse h-3 bg-gray-700 rounded w-3/4"></div>
            <div className="animate-pulse h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        ) : (
          Text
        )}
      </div>
    </div>
  )
}

export default BotReply
