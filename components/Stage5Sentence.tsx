import React, { useState, useEffect, useRef } from 'react';
import { generateSentences } from '../services/geminiService';
import { ChevronLeft, Keyboard, PenTool, CheckCircle, RefreshCcw } from 'lucide-react';
import CanvasDraw, { CanvasDrawHandle } from './CanvasDraw';

interface Stage5SentenceProps {
  onBack: () => void;
}

const Stage5Sentence: React.FC<Stage5SentenceProps> = ({ onBack }) => {
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'typing' | 'writing'>('typing');
  const [typedInput, setTypedInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  
  const canvasRef = useRef<CanvasDrawHandle>(null);

  useEffect(() => {
    loadSentences();
  }, []);

  const loadSentences = async () => {
    setLoading(true);
    const data = await generateSentences();
    setSentences(data);
    setCurrentIndex(0);
    setLoading(false);
    resetState();
  };

  const resetState = () => {
    setTypedInput('');
    setIsCorrect(false);
    canvasRef.current?.clear();
  };

  const currentSentence = sentences[currentIndex];

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedInput(e.target.value);
    if (e.target.value.trim() === currentSentence) {
      setIsCorrect(true);
    } else {
        setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetState();
    } else {
      alert("모든 문장을 완료했어요!");
      onBack();
    }
  };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center bg-pink-50 text-2xl font-bold text-pink-600">
            문장을 만들고 있어요...
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-pink-50 overflow-y-auto">
      <div className="p-4 flex justify-between items-center bg-pink-200 shadow-md sticky top-0 z-50">
        <button onClick={onBack} className="p-2 bg-white rounded-full hover:bg-gray-100">
          <ChevronLeft />
        </button>
        <h2 className="text-xl font-bold game-font text-pink-800 hidden sm:block">문장 따라 쓰기</h2>
        <div className="flex gap-2">
            <button 
                onClick={() => setMode('typing')}
                className={`p-2 rounded-lg flex items-center gap-1 ${mode === 'typing' ? 'bg-pink-500 text-white' : 'bg-white text-pink-500'}`}
            >
                <Keyboard size={20} /> <span className="text-sm font-bold">타자</span>
            </button>
            <button 
                onClick={() => setMode('writing')}
                className={`p-2 rounded-lg flex items-center gap-1 ${mode === 'writing' ? 'bg-pink-500 text-white' : 'bg-white text-pink-500'}`}
            >
                <PenTool size={20} /> <span className="text-sm font-bold">판서</span>
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-4 sm:p-8 max-w-4xl mx-auto w-full">
        {/* Sentence Display */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-pink-100 mb-8 w-full text-center">
            <p className="text-sm text-gray-500 mb-2">다음 문장을 따라 쓰세요</p>
            <h3 className="text-2xl sm:text-4xl font-bold text-gray-800 break-keep leading-relaxed font-['Gowun_Dodum']">
                {currentSentence}
            </h3>
        </div>

        {/* Interaction Area */}
        <div className="w-full mb-8">
            {mode === 'typing' ? (
                <div className="relative">
                    <input 
                        type="text" 
                        value={typedInput}
                        onChange={handleTyping}
                        className={`w-full p-6 text-xl sm:text-3xl text-center rounded-2xl border-4 outline-none transition-colors ${
                            isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-300 focus:border-pink-400'
                        }`}
                        placeholder="여기에 입력하세요"
                    />
                    {isCorrect && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500">
                            <CheckCircle size={40} />
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative w-full aspect-[2/1] bg-white rounded-2xl shadow-inner border-4 border-gray-200 overflow-hidden">
                     {/* Guide text faintly in background for writing mode? Optional.
                         Let's keep it blank for free writing like a blackboard. 
                     */}
                     <div className="absolute top-4 left-4 text-gray-400 select-none pointer-events-none">
                        이곳에 손가락이나 마우스로 써보세요
                     </div>
                     <CanvasDraw 
                        ref={canvasRef}
                        width={800} // Fixed large width, scaling via CSS if needed
                        height={400}
                        strokeColor="#000"
                        strokeWidth={4}
                     />
                     <button 
                        onClick={() => canvasRef.current?.clear()}
                        className="absolute bottom-4 right-4 bg-gray-200 p-2 rounded-lg text-sm font-bold z-30"
                     >
                        지우기
                     </button>
                </div>
            )}
        </div>

        {/* Next Button */}
        <div className="flex gap-4">
             {/* Only show next if correct in typing mode, or always in writing mode (since hard to validate) */}
             {(mode === 'writing' || isCorrect) && (
                 <button 
                    onClick={handleNext}
                    className="bg-pink-500 hover:bg-pink-600 text-white text-xl font-bold py-3 px-12 rounded-full shadow-xl transform transition hover:scale-105 animate-bounce"
                >
                    다음 문장
                </button>
             )}
        </div>

        <div className="mt-auto pt-8 text-pink-400 font-bold">
            {currentIndex + 1} / {sentences.length}
        </div>
      </div>
    </div>
  );
};

export default Stage5Sentence;
