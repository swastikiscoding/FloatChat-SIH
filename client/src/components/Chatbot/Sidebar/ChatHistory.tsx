import { useContext } from "react";
import { Context } from "../context/Context.tsx";



// history kee array 

// const chats = [
//   { title: 'Dummy chat 1 complain' },
//   { title: 'Tell me Ocean temperature' },
//   { title: 'Longer titles are sliced at 20' },
//   { title: 'sliced at 20' },
//   { title: 'Dummy chat 5' },
//   { title: 'Dummy chat 6' },
//   { title: 'Dummy chat 7' },
//   { title: 'Dummy chat 8' },
//   { title: 'Dummy chat 9' },
//   { title: 'Dummy chat 10' },
// ]

const ChatHistory = () => {
   const { askQue, prevPrompts = [], setrecentPrompt } = useContext(Context);
   
   if (!prevPrompts) return null;

  const loadPrompt = async (prompt:string) => {
    setrecentPrompt(prompt);
    await askQue(prompt);
  };
  
  return (
    <div className=" pl-3 pr-1 text-white">
      <ul className="space-y-2">
        {prevPrompts.map((item, index) => {
          const displayTitle = item.length > 20 ? item.slice(0, 20) + ".." : item;
          return (
            <li
              key={index}
              onClick={() => loadPrompt(item)}
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
