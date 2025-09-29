import { useContext,useState } from 'react';
import { Input } from '../../ui/input';
import { Context } from '../context/Context';
import { CiMicrophoneOn } from "react-icons/ci";

const RightBottom = () => {
  const { askQue, setques, loading } = useContext(Context);
  const [listening, setListening] = useState(false);

  const handleSubmit = async (value: string) => {
    if (loading) return; // Prevent multiple submissions while loading
    setques(value);
    await askQue(value);
  };
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }
     const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.start();
    setListening(true);

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      handleSubmit(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };
  return (
    <div className='h-5/28 w-full rounded-b-2xl pt-3 md:pt-5 flex flex-col justify-end mb-1'>
      <div className="relative w-full">
      <Input onSubmit={handleSubmit} disabled={loading}  />
      <button 
        type="button"
        onClick={startListening}
        disabled={loading}
          className="absolute right-20 top-11.5 p-1 sm:right-35 sm:top-[55px] -translate-y-1/2 
               bg-[#4A5565] text-white rounded-full border-1 border-[#6E7784] sm:p-1.5
               hover:bg-gray-600 transition cursor-pointer"
  >
        {listening ? "🎙️" : <CiMicrophoneOn color='black' size={16}/>}
      </button>
      </div>
    </div>
  )
 
}

export default RightBottom
