import React, { useState, useEffect } from 'react';
import { Stage } from './types';
import Stage1Game from './components/Stage1Game';
import Stage2Tracing from './components/Stage2Tracing';
import Stage3WordTracing from './components/Stage3WordTracing';
import Stage4WordBuilder from './components/Stage4WordBuilder';
import Stage5Sentence from './components/Stage5Sentence';

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<Stage>(Stage.HOME);
  const [stage1Mode, setStage1Mode] = useState<'consonant' | 'vowel'>('consonant');
  const [showStage1Menu, setShowStage1Menu] = useState(false);

  // 사용자가 업로드한 여우 캐릭터 (파란 별무늬 스카프를 맨 3D 여우)
  // 실제 사용 시 업로드한 이미지의 URL로 교체해주세요. 
  // 현재는 가장 유사한 3D 여우 이미지를 placeholder로 사용합니다.
  const FOX_CHARACTER_URL = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Fox.png";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowStage1Menu(false);
    if (showStage1Menu) {
        document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showStage1Menu]);

  const renderStage = () => {
    switch (currentStage) {
      case Stage.STAGE_1:
        return <Stage1Game onBack={() => setCurrentStage(Stage.HOME)} mode={stage1Mode} />;
      case Stage.STAGE_2:
        return <Stage2Tracing onBack={() => setCurrentStage(Stage.HOME)} />;
      case Stage.STAGE_3:
        return <Stage3WordTracing onBack={() => setCurrentStage(Stage.HOME)} />;
      case Stage.STAGE_4:
        return <Stage4WordBuilder onBack={() => setCurrentStage(Stage.HOME)} />;
      case Stage.STAGE_5:
        return <Stage5Sentence onBack={() => setCurrentStage(Stage.HOME)} />;
      default:
        return renderHome();
    }
  };

  const renderHome = () => (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black overflow-hidden relative font-sans text-white">
      {/* Dynamic Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         {[...Array(30)].map((_, i) => (
           <div key={i} className="star"
             style={{
               top: `${Math.random() * 100}%`,
               left: `${Math.random() * 100}%`,
               width: `${Math.random() * 3 + 2}px`,
               height: `${Math.random() * 3 + 2}px`,
               animationDelay: `${Math.random() * 5}s`,
               animationDuration: `${Math.random() * 3 + 2}s`
             }}
           />
         ))}
      </div>

      {/* Header */}
      <header className="relative z-10 text-center pt-8 pb-4">
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 font-['Jua'] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] animate-pulse">
          한글별 여행
        </h1>
        <p className="text-lg md:text-xl text-blue-200 mt-2 font-['Jua']">여우와 함께 떠나는 신나는 한글 공부!</p>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-6xl mx-auto h-[calc(100vh-150px)]">
        
        {/* Main Character (Left Bottom) */}
        <div className="absolute bottom-10 left-10 md:bottom-20 md:left-24 w-40 md:w-64 animate-float z-20 pointer-events-none">
           <img 
             src={FOX_CHARACTER_URL} 
             alt="Fox Character" 
             className="w-full h-auto drop-shadow-2xl filter brightness-110"
           />
           {/* Speech Bubble */}
           <div className="absolute -top-12 -right-12 md:-top-20 md:-right-24 bg-white text-black p-3 md:p-5 rounded-2xl rounded-bl-none shadow-xl border-4 border-blue-400 min-w-[140px] md:min-w-[180px]">
              <p className="font-bold font-['Jua'] text-sm md:text-lg text-center leading-snug">
                안녕! <br/>나랑 같이 별을<br/>여행해보자!
              </p>
           </div>
        </div>

        {/* Map Container */}
        <div className="absolute inset-0 w-full h-full">
            {/* SVG Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet">
                <path 
                    d="M 200 650 Q 400 600 500 450 T 800 300 T 500 100" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="6" 
                    strokeDasharray="15 15" 
                    strokeLinecap="round"
                />
            </svg>

            {/* Planets */}
            
            {/* 1. Sound Star (Updated to Full Character Button) */}
            <div className="absolute left-[20%] bottom-[15%] md:left-[18%] md:bottom-[15%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-30">
                <button 
                onClick={(e) => { e.stopPropagation(); setShowStage1Menu(!showStage1Menu); }}
                className="relative group-hover:scale-110 transition-transform duration-300"
                >
                    {/* Glowing Aura (The Star) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-blue-500/30 rounded-full blur-xl animate-pulse"></div>
                    
                    {/* Full Character Image (No Clipping) */}
                    <img 
                        src={FOX_CHARACTER_URL} 
                        alt="Fox Star" 
                        className="relative w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl z-10" 
                    />
                    
                    {/* Interaction Hint Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/50 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500"></div>
                </button>
                
                <div className="mt-2 bg-blue-900/90 text-cyan-100 px-4 py-2 rounded-xl text-lg md:text-xl font-bold font-['Jua'] backdrop-blur-sm border-2 border-blue-400 shadow-lg z-20">
                    1. 소리 별
                </div>
                
                {/* Stage 1 Popup Menu */}
                {showStage1Menu && (
                   <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 p-3 rounded-2xl shadow-2xl w-48 flex flex-col gap-2 z-50 animate-[bounce_0.5s_ease-out]">
                      <div className="text-sm font-bold text-center text-gray-500 mb-1">무엇을 잡을까?</div>
                      <div className="flex gap-2">
                          <button
                            onClick={() => { setStage1Mode('consonant'); setCurrentStage(Stage.STAGE_1); }}
                            className="flex-1 py-3 bg-blue-100 hover:bg-blue-200 rounded-xl text-center font-bold text-blue-800 transition-colors"
                          >
                            자음<br/><span className="text-xs font-normal">ㄱ~ㅎ</span>
                          </button>
                          <button
                            onClick={() => { setStage1Mode('vowel'); setCurrentStage(Stage.STAGE_1); }}
                            className="flex-1 py-3 bg-pink-100 hover:bg-pink-200 rounded-xl text-center font-bold text-pink-800 transition-colors"
                          >
                            모음<br/><span className="text-xs font-normal">ㅏ~ㅣ</span>
                          </button>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                   </div>
                )}
            </div>

            {/* 2. Writing Star */}
            <div className="absolute left-[50%] bottom-[35%] md:left-[50%] md:bottom-[40%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-30">
                <button 
                onClick={() => setCurrentStage(Stage.STAGE_2)}
                className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 shadow-[0_0_30px_rgba(52,211,153,0.6)] border-4 border-green-100 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:-rotate-6"
                >
                    <span className="text-5xl md:text-6xl filter drop-shadow-md">✏️</span>
                </button>
                <div className="mt-3 bg-green-900/80 text-green-100 px-4 py-1 rounded-full text-lg md:text-xl font-bold font-['Jua'] backdrop-blur-sm border border-green-500">
                    2. 쓰기 별
                </div>
            </div>

            {/* 3. Word Star */}
            <div className="absolute left-[80%] bottom-[55%] md:left-[80%] md:bottom-[60%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-30">
                <button 
                onClick={() => setCurrentStage(Stage.STAGE_3)}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 shadow-[0_0_30px_rgba(167,139,250,0.6)] border-4 border-purple-100 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12"
                >
                    <span className="text-4xl md:text-5xl filter drop-shadow-md">📖</span>
                </button>
                <div className="mt-3 bg-purple-900/80 text-purple-100 px-4 py-1 rounded-full text-lg md:text-xl font-bold font-['Jua'] backdrop-blur-sm border border-purple-500">
                    3. 단어 별
                </div>
            </div>

            {/* 4. Puzzle Star */}
            <div className="absolute left-[50%] top-[25%] md:left-[50%] md:top-[20%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-30">
                <button 
                onClick={() => setCurrentStage(Stage.STAGE_4)}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_0_30px_rgba(251,191,36,0.6)] border-4 border-amber-100 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:-rotate-12"
                >
                    <span className="text-4xl md:text-5xl filter drop-shadow-md">🧩</span>
                </button>
                <div className="mt-3 bg-orange-900/80 text-orange-100 px-4 py-1 rounded-full text-lg md:text-xl font-bold font-['Jua'] backdrop-blur-sm border border-orange-500">
                    4. 조립 별
                </div>
            </div>

            {/* 5. Story Star (Final) */}
            <div className="absolute left-[20%] top-[10%] md:left-[20%] md:top-[12%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-30">
                <button 
                onClick={() => setCurrentStage(Stage.STAGE_5)}
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-rose-400 to-red-600 shadow-[0_0_40px_rgba(244,63,94,0.8)] border-4 border-rose-100 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-3"
                >
                    <span className="text-6xl md:text-7xl filter drop-shadow-md">🏰</span>
                    <div className="absolute top-2 right-4 w-6 h-6 bg-white rounded-full opacity-30 blur-[2px]"></div>
                </button>
                <div className="mt-3 bg-red-900/80 text-rose-100 px-4 py-1 rounded-full text-lg md:text-xl font-bold font-['Jua'] backdrop-blur-sm border border-red-500">
                    5. 이야기 별
                </div>
            </div>

        </div>

        {/* Mobile-only Hint */}
        <div className="md:hidden absolute top-4 right-4 text-white/50 text-xs text-right">
            지도를 따라<br/>별을 여행하세요!
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {renderStage()}
    </div>
  );
};

export default App;