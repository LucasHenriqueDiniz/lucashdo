import { motion } from 'framer-motion';
import React from 'react';

/**
 * LoadingSpinner - Um spinner animado usando framer-motion para telas de loading.
 *
 * Props:
 *   - size: número (opcional, padrão 48) - tamanho do spinner em px
 *   - color: string (opcional, padrão roxo) - cor do spinner
 *
 * Exemplo de uso:
 *   <LoadingSpinner size={40} color="#10b981" />
 */
export default function LoadingSpinner({
  size = 48,
  color = '#6366f1',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <motion.div
      style={{ width: size, height: size, display: 'inline-block' }}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 6}
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={Math.PI * (size - 12)}
          strokeDashoffset={Math.PI * (size - 12) * 0.25}
          initial={{
            strokeDashoffset: Math.PI * (size - 12) * 0.75,
          }}
          animate={{
            strokeDashoffset: [Math.PI * (size - 12) * 0.75, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </motion.div>
  );
}
