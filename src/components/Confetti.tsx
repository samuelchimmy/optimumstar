
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
    for (let i = 0; i < 100; i++) {
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
      
      // Random size
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 15 + 5}px`;
      
      container.appendChild(confetti);
      
      // Remove after animation completes
      setTimeout(() => {
        if (confetti.parentNode === container) {
          container.removeChild(confetti);
        }
      }, 8000);
    }
    
  }, [active]);
  
  if (!active) return null;
  
  return <div className="fixed inset-0 pointer-events-none z-50" ref={confettiRef} />;
}
