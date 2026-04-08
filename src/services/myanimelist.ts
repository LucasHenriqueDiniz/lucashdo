// MyAnimeList API via Jikan (unofficial MAL API)
// Docs: https://docs.api.jikan.moe/

export type MALAnimeStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
export type MALMangaStatus = 'reading' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_read';

export interface MALUserStats {
  anime: {
    days_watched: number;
    mean_score: number;
    watching: number;
    completed: number;
    on_hold: number;
    dropped: number;
    plan_to_watch: number;
    total_entries: number;
    rewatched: number;
    episodes_watched: number;
  };
  manga: {
    days_read: number;
    mean_score: number;
    reading: number;
    completed: number;
    on_hold: number;
    dropped: number;
    plan_to_read: number;
    total_entries: number;
    reread: number;
    chapters_read: number;
    volumes_read: number;
  };
}

export interface MALFavorites {
  anime: Array<{
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
    title: string;
    type: string;
    start_year: number;
  }>;
  manga: Array<{
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
    title: string;
    type: string;
    start_year: number;
  }>;
  characters: Array<{
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
      };
    };
    name: string;
  }>;
  people: Array<{
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    name: string;
  }>;
}

export interface MALAnimeEntry {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  score: number;
  status: string;
  episodes_watched: number;
  episodes_total: number;
  anime?: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
  };
}

export interface MALMangaEntry {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  score: number;
  status: string;
  chapters_read: number;
  chapters_total: number;
  volumes_read: number;
  volumes_total: number;
}

export interface MALUserProfile {
  username: string;
  url: string;
  images: {
    jpg: {
      image_url: string;
    };
    webp: {
      image_url: string;
    };
  };
  last_online: string;
  gender: string;
  birthday: string;
  location: string;
  joined: string;
}

const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

export async function getUserStats(username: string): Promise<MALUserStats | null> {
  try {
    const url = `${JIKAN_API_BASE}/users/${username}/statistics`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('[MAL Service] Failed to fetch stats:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[MAL Service] Error fetching stats:', error);
    return null;
  }
}

export async function getUserProfile(username: string): Promise<MALUserProfile | null> {
  try {
    const response = await fetch(`${JIKAN_API_BASE}/users/${username}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Failed to fetch MAL user profile:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching MAL user profile:', error);
    return null;
  }
}

export async function getUserAnimeList(
  username: string,
  status?: MALAnimeStatus
): Promise<MALAnimeEntry[] | null> {
  try {
    // Jikan API v4 não suporta filtro de status na URL
    // Precisamos buscar tudo e filtrar no cliente
    const url = `${JIKAN_API_BASE}/users/${username}/animelist`;

    console.log('[MAL Service] Fetching anime list from:', url);
    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[MAL Service] Failed to fetch MAL anime list:', {
        status: response.status,
        statusText: response.statusText,
        url,
        error: errorText
      });
      return null;
    }

    const data = await response.json();
    console.log('[MAL Service] Raw anime list response:', {
      hasData: !!data.data,
      dataLength: data.data?.length || 0,
      firstEntry: data.data?.[0] ? JSON.stringify(data.data[0]).substring(0, 200) : 'none'
    });
    
    // Jikan API retorna os dados em data.data, e cada entrada tem um campo "anime"
    let entries = data.data || [];
    
    // Filtrar por status se fornecido
    if (status) {
      entries = entries.filter((entry: any) => entry.status === status);
      console.log('[MAL Service] Filtered by status:', status, 'count:', entries.length);
    }
    
    // Mapear os dados para o formato esperado
    const mapped = entries.map((entry: any) => ({
      mal_id: entry.anime?.mal_id || entry.mal_id,
      title: entry.anime?.title || entry.title,
      images: entry.anime?.images || entry.images,
      score: entry.score || 0,
      status: entry.status || '',
      episodes_watched: entry.episodes_watched || 0,
      episodes_total: entry.anime?.episodes || entry.episodes || 0,
    }));
    
    console.log('[MAL Service] Mapped anime entries:', mapped.length);
    return mapped;
  } catch (error) {
    console.error('[MAL Service] Error fetching MAL anime list:', error);
    return null;
  }
}

export async function getUserMangaList(
  username: string,
  status?: MALMangaStatus
): Promise<MALMangaEntry[] | null> {
  try {
    const url = status
      ? `${JIKAN_API_BASE}/users/${username}/mangalist?status=${status}`
      : `${JIKAN_API_BASE}/users/${username}/mangalist`;

    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      console.error('Failed to fetch MAL manga list:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching MAL manga list:', error);
    return null;
  }
}

export async function getUserFavorites(username: string): Promise<MALFavorites | null> {
  try {
    const url = `${JIKAN_API_BASE}/users/${username}/favorites`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('[MAL Service] Failed to fetch favorites:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[MAL Service] Error fetching favorites:', error);
    return null;
  }
}
