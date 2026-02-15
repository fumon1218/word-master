import React, { useEffect, useRef, useState } from 'react';
import { CONSONANTS, VOWELS } from '../constants';
import { FallingItem } from '../types';
import { ChevronLeft } from 'lucide-react';

interface Stage1GameProps {
  onBack: () => void;
  mode: 'consonant' | 'vowel';
}

const Stage1Game: React.FC<Stage1GameProps> = ({ onBack, mode }) => {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);

  const targets = mode === 'consonant' ? CONSONANTS : VOWELS;
  const currentTarget = targets[targetIndex];

  const spawnItem = (width: number) => {
    const id = Date.now() + Math.random();
    // 40% chance to spawn the target, 60% random other
    const isTarget = Math.random() < 0.4;
    const char = isTarget 
      ? currentTarget 
      : targets[Math.floor(Math.random() * targets.length)];

    return {
      id,
      char,
      x: Math.random() * (width - 60), // Keep within bounds
      y: -50,
      speed: 2 + Math.random() * 2 + (score * 0.1), // Increase speed with score
      isTarget
    };
  };

  const gameLoop = () => {
    if (!containerRef.current || !basketRef.current) return;

    const containerHeight = containerRef.current.offsetHeight;
    const containerWidth = containerRef.current.offsetWidth;
    const basketRect = basketRef.current.getBoundingClientRect();
    const now = Date.now();

    // Spawn
    if (now - lastSpawnTime.current > 1000) {
      setItems(prev => [...prev, spawnItem(containerWidth)]);
      lastSpawnTime.current = now;
    }

    setItems(prevItems => {
      const newItems: FallingItem[] = [];
      let hitTarget = false;

      prevItems.forEach(item => {
        const nextY = item.y + item.speed;
        
        // Collision Detection
        // Since basket is fixed at bottom relative to container in DOM, we check Y intersection carefully
        // Or simplified: if y > containerHeight - basketHeight - 10 AND x matches
        const hitZoneY = containerHeight - 80; 

        if (nextY >= hitZoneY && nextY < hitZoneY + 50) {
            // Check X overlap
            // We need absolute X of item relative to viewport to compare with basketRect
            // But basketRect is viewport relative. Item x is container relative.
            // Let's make basket move with mouse/touch within container.
            
            // Simplified: We track basket X (percent or px) in state or ref
            const basketX = parseFloat(basketRef.current?.style.left || '0');
            // Convert basketX (px) to range
            // basket width approx 80px
            if (item.x + 30 > basketX && item.x < basketX + 80) {
                if (item.char === currentTarget) {
                    hitTarget = true;
                    // Catch!
                    return; // Remove from array
                } else {
                    // Wrong item, just bounce or disappear? 
                    // Let's remove but penalize? Or just ignore.
                    // Guide says "catch in order". Catching wrong shouldn't advance.
                    // For game feel, maybe bounce off? Simplified: remove.
                    return; 
                }
            }
        }

        if (nextY < containerHeight) {
          newItems.push({ ...item, y: nextY });
        }
      });

      if (hitTarget) {
         // Update state outside loop to avoid race conditions in setState
         // Handled in useEffect or forced here?
         // We can't setTargetIndex here directly if it depends on prev state cleanly inside loop
         // We'll return a flag to effect
         // Actually, we can dispatch an event or just cheat slightly by checking outside
      }
      return newItems;
    });
    
    // We need to detect hitTarget result. 
    // The functional update above is pure. 
    // Let's move collision logic out of functional update slightly or use a ref queue.
    
    // BETTER APPROACH for React Game Loop:
    // Update positions. 
    // Then check collisions on the updated state.
    
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  // Revised Game Loop with clearer logic
  const updateGame = () => {
    if (!isPlaying || gameOver) return;
    const now = Date.now();
    const container = containerRef.current;
    if (!container) {
        requestRef.current = requestAnimationFrame(updateGame);
        return;
    }
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Spawn
    if (now - lastSpawnTime.current > (1500 - Math.min(score * 20, 1000))) {
        setItems(prev => [...prev, spawnItem(width)]);
        lastSpawnTime.current = now;
    }

    // Move & Collision
    setItems(prev => {
        const nextItems: FallingItem[] = [];
        let caughtTarget = false;

        // Get basket pos
        const basketLeft = basketRef.current?.offsetLeft || 0;
        const basketWidth = 96; // w-24
        const basketRight = basketLeft + basketWidth;
        const catchY = height - 100;

        prev.forEach(item => {
            const newY = item.y + item.speed;
            const itemCenter = item.x + 25; // item width ~50

            // Check collision
            if (newY > catchY && newY < catchY + item.speed + 10) {
                if (itemCenter > basketLeft && itemCenter < basketRight) {
                     if (item.char === targets[targetIndex]) {
                         caughtTarget = true;
                         return; // Consumed
                     }
                }
            }

            if (newY < height) {
                nextItems.push({ ...item, y: newY });
            }
        });

        if (caughtTarget) {
            handleCatch();
        }

        return nextItems;
    });

    requestRef.current = requestAnimationFrame(updateGame);
  };

  const handleCatch = () => {
    setScore(s => s + 10);
    setTargetIndex(prev => {
        const next = prev + 1;
        if (next >= targets.length) {
            setGameOver(true);
            setIsPlaying(false);
            return prev;
        }
        return next;
    });
  };

  useEffect(() => {
    if (isPlaying && !gameOver) {
        requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, gameOver, targetIndex]); // depend on targetIndex to refresh closure for targets

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current || !basketRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let clientX;
    
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
    } else {
        clientX = (e as React.MouseEvent).clientX;
    }

    let x = clientX - rect.left - 48; // center basket
    // Clamp
    x = Math.max(0, Math.min(x, rect.width - 96));
    basketRef.current.style.left = `${x}px`;
  };

  const restart = () => {
    setScore(0);
    setTargetIndex(0);
    setItems([]);
    setGameOver(false);
    setIsPlaying(true);
    lastSpawnTime.current = Date.now();
  };

  return (
    <div className="flex flex-col h-screen bg-blue-100 touch-none">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-blue-200 shadow-md z-10">
        <button onClick={onBack} className="p-2 bg-white rounded-full hover:bg-gray-100">
          <ChevronLeft />
        </button>
        <div className="text-2xl font-bold game-font text-blue-800">
            목표: <span className="text-red-500 text-4xl mx-2">{targets[targetIndex] || '끝!'}</span>
        </div>
        <div className="text-xl font-bold">점수: {score}</div>
      </div>

      {/* Game Area */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                <button 
                    onClick={restart}
                    className="bg-green-500 hover:bg-green-600 text-white text-3xl font-bold py-4 px-8 rounded-2xl shadow-lg transform transition hover:scale-110"
                >
                    시작하기
                </button>
            </div>
        )}

        {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 text-white">
                <h2 className="text-5xl font-bold mb-8 text-yellow-300">성공!</h2>
                <p className="text-2xl mb-8">모든 글자를 모았어요!</p>
                <div className="flex gap-4">
                     <button 
                        onClick={restart}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-3 px-6 rounded-xl"
                    >
                        다시하기
                    </button>
                     <button 
                        onClick={onBack}
                        className="bg-gray-500 hover:bg-gray-600 text-white text-xl font-bold py-3 px-6 rounded-xl"
                    >
                        나가기
                    </button>
                </div>
            </div>
        )}

        {/* Falling Items */}
        {items.map(item => (
            <div
                key={item.id}
                className="absolute flex items-center justify-center text-3xl font-bold text-gray-800 bg-white/80 rounded-full shadow-sm border-2 border-gray-300"
                style={{
                    left: item.x,
                    top: item.y,
                    width: '50px',
                    height: '50px',
                    color: item.char === targets[targetIndex] ? 'red' : 'black'
                }}
            >
                {item.char}
            </div>
        ))}

        {/* Basket */}
        <div 
            ref={basketRef}
            className="absolute bottom-4 w-24 h-24 bg-contain bg-no-repeat bg-center transition-transform duration-75"
            style={{ 
                backgroundImage: 'url("https://cdn-icons-png.flaticon.com/512/2921/2921822.png")', // Simple basket/bag icon
                left: 'calc(50% - 48px)'
            }}
        >
             {/* Character Helper */}
             <div className="absolute -top-12 left-0 w-full text-center text-sm font-bold bg-white/70 rounded-md px-1">
                여기 담으세요!
             </div>
        </div>

        {/* Sky Elements Decoration */}
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-pulse">☁️</div>
        <div className="absolute top-20 right-20 text-5xl opacity-20 animate-pulse delay-700">☁️</div>
      </div>
    </div>
  );
};

export default Stage1Game;
