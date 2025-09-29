import { useContext } from 'react';
import { Input } from '../../ui/input';
import { Context } from '../context/Context';

const RightBottom = () => {
  const { askQue, setques, loading } = useContext(Context);

  const handleSubmit = async (value: string) => {
    if (loading) return; // Prevent multiple submissions while loading
    setques(value);
    await askQue(value);
  };

  return (
    <div className='h-5/28 w-full rounded-b-2xl pt-3 md:pt-5 flex flex-col justify-end mb-1'>
      <Input onSubmit={handleSubmit} disabled={loading} />
    </div>
  )
}

export default RightBottom
