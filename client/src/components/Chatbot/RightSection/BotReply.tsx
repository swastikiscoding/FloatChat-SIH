import { Shell } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const BotReply = ( { Text, loading }: { Text: string; loading?: boolean } ) => {
  return (
    <div className='flex items-start justify-start gap-1 md:gap-2'>
      <Shell className='text-cyan-400 mt-2.5 flex-shrink-0 w-4 h-4 md:w-5 md:h-5'/>
      <div className="bg-gray-950 pl-2 pr-3 py-2 rounded-xl w-full ml-1 md:ml-2 text-sm md:text-base text-gray-300">
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
          <div className="prose prose-sm md:prose prose-invert max-w-none break-words [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4 -mx-2 px-2">
                    <table className="w-full min-w-full border-collapse border border-gray-600 rounded-lg overflow-hidden text-xs md:text-sm">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-800/50">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-600 px-2 md:px-3 py-1 md:py-2 text-left font-medium text-cyan-400 text-xs md:text-sm whitespace-nowrap">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-600 px-2 md:px-3 py-1 md:py-2 text-gray-300 text-xs md:text-sm">
                    {children}
                  </td>
                ),
                tbody: ({ children }) => (
                  <tbody className="[&>tr:nth-child(even)]:bg-gray-800/25 [&>tr:hover]:bg-gray-700/30">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => (
                  <tr className="transition-colors duration-150">
                    {children}
                  </tr>
                ),
              }}
            >
              {Text}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

export default BotReply
