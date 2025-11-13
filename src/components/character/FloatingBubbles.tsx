'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const bubbles = [
  {
    src: '/svgs/bolas/bola_1.svg',
    fill: '#ff1500',
    delay: 0,
    duration: 8,
    x: '10%',
    size: 60,
    offsetX: [-20, 30],
  },
  {
    src: '/svgs/bolas/bola_2.svg',
    fill: '#ff1500',
    delay: 1,
    duration: 10,
    x: '20%',
    size: 80,
    offsetX: [-25, 25],
  },
  {
    src: '/svgs/bolas/bola_3.svg',
    fill: '#ff1500',
    delay: 2,
    duration: 12,
    x: '30%',
    size: 50,
    offsetX: [-15, 35],
  },
  {
    src: '/svgs/bolas/bola_4.svg',
    delay: 0.5,
    duration: 9,
    x: '70%',
    size: 70,
    offsetX: [-30, 20],
  },
  {
    src: '/svgs/bolas/bola_5.svg',
    delay: 1.5,
    duration: 11,
    x: '80%',
    size: 65,
    offsetX: [-10, 30],
  },
  {
    src: '/svgs/bolas/bola_6.svg',
    delay: 2.5,
    duration: 13,
    x: '50%',
    size: 55,
    offsetX: [-25, 25],
  },
  {
    src: '/svgs/bolas/bola_7.svg',
    delay: 0.8,
    duration: 14,
    x: '90%',
    size: 75,
    offsetX: [-20, 20],
  },
  {
    src: '/svgs/bolas/bola dupla.svg',
    delay: 1.2,
    duration: 10,
    x: '15%',
    size: 85,
    offsetX: [-15, 35],
  },
  {
    src: '/svgs/bolas/bola tripla.svg',
    delay: 2.2,
    duration: 12,
    x: '85%',
    size: 90,
    offsetX: [-30, 30],
  },
];

export default function FloatingBubbles() {
  const [screenHeight, setScreenHeight] = useState(1000);

  useEffect(() => {
    setScreenHeight(window.innerHeight);

    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none bubbles-front">
      {bubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: bubble.x,
            bottom: '-100px',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.7, 0.7, 0],
            y: [0, -screenHeight - 100],
            x: [0, bubble.offsetX[0], bubble.offsetX[1], bubble.offsetX[0]],
            scale: [0, 1, 1, 0.8],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          <Image
            src={bubble.src}
            alt={`bubble ${index}`}
            width={bubble.size}
            height={bubble.size}
            className="opacity-70"
            style={{ fill: bubble.fill }}
            unoptimized
          />
        </motion.div>
      ))}
    </div>
  );
}


