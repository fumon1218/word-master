import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

interface CanvasDrawProps {
  width: number;
  height: number;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundText?: string;
  onDrawEnd?: () => void;
}

export interface CanvasDrawHandle {
  clear: () => void;
  isEmpty: () => boolean;
}

const CanvasDraw = forwardRef<CanvasDrawHandle, CanvasDrawProps>(({
  width,
  height,
  strokeColor = "black",
  strokeWidth = 10,
  backgroundText,
  onDrawEnd
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
        drawBackgroundText();
      }
    },
    isEmpty: () => !hasDrawn
  }));

  const drawBackgroundText = () => {
    if (!backgroundText || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We don't clear here because we might want to keep drawings on top.
    // Actually, usually we clear before redrawing background. 
    // But this component assumes the background is static guide.
    // For tracing, we usually render the text in a div BEHIND the canvas, not on it.
    // BUT if we want to save the result, drawing on canvas is useful.
    // Let's stick to the prop 'backgroundText' being rendered purely for guide if needed,
    // but better UI usually has the text in HTML/CSS behind the transparent canvas.
    // So let's ignore drawing text ON the canvas for now to allow easier tracing UI separation.
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    setHasDrawn(true);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (onDrawEnd) onDrawEnd();
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        // High DPI fix
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
    }
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      className="touch-none cursor-crosshair z-20 absolute top-0 left-0"
    />
  );
});

export default CanvasDraw;
