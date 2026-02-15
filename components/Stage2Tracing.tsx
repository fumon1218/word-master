import React, { useState, useRef } from 'react';
import { CONSONANTS, SYLLABLES_BY_CONSONANT } from '../constants';
import { ChevronLeft, ChevronRight, Eraser, Check } from 'lucide-react';
import CanvasDraw, { CanvasDrawHandle } from './CanvasDraw';

interface Stage2TracingProps {
  onBack: () => void;
}

const Stage2Tracing: React.FC<Stage2TracingProps> = ({ onBack }) => {
  const [currentConsonantIndex, setCurrentConsonantIndex] = useState(0);
  const [currentVowelIndex, setCurrentVowelIndex] = useState(0);
  const canvasRef = useRef<CanvasDrawHandle>(null);

  const currentConsonant = CONSONANTS[currentConsonantIndex];
  const syllables = SYLLABLES_BY_CONSONANT[currentConsonant] || [];
  const currentSyllable = syllables[currentVowelIndex] || '';

  const handleNext = () => {
    canvasRef.current?.clear();
    if (currentVowelIndex < syllables.length - 1) {
      setCurrentVowelIndex(prev => prev + 1);
    } else {
      if (currentConsonantIndex < CONSONANTS.length - 1) {
        setCurrentConsonantIndex(prev => prev + 1);
        setCurrentVowelIndex(0);
      } else {
        alert("모든 글자를 다 썼어요! 대단해요!");
        onBack();
      }
    }
  };

  const handlePrev = () => {
    canvasRef.current?.clear();
    if (currentVowelIndex > 0) {
      setCurrentVowelIndex(prev => prev - 1);
    } else if (currentConsonantIndex > 0) {
      setCurrentConsonantIndex(prev => prev - 1);
      // Set to last vowel of prev consonant
      const prevC = CONSONANTS[currentConsonantIndex - 1];
      setCurrentVowelIndex(SYLLABLES_BY_CONSONANT[prevC].length - 1);
    }
  };

  const clearCanvas = () => {
    canvasRef.current?.clear();
  };

  return (
    <div className="flex flex-col h-screen bg-green-50">
      <div className="p-4 flex justify-between items-center bg-green-200 shadow-md">
        <button onClick={onBack} className="p-2 bg-white rounded-full hover:bg-gray-100">
          <ChevronLeft />
        </button>
        <h2 className="text-2xl font-bold game-font text-green-800">따라 쓰기: {currentSyllable}</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative mb-8">
            {/* Guide Text */}
            <div className="text-[200px] font-bold text-gray-200 select-none pointer-events-none font-['Gowun_Dodum'] leading-none">
                {currentSyllable}
            </div>
            {/* Drawing Canvas Overlay */}
            <div className="absolute top-0 left-0 w-full h-full">
                <CanvasDraw 
                    ref={canvasRef}
                    width={200} // Approximate width of the character render
                    height={200} // Approximate height
                    strokeWidth={15}
                    strokeColor="#16a34a" // green-600
                />
            </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 items-center">
            <button 
                onClick={handlePrev}
                disabled={currentConsonantIndex === 0 && currentVowelIndex === 0}
                className="p-4 bg-gray-200 rounded-full disabled:opacity-30 hover:bg-gray-300"
            >
                <ChevronLeft size={32} />
            </button>

            <button 
                onClick={clearCanvas}
                className="flex flex-col items-center gap-1 p-4 bg-orange-100 rounded-2xl hover:bg-orange-200 text-orange-700"
            >
                <Eraser size={24} />
                <span className="text-sm font-bold">지우기</span>
            </button>

            <button 
                onClick={handleNext}
                className="flex items-center gap-2 p-4 bg-green-500 rounded-2xl hover:bg-green-600 text-white shadow-lg transform transition active:scale-95"
            >
                <span className="text-xl font-bold">다음</span>
                <ChevronRight size={32} />
            </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-full max-w-md bg-gray-200 rounded-full h-4">
            <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-300"
                style={{ 
                    width: `${((currentConsonantIndex * 10 + currentVowelIndex) / (CONSONANTS.length * 10)) * 100}%` 
                }}
            ></div>
        </div>
        <p className="mt-2 text-gray-500 text-sm">
            {currentConsonant} 순서 ({currentVowelIndex + 1}/{syllables.length})
        </p>
      </div>
    </div>
  );
};

export default Stage2Tracing;
