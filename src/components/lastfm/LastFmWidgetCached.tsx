'use client';

import Image from 'next/image';
import React from 'react';
import { useLastFmTracks } from '@/hooks/useLastFm';

interface LastFmWidgetProps {
  className?: string;
  limit?: number;
}

export function LastFmWidget({ className = '', limit = 5 }: LastFmWidgetProps) {
  const { tracks, isLoading, error } = useLastFmTracks();

  // Limitar número de tracks se necessário
  const limitedTracks = tracks ? tracks.slice(0, limit) : [];
  const isPlaying = limitedTracks[0]?.['@attr']?.nowplaying === 'true';

  if (isLoading) {
    return (
      <div className={`last-fm-widget ${className}`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-500"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            Loading Music...
          </h3>
        </div>
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`last-fm-widget ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          {isPlaying ? 'Now Playing' : 'Recently Played'}
        </h3>
      </div>

      {error ? (
        <div className="text-red-500 text-center py-4">
          <p>Failed to load music data</p>
          <p className="text-sm text-gray-500 mt-1">Data from cache may be displayed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {limitedTracks.map((track, index) => {
            const artistName = track.artist?.name || track.artist?.['#text'] || 'Unknown Artist';
            const imageUrl =
              track.image?.find(img => img.size === 'medium')?.['#text'] ||
              track.image?.[2]?.['#text'] ||
              '';

            return (
              <a
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                key={`${track.name}-${index}`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={`${track.name} album art`}
                      width={48}
                      height={48}
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                  )}

                  {index === 0 && isPlaying && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>

                <div className="overflow-hidden">
                  <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
                    {track.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{artistName}</p>
                </div>
              </a>
            );
          })}
        </div>
      )}

      <div className="mt-4 text-xs text-center">
        <a
          href={`https://www.last.fm/user/${process.env.NEXT_PUBLIC_LASTFM_USERNAME || 'lucasjs7'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          View on Last.fm
        </a>
      </div>

      {/* Cache indicator em development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          💾 Data cached intelligently
        </div>
      )}
    </div>
  );
}
