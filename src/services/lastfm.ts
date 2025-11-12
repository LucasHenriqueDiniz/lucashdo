'use server';

import { logger } from '@/lib/logger';
import { LastFmUser, LastFmTrack, LastFmArtist } from '@/types/lastfm.types';

// Last.fm API service
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
const API_KEY = process.env.LASTFM_API_KEY || null;
const USER_AGENT =
  process.env.LASTFM_USER_AGENT || 'lucashdo-portfolio/1.0 (+https://www.lucashdo.com)';

interface LastFmRequestOptions<T> {
  params: Record<string, string>;
  cacheTag: string;
  errorContext: string;
  transform: (data: any) => T;
}

async function requestLastFm<T>({
  params,
  cacheTag,
  errorContext,
  transform,
}: LastFmRequestOptions<T>): Promise<T> {
  if (!API_KEY) {
    throw new Error('Last.fm API key is not set');
  }

  const url = new URL(BASE_URL);
  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    format: 'json',
    ...params,
  });
  url.search = searchParams.toString();

  logger.debug('Fetching Last.fm data', {
    method: params.method,
    username: params.user,
  });

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
    next: { revalidate: 86400, tags: ['lastfm', cacheTag] },
  });

  const textPayload = await response.text();
  let data: any;

  try {
    data = textPayload ? JSON.parse(textPayload) : {};
  } catch (error) {
    logger.error('Failed to parse Last.fm response as JSON', {
      error,
      textPayload,
    });
    throw new Error(`${errorContext}: Invalid response from Last.fm API`);
  }

  if (!response.ok || data?.error) {
    const message =
      data?.message ||
      data?.error ||
      `${response.status} ${response.statusText || 'Unknown error'}`;

    logger.error('Last.fm API responded with an error', {
      status: response.status,
      statusText: response.statusText,
      message,
      method: params.method,
      username: params.user,
    });

    throw new Error(`${errorContext}: ${message}`);
  }

  return transform(data);
}

/**
 * Fetch user information from Last.fm
 * @param username Last.fm username
 * @returns User information
 */
export async function getUserInfo(username: string): Promise<LastFmUser> {
  return requestLastFm<LastFmUser>({
    params: {
      method: 'user.getInfo',
      user: username,
    },
    cacheTag: 'lastfm-user',
    errorContext: 'Failed to fetch user info',
    transform: data => data.user,
  });
}

/**
 * Get recent tracks for a user
 * @param username Last.fm username
 * @param limit Number of tracks to fetch (default: 10)
 * @returns List of recently played tracks
 */
export async function getRecentTracks(
  username: string,
  limit: number = 10
): Promise<LastFmTrack[]> {
  return requestLastFm<LastFmTrack[]>({
    params: {
      method: 'user.getRecentTracks',
      user: username,
      limit: limit.toString(),
    },
    cacheTag: 'lastfm-recent-tracks',
    errorContext: 'Failed to fetch recent tracks',
    transform: data => data.recenttracks?.track ?? [],
  });
}

/**
 * Get top tracks for a user
 * @param username Last.fm username
 * @param period Time period (overall, 7day, 1month, 3month, 6month, 12month)
 * @param limit Number of tracks to fetch (default: 10)
 * @returns List of top tracks
 */
export async function getTopTracks(
  username: string,
  period: string = 'overall',
  limit: number = 10
): Promise<LastFmTrack[]> {
  return requestLastFm<LastFmTrack[]>({
    params: {
      method: 'user.getTopTracks',
      user: username,
      period,
      limit: limit.toString(),
    },
    cacheTag: 'lastfm-top-tracks',
    errorContext: 'Failed to fetch top tracks',
    transform: data => data.toptracks?.track ?? [],
  });
}

/**
 * Get top artists for a user
 * @param username Last.fm username
 * @param period Time period (overall, 7day, 1month, 3month, 6month, 12month)
 * @param limit Number of artists to fetch (default: 10)
 * @returns List of top artists
 */
export async function getTopArtists(
  username: string,
  period: string = 'overall',
  limit: number = 10
): Promise<LastFmArtist[]> {
  return requestLastFm<LastFmArtist[]>({
    params: {
      method: 'user.getTopArtists',
      user: username,
      period,
      limit: limit.toString(),
    },
    cacheTag: 'lastfm-top-artists',
    errorContext: 'Failed to fetch top artists',
    transform: data => data.topartists?.artist ?? [],
  });
}
