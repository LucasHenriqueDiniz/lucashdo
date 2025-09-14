'use server';

import { LastFmUser, LastFmTrack, LastFmArtist } from '@/types/lastfm.types';

// Last.fm API service
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
const API_KEY = process.env.LASTFM_API_KEY || null;

/**
 * Fetch user information from Last.fm
 * @param username Last.fm username
 * @returns User information
 */
export async function getUserInfo(username: string): Promise<LastFmUser> {
  if (!API_KEY) {
    throw new Error('Last.fm API key is not set');
  }

  console.log('👤 Fetching Last.fm user info...');
  const params = new URLSearchParams({
    method: 'user.getInfo',
    user: username,
    api_key: API_KEY,
    format: 'json',
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.statusText}`);
  }

  const data = await response.json();
  return data.user;
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
  if (!API_KEY) {
    throw new Error('Last.fm API key is not set');
  }

  console.log('🎵 Fetching Last.fm recent tracks...');
  const params = new URLSearchParams({
    method: 'user.getRecentTracks',
    user: username,
    api_key: API_KEY,
    limit: limit.toString(),
    format: 'json',
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch recent tracks: ${response.statusText}`);
  }

  const data = await response.json();
  return data.recenttracks.track;
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
  if (!API_KEY) {
    throw new Error('Last.fm API key is not set');
  }

  console.log('🎵 Fetching Last.fm top tracks...');
  const params = new URLSearchParams({
    method: 'user.getTopTracks',
    user: username,
    api_key: API_KEY,
    period,
    limit: limit.toString(),
    format: 'json',
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch top tracks: ${response.statusText}`);
  }

  const data = await response.json();
  return data.toptracks.track;
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
  if (!API_KEY) {
    throw new Error('Last.fm API key is not set');
  }

  console.log('🎨 Fetching Last.fm top artists...');
  const params = new URLSearchParams({
    method: 'user.getTopArtists',
    user: username,
    api_key: API_KEY,
    period,
    limit: limit.toString(),
    format: 'json',
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch top artists: ${response.statusText}`);
  }

  const data = await response.json();
  return data.topartists.artist;
}
