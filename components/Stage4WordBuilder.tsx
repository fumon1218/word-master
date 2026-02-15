import React, { useState, useEffect } from 'react';
import { generateWords } from '../services/geminiService';
import { ChevronLeft, RefreshCcw, Star } from 'lucide-react';

interface Stage4WordBuilderProps {
  onBack: () => void;
}

const Stage4WordBuilder: React.FC<Stage4WordBuilderProps> = ({ onBack }) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledParts, setScrambledParts] = useState<{char: string, id: number}[]>([]);
  const [selectedParts, setSelectedParts] = useState<{char: string, id: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    setLoading(true);
    const newWords = await generateWords();
    setWords(newWords);
    setCurrentWordIndex(0);
    prepareLevel(newWords[0]);
    setLoading(false);
    setCompleted(false);
  };

  const prepareLevel = (word: string) => {
    if (!word) return;
    const parts = word.split('').map((char, idx) => ({ char, id: idx }));
    // Shuffle
    const shuffled = [...parts].sort(() => Math.random() - 0.5);
    setScrambledParts(shuffled);
    setSelectedParts([]);
  };

  const handleSelect = (part: {char: string, id: number}) => {
    const newSelected = [...selectedParts, part];
    setSelectedParts(newSelected);
    setScrambledParts(prev => prev.filter(p => p.id !== part.id));

    // Check completion immediately
    if (newSelected.length === words[currentWordIndex].length) {
      const formedWord = newSelected.map(p => p.char).join('');
      if (formedWord === words[currentWordIndex]) {
        // Success
        setTimeout(() => {
          handleNextWord();
        }, 800);
      } else {
        // Incorrect - Reset after short delay
        setTimeout(() => {
           resetCurrent();
        }, 800);
      }
    }
  };

  const resetCurrent = () => {
    prepareLevel(words[currentWordIndex]);
  };

  const handleNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      prepareLevel(words[nextIndex]);
    } else {
      setCompleted(true);
    }
  };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center bg-yellow-50 text-2xl font-bold text-yellow-600">
            단어를 불러오고 있어요...
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-yellow-50">
      <div className="p-4 flex justify-between items-center bg-yellow-200 shadow-md">
        <button onClick={onBack} className="p-2 bg-white rounded-full hover:bg-gray-100">
          <ChevronLeft />
        </button>
        <h2 className="text-2xl font-bold game-font text-yellow-800">단어 만들기</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {completed ? (
           <div className="text-center">
             <Star size={80} className="text-yellow-400 mx-auto mb-4 animate-bounce" fill="currentColor" />
             <h3 className="text-3xl font-bold mb-6">참 잘했어요!</h3>
             <button 
                onClick={loadWords}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl"
             >
                새로운 단어 하기
             </button>
           </div>
        ) : (
            <>
                <div className="mb-12 text-center">
                    <p className="text-gray-500 mb-2">이 단어를 만들어보세요!</p>
                    {/* Placeholder for hints? Or just rely on unscrambling. 
                        Let's show a missing outline or box. 
                    */}
                    <div className="flex gap-2 justify-center min-h-[80px]">
                        {Array.from({length: words[currentWordIndex].length}).map((_, i) => (
                            <div key={i} className="w-20 h-20 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-4xl font-bold bg-white text-yellow-600">
                                {selectedParts[i]?.char}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 flex-wrap justify-center">
                    {scrambledParts.map((part) => (
                        <button
                            key={part.id}
                            onClick={() => handleSelect(part)}
                            className="w-20 h-20 bg-yellow-400 hover:bg-yellow-500 text-white text-4xl font-bold rounded-xl shadow-lg transform transition active:scale-95"
                        >
                            {part.char}
                        </button>
                    ))}
                </div>

                <div className="mt-12">
                     <button onClick={resetCurrent} className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                        <RefreshCcw size={20} /> 다시하기
                     </button>
                </div>
                
                <div className="mt-4 text-sm text-gray-400">
                    {currentWordIndex + 1} / {words.length}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default Stage4WordBuilder;
