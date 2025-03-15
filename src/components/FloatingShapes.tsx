
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingShapesProps {
  count?: number;
  variant?: 'default' | 'leaderboard' | 'donate';
}

const FloatingShapes: React.FC<FloatingShapesProps> = ({ count = 7, variant = 'default' }) => {
  const [shapes, setShapes] = useState<{ id: number; size: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    const generateShapes = () => {
      const newShapes = Array.from({ length: count }, (_, i) => ({
        id: i,
        size: Math.random() * 300 + 100,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5
      }));
      setShapes(newShapes);
    };

    generateShapes();
    window.addEventListener('resize', generateShapes);
    
    return () => {
      window.removeEventListener('resize', generateShapes);
    };
  }, [count]);

  const getVariantColors = () => {
    switch (variant) {
      case 'leaderboard':
        return ['bg-purple-400/10', 'bg-fuchsia-400/10', 'bg-violet-400/10'];
      case 'donate':
        return ['bg-pink-400/10', 'bg-fuchsia-400/10', 'bg-purple-400/10'];
      default:
        return ['bg-primary/10', 'bg-secondary/10', 'bg-accent/10'];
    }
  };

  const colors = getVariantColors();

  return (
    <div className="floating-shapes">
      <div className="animated-bg"></div>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`floating-shape ${colors[shape.id % colors.length]}`}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            x: [
              Math.random() * 50 - 25,
              Math.random() * 50 - 25,
              Math.random() * 50 - 25,
              Math.random() * 50 - 25
            ],
            y: [
              Math.random() * 50 - 25,
              Math.random() * 50 - 25,
              Math.random() * 50 - 25,
              Math.random() * 50 - 25
            ]
          }}
          transition={{
            duration: 20 + shape.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: shape.delay
          }}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;
