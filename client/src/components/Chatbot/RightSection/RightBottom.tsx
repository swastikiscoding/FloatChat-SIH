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
    <div className='h-5/28 rounded-b-2xl px-4 md:px-15 pt-3 md:pt-5'>
      <Input onSubmit={handleSubmit} disabled={loading} />
    </div>
  )
}

export default RightBottom
