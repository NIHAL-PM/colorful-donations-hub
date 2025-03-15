
import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'leaderboard' | 'admin' | 'donation';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant = 'default' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const getGradientClass = () => {
    switch (variant) {
      case 'leaderboard':
        return 'bg-gradient-leaderboard';
      case 'admin':
        return 'bg-gradient-admin';
      case 'donation':
        return 'bg-gradient-payment';
      default:
        return 'bg-gradient-primary';
    }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
    }[] = [];
    
    const colors = variant === 'donation' 
      ? ['rgba(79, 157, 105, 0.2)', 'rgba(143, 207, 209, 0.2)', 'rgba(242, 208, 164, 0.2)']
      : ['rgba(143, 207, 209, 0.2)', 'rgba(79, 157, 105, 0.2)', 'rgba(249, 243, 223, 0.2)'];
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [variant]);
  
  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 -z-20 opacity-30"
      />
      <div 
        className={`fixed inset-0 -z-10 opacity-40 transition-opacity duration-1000 ease-in-out ${getGradientClass()}`}
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradient-animation 15s ease infinite',
        }}
      />
      <div className="animated-background" />
      <style>{`
        @keyframes gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedBackground;
