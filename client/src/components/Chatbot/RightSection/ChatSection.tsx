import BotReply from './BotReply'
import UserQuerry from './UserQuerry'

const ChatSection = () => {
  return (
    <div className='bg-gray-950 h-[calc(100vh-70px)] w-full overflow-y-auto scrollbar-none flex flex-col gap-5 mt-3'>
      {/* here user or bot chat will come */}
      <BotReply Text='wefve'></BotReply>
      <UserQuerry Text='fegrg' />
      <BotReply Text='Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex, vero quidem hic corporis veniam minus accusantium quasi eaque distinctio. Delectus labore nihil asperiores ducimus fugiat eveniet quod corrupti neque officiis mollitia? Nisi dolor laborum tempore saepe, enim reiciendis laboriosam cum iure minima nesciunt blanditiis autem explicabo distinctio obcaecati libero atque! Quam, nihil dolorem. Eligendi consequatur veniam tempora dolorum vel inventore assumenda eveniet eum sunt iste facilis beatae nisi quaerat commodi, aspernatur molestiae. Itaque obcaecati deserunt ipsum repudiandae? Eius illum voluptates obcaecati voluptate fugit cum ad blanditiis? Ipsa doloribus labore repudiandae distinctio porro, delectus ad eum! Dignissimos, porro doloremque! Deleniti, delectus.'></BotReply>
      <UserQuerry Text='fegrg' />
      <BotReply Text='Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex, vero quidem hic corporis veniam minus accusantium quasi eaque distinctio. Delectus labore nihil asperiores ducimus fugiat eveniet quod corrupti neque officiis mollitia? Nisi dolor laborum tempore saepe, enim reiciendis laboriosam cum iure minima nesciunt blanditiis autem explicabo distinctio obcaecati libero atque! Quam, nihil dolorem. Eligendi consequatur veniam tempora dolorum vel inventore assumenda eveniet eum sunt iste facilis beatae nisi quaerat commodi, aspernatur molestiae. Itaque obcaecati deserunt ipsum repudiandae? Eius illum voluptates obcaecati voluptate fugit cum ad blanditiis? Ipsa doloribus labore repudiandae distinctio porro, delectus ad eum! Dignissimos, porro doloremque! Deleniti, delectus.'></BotReply>
      <BotReply Text='wefve'></BotReply>
      <UserQuerry Text='fegrg' />
      <BotReply Text='Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex, vero quidem hic corporis veniam minus accusantium quasi eaque distinctio. Delectus labore nihil asperiores ducimus fugiat eveniet quod corrupti neque officiis mollitia? Nisi dolor laborum tempore saepe, enim reiciendis laboriosam cum iure minima nesciunt blanditiis autem explicabo distinctio obcaecati libero atque! Quam, nihil dolorem. Eligendi consequatur veniam tempora dolorum vel inventore assumenda eveniet eum sunt iste facilis beatae nisi quaerat commodi, aspernatur molestiae. Itaque obcaecati deserunt ipsum repudiandae? Eius illum voluptates obcaecati voluptate fugit cum ad blanditiis? Ipsa doloribus labore repudiandae distinctio porro, delectus ad eum! Dignissimos, porro doloremque! Deleniti, delectus.'></BotReply>
      <UserQuerry Text='fegrg' />
    </div>
  )
}

export default ChatSection
