
import { useEffect, useRef } from 'react';

export default function BubbleBackground() {
  const bubbleBgRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!bubbleBgRef.current) return;
    
    const bubbleContainer = bubbleBgRef.current;
    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      
      // Random size between 50px and 200px
      const size = Math.random() * 150 + 50;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      
      // Random position
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.top = `${Math.random() * 100}%`;
      
      // Random animation duration between 10s and 25s
      bubble.style.animationDuration = `${Math.random() * 15 + 10}s`;
      
      // Random animation delay
      bubble.style.animationDelay = `${Math.random() * 5}s`;
      
      // Random opacity
      bubble.style.opacity = `${Math.random() * 0.3 + 0.05}`;
      
      bubbleContainer.appendChild(bubble);
      
      // Remove bubble after animation completes to prevent DOM bloat
      setTimeout(() => {
        bubble.remove();
      }, 30000); // 30s max animation duration + delay
    };
    
    // Create initial bubbles
    for (let i = 0; i < 15; i++) {
      createBubble();
    }
    
    // Create new bubbles periodically
    const intervalId = setInterval(() => {
      createBubble();
    }, 3000);
    
    return () => {
      clearInterval(intervalId);
      // Clear all bubbles when component unmounts
      while (bubbleContainer.firstChild) {
        bubbleContainer.removeChild(bubbleContainer.firstChild);
      }
    };
  }, []);
  
  return <div className="bubble-bg" ref={bubbleBgRef} />;
}
