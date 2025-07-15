import * as React from 'react';
import { Github, User } from 'lucide-react';
import Image from 'next/image';
import Avatar from 'boring-avatars';
import Autoplay from 'embla-carousel-autoplay';
import { GuestbookEntry } from '@/types/guestbook.types';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import styles from './GuestBook.module.css';

interface CarouselGuestbookProps {
  entries: GuestbookEntry[];
}

const AUTOPLAY_DELAY = 4000;

const CarouselGuestbook: React.FC<CarouselGuestbookProps> = ({ entries }) => {
  // O carousel do shadcn/embla controla o index internamente
  const plugins = React.useMemo(
    () => [Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })],
    []
  );

  const getAvatarContent = (entry: GuestbookEntry) => {
    if (entry.avatar_url) {
      return (
        <Image
          src={entry.avatar_url}
          alt={entry.name}
          fill
          className={styles.testimonialAvatarImage}
          style={{ objectFit: 'cover' }}
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
        <Avatar size={90} name={entry.name} variant={'beam'} square={true} />
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
      <Carousel
        orientation="vertical"
        opts={{ align: 'start', loop: true }}
        plugins={plugins}
        className="w-full h-[420px]"
      >
        <CarouselContent className="-mt-1 h-[420px]">
          {entries.map(entry => (
            <CarouselItem
              key={entry.id}
              className="pt-1 h-[420px] flex flex-col items-center justify-center"
            >
              <div className={styles.testimonialContent}>
                <div
                  className={styles.testimonialAvatar}
                  style={{
                    position: 'relative',
                    width: '90px',
                    height: '90px',
                    borderRadius: '12px',
                    overflow: 'visible',
                    flexShrink: 0,
                    border: '3px solid rgba(59, 130, 246, 0.5)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    {getAvatarContent(entry)}
                  </div>
                  {entry.emoji && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-8px',
                        right: '-8px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(0, 0, 0, 0.8)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {entry.emoji}
                    </div>
                  )}
                </div>
                <div className={styles.testimonialTextArea}>
                  <div className={styles.testimonialQuoteContainer}>
                    <span
                      className={`${styles.testimonialQuoteMark} ${styles.testimonialQuoteMarkLeft} ${styles.testimonialQuoteMarkLeftCurrent}`}
                    >
                      &ldquo;
                    </span>
                    <p className={`${styles.testimonialQuote} ${styles.testimonialQuoteCurrent}`}>
                      {entry.message}
                    </p>
                    <span
                      className={`${styles.testimonialQuoteMark} ${styles.testimonialQuoteMarkRight} ${styles.testimonialQuoteMarkRightCurrent}`}
                    >
                      &rdquo;
                    </span>
                  </div>
                  <div className={`${styles.testimonialAuthor} ${styles.testimonialAuthorCurrent}`}>
                    <span>{entry.name}</span>
                    {entry.username && (
                      <a
                        href={
                          entry.is_developer
                            ? `https://github.com/${entry.username}`
                            : `https://instagram.com/${entry.username}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.testimonialHandle}
                      >
                        {entry.is_developer ? <Github size={16} /> : <User size={16} />}@
                        {entry.username}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Sem CarouselPrevious/CarouselNext */}
      </Carousel>
    </div>
  );
};

export default CarouselGuestbook;
