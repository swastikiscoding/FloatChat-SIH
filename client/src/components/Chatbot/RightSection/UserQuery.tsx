const UserQuerry = (  { Text }: { Text: string } ) => {
  return (
    <div className='flex justify-end'>
      <div className="px-4 py-2 rounded-xl max-w-[70%] text-sm text-gray-300 
                bg-gradient-to-r from-gray-950 via-gray-900 to-cyan-400/12 
                border border-white/10 shadow-md">
        {Text}
      </div>
    </div>
  )
}

export default UserQuerry
