// Last.fm API service
// API key: 6560f11e30bc8bc2e856926bde8e0cbe

const API_KEY = '6560f11e30bc8bc2e856926bde8e0cbe';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export interface LastFmUser {
  name: string;
  playcount: string;
  registered: {
    unixtime: string;
    '#text': string;
  };
  url: string;
  image: Array<{
    size: string;
    '#text': string;
  }>;
}

export interface LastFmTrack {
  name: string;
  artist: {
    name: string;
    mbid: string;
    url: string;
    '#text'?: string; // Para suportar a API que às vezes retorna artist como objeto e às vezes como texto
  };
  url: string;
  image: Array<{
    size: string;
    '#text': string;
  }>;
  date?: {
    uts: string;
    '#text': string;
  };
}

/**
 * Fetch user information from Last.fm
 * @param username Last.fm username
 * @returns User information
 */
export async function getUserInfo(username: string): Promise<LastFmUser> {
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
): Promise<any[]> {
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
