'use server';

export interface SteamGame {
  appid: string;
  name: string;
  playtime_forever: number; // in minutes
  img_icon_url: string;
  img_logo_url?: string;
  playtime_2weeks?: number;
  has_community_visible_stats?: boolean;
  playtime_windows_forever?: number;
  playtime_mac_forever?: number;
  playtime_linux_forever?: number;
  playtime_deck_forever?: number;
  rtime_last_played?: number;
  content_descriptorids?: number[];
  playtime_disconnected?: number;
  has_leaderboards?: boolean;
}

export interface SteamProfile {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: number; // 0: Offline, 1: Online, 2: Busy, 3: Away, 4: Snooze, 5: Looking to trade, 6: Looking to play
  lastlogoff?: number;
  loccountrycode?: string;
  communityvisibilitystate?: number;
  profilestate?: number;
  commentpermission?: number;
  avatarhash?: string;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  personastateflags?: number;
  gameextrainfo?: string;
  gameid?: string;
  gameserverip?: string;
  locstatecode?: string;
  loccityid?: number;
}

export interface SteamStats {
  profile: SteamProfile | null;
  recentGames: SteamGame[];
  totalGames: number;
  totalPlaytime: number; // in minutes
  mostPlayedGames: SteamGame[];
  totalPlaytimeWindows: number;
  totalPlaytimeMac: number;
  totalPlaytimeLinux: number;
  totalPlaytimeDeck: number;
  lastPlayed: number;
}

// Obtém as chaves de API do ambiente Next.js ou process.env
const API_KEY = process.env.NEXT_PUBLIC_STEAM_API_KEY || process.env.STEAM_API_KEY || '';
const STEAM_ID = process.env.NEXT_PUBLIC_STEAM_ID || process.env.STEAM_ID || '';
const BASE_URL = 'https://api.steampowered.com';

/**
 * Get Steam profile information
 */
export async function getSteamProfile(): Promise<SteamProfile | null> {
  try {
    if (!API_KEY || !STEAM_ID) {
      console.error('Steam API key or Steam ID not found');
      return null;
    }

    console.log('🔍 Fetching Steam profile...');
    const response = await fetch(
      `${BASE_URL}/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${STEAM_ID}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response?.players?.[0] || null;
  } catch (error) {
    console.error('❌ Error fetching Steam profile:', error);
    return null;
  }
}

/**
 * Get recently played games
 */
export async function getRecentGames(count = 5): Promise<SteamGame[]> {
  try {
    if (!API_KEY || !STEAM_ID) {
      console.error('Steam API key or Steam ID not found');
      return [];
    }

    console.log('🎮 Fetching recent games...');
    const response = await fetch(
      `${BASE_URL}/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&count=${count}&format=json`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response?.games || [];
  } catch (error) {
    console.error('❌ Error fetching recent games:', error);
    return [];
  }
}

/**
 * Get owned games
 */
export async function getOwnedGames(): Promise<{ games: SteamGame[]; total: number }> {
  try {
    if (!API_KEY || !STEAM_ID) {
      console.error('Steam API key or Steam ID not found');
      return { games: [], total: 0 };
    }

    console.log('🎲 Fetching owned games...');
    const response = await fetch(
      `${BASE_URL}/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&include_appinfo=true&include_played_free_games=true&format=json`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`);
    }

    const data = await response.json();
    const games = data.response?.games || [];

    // Sort by playtime
    games.sort((a: SteamGame, b: SteamGame) => b.playtime_forever - a.playtime_forever);

    return {
      games: games,
      total: data.response?.game_count || 0,
    };
  } catch (error) {
    console.error('❌ Error fetching owned games:', error);
    return { games: [], total: 0 };
  }
}

/**
 * Get aggregated Steam statistics
 */
export async function getSteamStats(): Promise<SteamStats> {
  console.log('📊 Getting Steam stats...');

  const [profile, recentGames, ownedGamesData] = await Promise.all([
    getSteamProfile(),
    getRecentGames(5),
    getOwnedGames(),
  ]);

  const { games, total } = ownedGamesData;

  // Calculate total playtime across all games (in minutes)
  const totalPlaytime = games.reduce((acc, game) => acc + (game.playtime_forever || 0), 0);

  // Calculate platform-specific playtime
  const totalPlaytimeWindows = games.reduce(
    (acc, game) => acc + (game.playtime_windows_forever || 0),
    0
  );
  const totalPlaytimeMac = games.reduce((acc, game) => acc + (game.playtime_mac_forever || 0), 0);
  const totalPlaytimeLinux = games.reduce(
    (acc, game) => acc + (game.playtime_linux_forever || 0),
    0
  );
  const totalPlaytimeDeck = games.reduce((acc, game) => acc + (game.playtime_deck_forever || 0), 0);

  // Get most played games (top 5)
  const mostPlayedGames = games.slice(0, 5);

  // Get last played game
  const lastPlayed = games.reduce((latest, game) => {
    if (game.rtime_last_played && (!latest || game.rtime_last_played > latest)) {
      return game.rtime_last_played;
    }
    return latest;
  }, 0);

  const stats = {
    profile,
    recentGames,
    totalGames: total,
    totalPlaytime,
    mostPlayedGames,
    totalPlaytimeWindows,
    totalPlaytimeMac,
    totalPlaytimeLinux,
    totalPlaytimeDeck,
    lastPlayed,
  };

  return stats;
}
