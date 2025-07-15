'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '@/components/ui/animations';

export default function Loading() {
  return (
    <AnimatePresence>
      <motion.div
        key="loading-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(99, 102, 241, 0.10)',
          backdropFilter: 'blur(8px)',
        }}
        aria-busy="true"
        aria-label="Carregando conteúdo"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <LoadingSpinner size={64} color="#6366f1" />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ marginTop: 24, color: '#6366f1', fontWeight: 500, fontSize: 20 }}
          >
            Carregando...
          </motion.span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
