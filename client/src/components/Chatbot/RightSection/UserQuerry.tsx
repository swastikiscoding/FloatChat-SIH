
const UserQuerry = (  { Text }: { Text: string } ) => {
  return (
    <div className='flex justify-end'>
      <div className="bg-green-900 text-white px-4 py-2 rounded-xl max-w-[70%]">
        {Text}
      </div>
    </div>
  )
}

export default UserQuerry
