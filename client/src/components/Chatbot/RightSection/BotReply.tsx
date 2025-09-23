import { Shell } from "lucide-react"
import ReactMarkdown from 'react-markdown'

const BotReply = ( { Text, loading }: { Text: string; loading?: boolean } ) => {
  return (
    <div className='flex items-start justify-start gap-1 md:gap-2'>
      <Shell className='text-cyan-400 mt-1 flex-shrink-0 w-4 h-4 md:w-5 md:h-5'/>
      <div className="bg-gray-950 pl-2 pr-3 py-2 rounded-xl w-full ml-1 md:ml-2 text-xs md:text-sm text-gray-300">
        {loading ? (
          <div className="flex flex-col gap-2 w-full">
            <div className="animate-pulse h-2 md:h-3 bg-gray-700 rounded w-3/4"></div>
            <div className="animate-pulse h-2 md:h-3 bg-gray-700 rounded w-1/2"></div>
            <div className="animate-pulse h-2 md:h-3 bg-gray-700 rounded w-2/3"></div>
            <div className="flex items-center gap-1 text-cyan-400 text-xs mt-1">
              <div className="animate-spin w-3 h-3 border border-cyan-400 border-t-transparent rounded-full"></div>
              Thinking...
            </div>
          </div>
        ) : (
          <div className="prose prose-sm md:prose prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 break-words">
            <ReactMarkdown>
              {Text}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

export default BotReply
