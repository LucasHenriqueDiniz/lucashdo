import Image from 'next/image';
import React from 'react';
import { getRecentTracks, LastFmTrack } from '@/services/lastfm';

interface LastFmWidgetProps {
  username: string;
  limit?: number;
  className?: string;
}

export async function LastFmWidget({ username, limit = 5, className = '' }: LastFmWidgetProps) {
  let recentTracks: LastFmTrack[] = [];
  let error = null;

  try {
    recentTracks = await getRecentTracks(username, limit);
  } catch (err) {
    error = 'Failed to load music data';
    console.error(err);
  }

  const isPlaying = recentTracks[0]?.date?.uts === undefined;

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
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-3">
          {recentTracks.map((track, index) => (
            <a
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              key={`${track.name}-${index}`}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                {track.image && track.image[2]['#text'] ? (
                  <Image
                    src={track.image[2]['#text']}
                    alt={`${track.name} album art`}
                    width={48}
                    height={48}
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center">
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
                <p className="font-medium text-sm truncate">{track.name}</p>
                <p className="text-xs text-gray-400 truncate">{track.artist['#text']}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="mt-4 text-xs text-center">
        <a
          href={`https://www.last.fm/user/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          View on Last.fm
        </a>
      </div>
    </div>
  );
}
