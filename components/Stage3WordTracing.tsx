import React, { useState, useRef } from 'react';
import { WORDS_NO_BATCHIM } from '../constants';
import { ChevronLeft, ChevronRight, Eraser } from 'lucide-react';
import CanvasDraw, { CanvasDrawHandle } from './CanvasDraw';

interface Stage3WordTracingProps {
  onBack: () => void;
}

const Stage3WordTracing: React.FC<Stage3WordTracingProps> = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const canvasRef = useRef<CanvasDrawHandle>(null);

  const currentWord = WORDS_NO_BATCHIM[currentIndex];

  const handleNext = () => {
    canvasRef.current?.clear();
    if (currentIndex < WORDS_NO_BATCHIM.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert("모든 단어를 다 썼어요! 훌륭해요!");
      onBack();
    }
  };

  const handlePrev = () => {
    canvasRef.current?.clear();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-purple-50">
      <div className="p-4 flex justify-between items-center bg-purple-200 shadow-md">
        <button onClick={onBack} className="p-2 bg-white rounded-full hover:bg-gray-100">
          <ChevronLeft />
        </button>
        <h2 className="text-2xl font-bold game-font text-purple-800">단어 쓰기: {currentWord}</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative mb-12 bg-white p-8 rounded-3xl shadow-lg border-4 border-purple-100">
             {/* Word Container */}
             <div className="relative">
                <div className="flex gap-4">
                    {currentWord.split('').map((char, i) => (
                        <div key={i} className="text-[120px] font-bold text-gray-200 select-none font-['Gowun_Dodum'] leading-none w-[120px] text-center">
                            {char}
                        </div>
                    ))}
                </div>
                {/* Canvas covers the entire word area */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <CanvasDraw 
                        ref={canvasRef}
                        width={120 * currentWord.length + 16 * (currentWord.length - 1)} // width of chars + gaps
                        height={120}
                        strokeWidth={12}
                        strokeColor="#9333ea"
                    />
                </div>
             </div>
        </div>

        <div className="flex gap-6 items-center">
            <button 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-4 bg-gray-200 rounded-full disabled:opacity-30 hover:bg-gray-300"
            >
                <ChevronLeft size={32} />
            </button>

            <button 
                onClick={() => canvasRef.current?.clear()}
                className="flex flex-col items-center gap-1 p-4 bg-orange-100 rounded-2xl hover:bg-orange-200 text-orange-700"
            >
                <Eraser size={24} />
                <span className="text-sm font-bold">지우기</span>
            </button>

            <button 
                onClick={handleNext}
                className="flex items-center gap-2 p-4 bg-purple-500 rounded-2xl hover:bg-purple-600 text-white shadow-lg transform transition active:scale-95"
            >
                <span className="text-xl font-bold">다음</span>
                <ChevronRight size={32} />
            </button>
        </div>

        <div className="mt-8 text-purple-600 font-bold">
            {currentIndex + 1} / {WORDS_NO_BATCHIM.length}
        </div>
      </div>
    </div>
  );
};

export default Stage3WordTracing;
