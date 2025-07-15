import { motion } from 'framer-motion';
import { Github, User } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import Avatar from 'boring-avatars';
import { GuestbookEntry } from '@/types/guestbook.types';
import styles from './GuestBook.module.css';

interface CarouselGuestbookProps {
  entries: GuestbookEntry[];
  featuredIndex: number;
  navigateNext: () => void;
  navigatePrev: () => void;
  entriesLength: number;
}

const ITEM_HEIGHT = 140;

const CarouselGuestbook: React.FC<CarouselGuestbookProps> = ({
  entries,
  featuredIndex,
  navigateNext,
  navigatePrev,
}) => {
  // Função para gerar avatar com boring-avatars como fallback
  const getAvatarContent = (entry: GuestbookEntry, isCenter: boolean) => {
    if (entry.avatar_url) {
      return (
        <Image
          src={entry.avatar_url}
          alt={entry.name}
          fill
          className={styles.testimonialAvatarImage}
          style={{
            objectFit: 'cover',
          }}
        />
      );
    }

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Avatar size={isCenter ? 90 : 70} name={entry.name} variant={'beam'} square={true} />
      </div>
    );
  };

  // Função para navegar quando clica em um item não central
  const handleItemClick = (offset: number) => {
    if (offset === 0) return; // Não fazer nada se clicar no item central

    if (offset < 0) {
      navigatePrev(); // Item anterior (em cima)
    } else {
      navigateNext(); // Próximo item (embaixo)
    }
  };

  // Função para pegar o item do carrossel com offset
  const getItem = (offset: number) => {
    if (entries.length === 0) return null;
    const idx = (featuredIndex + offset + entries.length) % entries.length;
    return entries[idx];
  };

  return (
    <div
      className={styles.carouselContainer}
      style={
        {
          position: 'relative',
          minHeight: ITEM_HEIGHT * 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
          '--primary': '#3b82f6', // Definindo a variável CSS
        } as React.CSSProperties
      }
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: ITEM_HEIGHT * 2.8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        }}
      >
        {[-1, 0, 1].map(offset => {
          const entry = getItem(offset);
          if (!entry) return null;

          const isCenter = offset === 0;
          const isPrev = offset < 0;

          return (
            <motion.div
              key={entry.id}
              animate={{
                y: offset * ITEM_HEIGHT * 1.1,
                opacity: isCenter ? 1 : 0.5,
                scale: isCenter ? 1 : 0.85,
                zIndex: isCenter ? 10 : 1,
              }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                margin: '0 auto',
                width: '100%',
                maxWidth: 'min(800px, calc(100vw - 32px))',
                cursor: isCenter ? 'default' : 'pointer',
                zIndex: isCenter ? 10 : 1,
              }}
              onClick={() => handleItemClick(offset)}
              whileHover={
                !isCenter
                  ? {
                      scale: 0.9,
                      opacity: 0.7,
                      transition: { duration: 0.2 },
                    }
                  : {}
              }
            >
              {/* Removido o wrapper do card - conteúdo direto */}
              <div className={styles.testimonialContent}>
                <div
                  className={styles.testimonialAvatar}
                  style={{
                    position: 'relative',
                    width: isCenter ? '90px' : '70px',
                    height: isCenter ? '90px' : '70px',
                    borderRadius: '12px', // Avatar quadrado
                    overflow: 'visible', // Changed from 'hidden' to allow emoji to show
                    flexShrink: 0,
                    border: isCenter
                      ? '3px solid rgba(59, 130, 246, 0.5)'
                      : '2px solid rgba(75, 85, 99, 0.3)',
                    boxShadow: isCenter
                      ? '0 8px 25px rgba(59, 130, 246, 0.3)'
                      : '0 4px 15px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px',
                      overflow: 'hidden', // Avatar content still clipped
                    }}
                  >
                    {getAvatarContent(entry, isCenter)}
                  </div>
                  {entry.emoji && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        bottom: '-8px',
                        right: '-8px',
                        width: isCenter ? '32px' : '24px',
                        height: isCenter ? '32px' : '24px',
                        borderRadius: '8px',
                        background: 'rgba(0, 0, 0, 0.8)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isCenter ? '16px' : '12px',
                        backdropFilter: 'blur(8px)',
                      }}
                      animate={{
                        scale: 1,
                        rotate: 0,
                      }}
                      whileHover={
                        isCenter
                          ? {
                              scale: 1.1,
                              rotate: [0, -5, 5, -5, 0],
                              transition: { duration: 0.5 },
                            }
                          : {}
                      }
                    >
                      {entry.emoji}
                    </motion.div>
                  )}
                </div>

                <div className={styles.testimonialTextArea}>
                  <div
                    className={`${styles.testimonialQuoteContainer} ${
                      isCenter ? styles.testimonialQuoteContainerCurrent : ''
                    }`}
                  >
                    {/* Aspas de abertura */}
                    <span
                      className={`${styles.testimonialQuoteMark} ${styles.testimonialQuoteMarkLeft} ${
                        isCenter
                          ? styles.testimonialQuoteMarkLeftCurrent
                          : isPrev
                            ? styles.testimonialQuoteMarkPrev
                            : styles.testimonialQuoteMarkNext
                      }`}
                    >
                      &ldquo;
                    </span>

                    <motion.p
                      className={`${styles.testimonialQuote} ${
                        isCenter
                          ? styles.testimonialQuoteCurrent
                          : isPrev
                            ? styles.testimonialQuotePrev
                            : styles.testimonialQuoteNext
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      {entry.message}
                    </motion.p>

                    {/* Aspas de fechamento */}
                    <span
                      className={`${styles.testimonialQuoteMark} ${styles.testimonialQuoteMarkRight} ${
                        isCenter
                          ? styles.testimonialQuoteMarkRightCurrent
                          : isPrev
                            ? styles.testimonialQuoteMarkPrev
                            : styles.testimonialQuoteMarkNext
                      }`}
                    >
                      &rdquo;
                    </span>
                  </div>

                  <motion.div
                    className={`${styles.testimonialAuthor} ${
                      isCenter
                        ? styles.testimonialAuthorCurrent
                        : isPrev
                          ? styles.testimonialAuthorPrev
                          : styles.testimonialAuthorNext
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <span>{entry.name}</span>

                    {isCenter && entry.username && (
                      <motion.a
                        href={
                          entry.is_developer
                            ? `https://github.com/${entry.username}`
                            : `https://instagram.com/${entry.username}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.testimonialHandle}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {entry.is_developer ? <Github size={16} /> : <User size={16} />}@
                        {entry.username}
                      </motion.a>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CarouselGuestbook;
