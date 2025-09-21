import { Shell } from "lucide-react"
import ReactMarkdown from 'react-markdown'

const BotReply = ( { Text, loading }: { Text: string; loading?: boolean } ) => {
  return (
    <div className='flex items-start justify-start gap-2'>
      <Shell className='text-cyan-400 mt-1 flex-shrink-0'/>
      <div className="bg-gray-950 pl-2 pr-3 py-2 rounded-xl w-full ml-2 text-sm text-gray-300">
        {loading ? (
          <div className="flex flex-col gap-2 w-full">
            <div className="animate-pulse h-3 bg-gray-700 rounded w-3/4"></div>
            <div className="animate-pulse h-3 bg-gray-700 rounded w-1/2"></div>
            <div className="animate-pulse h-3 bg-gray-700 rounded w-2/3"></div>
            <div className="flex items-center gap-1 text-cyan-400 text-xs mt-1">
              <div className="animate-spin w-3 h-3 border border-cyan-400 border-t-transparent rounded-full"></div>
              Thinking...
            </div>
          </div>
        ) : (
          <ReactMarkdown >
            {Text}
          </ReactMarkdown>
        )}
      </div>
    </div>
  )
}

export default BotReply
