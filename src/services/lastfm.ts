// Last.fm API service
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY || process.env.LASTFM_API_KEY || null;

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
  country?: string;
  age?: string;
  gender?: string;
  subscriber?: string;
  playlists?: string;
  bootstrap?: string;
  type?: string;
  realname?: string;
  artist_count?: string;
  track_count?: string;
  album_count?: string;
}

export interface LastFmTrack {
  name: string;
  artist: {
    name: string;
    mbid: string;
    url: string;
    '#text'?: string;
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
  duration?: string;
  playcount?: string;
  listeners?: string;
  mbid?: string;
  streamable?: {
    fulltrack: string;
    '#text': string;
  };
  album?: {
    '#text': string;
    mbid: string;
  };
  '@attr'?: {
    rank: string;
    nowplaying?: string;
  };
}

export interface LastFmArtist {
  name: string;
  mbid: string;
  url: string;
  image: Array<{
    size: string;
    '#text': string;
  }>;
  streamable: string;
  listeners: string;
  playcount: string;
  tags?: {
    tag: Array<{
      name: string;
      url: string;
    }>;
  };
  bio?: {
    published: string;
    summary: string;
    content: string;
  };
  stats?: {
    listeners: string;
    playcount: string;
  };
  '@attr'?: {
    rank: string;
  };
}

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
  console.log('📦 Last.fm User Info Response:', JSON.stringify(data, null, 2));
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
  console.log('📦 Last.fm Recent Tracks Response:', JSON.stringify(data, null, 2));
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
  console.log('📦 Last.fm Top Tracks Response:', JSON.stringify(data, null, 2));
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
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
  console.log('📦 Last.fm Top Artists Response:', JSON.stringify(data, null, 2));
  console.log('WE NEED TO CREATE A INTERFACE FOR LASTFM ARTISTS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  return data.topartists.artist;
}
