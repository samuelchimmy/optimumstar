
import { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
}

export default function Confetti({ active }: ConfettiProps) {
  const confettiRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!active || !confettiRef.current) return;
    
    const container = confettiRef.current;
    const colors = ['#be8dff', '#7be48b', '#ffffff', '#be8dff80', '#7be48b80'];
    
    // Clear existing confetti pieces
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Create confetti pieces
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti-piece');
      
      // Random position
      confetti.style.left = `${Math.random() * 100}%`;
      
      // Random delay
      confetti.style.animationDelay = `${Math.random() * 3}s`;
      
      // Random duration between 3-7s
      confetti.style.animationDuration = `${Math.random() * 4 + 3}s`;
      
      // Random rotation
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      // Random color
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Random size and shape
      const size = Math.random() * 10 + 5;
      confetti.style.width = `${size}px`;
      
      // Mix of shapes: some are rectangles, some are circles
      if (Math.random() > 0.5) {
        confetti.style.height = `${size}px`;
        confetti.style.borderRadius = '50%';
      } else {
        confetti.style.height = `${Math.random() * 15 + 5}px`;
      }
      
      // Add some 3D rotation
      confetti.style.transform += ` rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg)`;
      
      container.appendChild(confetti);
      
      // Remove after animation completes
      setTimeout(() => {
        if (confetti.parentNode === container) {
          container.removeChild(confetti);
        }
      }, 8000);
    }
    
    // Add style to confetti pieces
    const style = document.createElement('style');
    style.textContent = `
      .confetti-piece {
        position: absolute;
        top: -10px;
        pointer-events: none;
        z-index: 100;
        animation: confetti-fall 3s ease-in-out forwards;
      }
      
      @keyframes confetti-fall {
        0% {
          transform: translateY(0) rotate(0) scale(1);
          opacity: 1;
        }
        80% {
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
    
  }, [active]);
  
  if (!active) return null;
  
  return <div className="fixed inset-0 pointer-events-none z-50" ref={confettiRef} />;
}
