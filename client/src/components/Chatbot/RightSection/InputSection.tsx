
const InputSection = () => {
  return (
    <div className='bg-gray-950 h-[70px] w-full flex justify-center py-3'>
      <div className= 'bg-gray-800 flex w-full rounded-2xl'>
        <input type="text" placeholder='Enter a prompt' className='w-94/100 pl-10 border-r-3 border-gray-900 placeholder-gray-400 focus:outline-none'/>
        <button className='w-6/100 flex justify-center items-center hover:bg-gray-900 rounded-r-2xl'><svg width="50px" height="50px" viewBox="0 0 32 32" version="1.1" fill="#ffffff" stroke="#ffffff" stroke-width="1.1199999999999999"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.44800000000000006"></g><g id="SVGRepo_iconCarrier"> <g id="icomoon-ignore"> </g> <path d="M19.159 16.767l0.754-0.754-6.035-6.035-0.754 0.754 5.281 5.281-5.256 5.256 0.754 0.754 3.013-3.013z" fill="#000000"> </path> </g></svg></button>
      </div>
    </div>
  )
}

export default InputSection
