// history kee array 
const chats = [
  { title: 'Dummy chat 1 complain' },
  { title: 'Tell me Ocean temperature' },
  { title: 'Longer titles are sliced at 20' },
  { title: 'sliced at 20' },
  { title: 'Dummy chat 5' },
  { title: 'Dummy chat 6' },
  { title: 'Dummy chat 7' },
  { title: 'Dummy chat 8' },
  { title: 'Dummy chat 9' },
  { title: 'Dummy chat 10' },
]

const ChatHistory = () => {
  return (
    <div className=" pl-3 pr-1 text-white">
      <ul className="space-y-2">
        {chats.map((chat, index) => {
          const displayTitle = chat.title.length > 20 ? chat.title.slice(0, 20) + ".." : chat.title;
          return (
            <li
              key={index}
              className="cursor-pointer rounded-md pl-3 py-1 mr-[15px] text-sm font-light text-gray-300 hover:bg-gray-800 transition"
            >
              {displayTitle}
            </li>
          );
        })}
      </ul>
    </div>
  )
}

export default ChatHistory
