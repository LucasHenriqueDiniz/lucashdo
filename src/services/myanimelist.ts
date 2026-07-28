// MyAnimeList data via jikan-edge (edge-cached Jikan mirror)
// Docs: https://jikan-edge.lucas-hdo.workers.dev/docs

export type MALAnimeStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
export type MALMangaStatus = 'reading' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_read';

export interface MALUserStats {
  anime: {
    watching: number;
    completed: number;
    onHold: number;
    dropped: number;
    planToWatch: number;
    totalEntries: number;
    episodesWatched: number | null;
    meanScore: number;
  };
  manga: {
    reading: number;
    completed: number;
    onHold: number;
    dropped: number;
    planToRead: number;
    totalEntries: number;
    chaptersRead: number | null;
    volumesRead: number | null;
    meanScore: number;
  };
}

export interface MALFavoriteMedia {
  malId: number;
  title: string;
  url: string;
  type: string;
  imageUrl: string | null;
}

export interface MALFavoritePerson {
  malId: number;
  name: string;
  url: string;
  imageUrl: string | null;
}

export interface MALFavorites {
  anime: MALFavoriteMedia[];
  manga: MALFavoriteMedia[];
  characters: MALFavoritePerson[];
  people: MALFavoritePerson[];
}

export interface MALListEntry {
  malId: number;
  title: string;
  imageUrl: string | null;
  status: string | null;
  score: number | null;
  progress: number;
  total: number | null;
  mediaType: 'anime' | 'manga';
}

export type MALAnimeEntry = MALListEntry;
export type MALMangaEntry = MALListEntry;

export interface MALUserProfile {
  username: string;
  canonicalUsername: string;
  profileUrl: string;
  avatarUrl: string | null;
  about: string | null;
  gender: string | null;
  location: string | null;
  birthday: string | null;
  joinedAt: string | null;
  lastOnlineAt: string | null;
}

const JIKAN_EDGE_API_BASE = 'https://jikan-edge.lucas-hdo.workers.dev/v1';

interface JikanEdgeMeta {
  cached: boolean;
  stale: boolean;
  refreshFailed: boolean;
  fetchedAt: string;
}

interface JikanEdgeEnvelope<T> {
  data: T;
  meta: JikanEdgeMeta;
}

// Fetches a jikan-edge endpoint, unwraps the { data, meta } envelope and
// retries once on 429 honoring Retry-After (limits: 30 req/10s, 60 req/min).
// meta.stale === true is a cache fallback after a failed refresh — still valid data.
async function jikanEdgeFetch<T>(path: string, revalidate: number, retried = false): Promise<T | null> {
  const url = `${JIKAN_EDGE_API_BASE}${path}`;
  try {
    const response = await fetch(url, { next: { revalidate } });

    if (response.status === 429 && !retried) {
      const retryAfter = Number(response.headers.get('Retry-After')) || 2;
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return jikanEdgeFetch<T>(path, revalidate, true);
    }

    if (!response.ok) {
      let message = response.statusText;
      try {
        const body = await response.json();
        message = body?.error?.message || message;
      } catch {
        // non-JSON error body
      }
      console.error('[MAL Service] Request failed:', response.status, message, url);
      return null;
    }

    const envelope: JikanEdgeEnvelope<T> = await response.json();
    return envelope.data;
  } catch (error) {
    console.error('[MAL Service] Error fetching:', url, error);
    return null;
  }
}

export async function getUserStats(username: string): Promise<MALUserStats | null> {
  return jikanEdgeFetch<MALUserStats>(`/users/${username}/statistics`, 3600);
}

export async function getUserProfile(username: string): Promise<MALUserProfile | null> {
  return jikanEdgeFetch<MALUserProfile>(`/users/${username}`, 3600);
}

export async function getUserAnimeList(
  username: string,
  status?: MALAnimeStatus
): Promise<MALAnimeEntry[] | null> {
  const entries = await jikanEdgeFetch<MALListEntry[]>(`/users/${username}/animelist?limit=300`, 1800);
  if (!entries) return null;
  // status pode vir null da fonte; só filtra quando a entrada tem status
  return status ? entries.filter(entry => entry.status === status) : entries;
}

export async function getUserMangaList(
  username: string,
  status?: MALMangaStatus
): Promise<MALMangaEntry[] | null> {
  const entries = await jikanEdgeFetch<MALListEntry[]>(`/users/${username}/mangalist?limit=300`, 1800);
  if (!entries) return null;
  return status ? entries.filter(entry => entry.status === status) : entries;
}

export async function getUserFavorites(username: string): Promise<MALFavorites | null> {
  interface RawFavorite {
    malId?: number;
    mal_id?: number;
    title?: string;
    name?: string;
    url: string;
    type?: string;
    imageUrl: string | null;
  }

  const data = await jikanEdgeFetch<Record<keyof MALFavorites, RawFavorite[]>>(
    `/users/${username}/favorites`,
    3600
  );
  if (!data) return null;

  const mapMedia = (items: RawFavorite[] = []): MALFavoriteMedia[] =>
    items.map(item => ({
      malId: item.malId ?? item.mal_id ?? 0,
      title: item.title ?? item.name ?? '',
      url: item.url,
      type: item.type ?? '',
      imageUrl: item.imageUrl ?? null,
    }));

  const mapPerson = (items: RawFavorite[] = []): MALFavoritePerson[] =>
    items.map(item => ({
      malId: item.malId ?? item.mal_id ?? 0,
      name: item.name ?? item.title ?? '',
      url: item.url,
      imageUrl: item.imageUrl ?? null,
    }));

  return {
    anime: mapMedia(data.anime),
    manga: mapMedia(data.manga),
    characters: mapPerson(data.characters),
    people: mapPerson(data.people),
  };
}
