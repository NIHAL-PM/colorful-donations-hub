
import React from 'react';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'leaderboard' | 'admin' | 'donation';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant = 'default' }) => {
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

  return (
    <>
      <div className="animated-background" />
      <div 
        className={`fixed inset-0 -z-20 opacity-40 transition-opacity duration-1000 ease-in-out ${getGradientClass()}`}
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradient-animation 15s ease infinite',
        }}
      />
      <style jsx>{`
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
