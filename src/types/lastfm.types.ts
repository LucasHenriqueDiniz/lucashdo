// Types para Last.fm API baseados na documentação oficial
export interface LastFmImage {
  size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega' | '';
  '#text': string;
}

export interface LastFmArtist {
  name: string;
  mbid: string;
  url: string;
  image: LastFmImage[];
  streamable: string;
  listeners?: string;
  playcount?: string;
  '@attr'?: {
    rank: string;
  };
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
  image: LastFmImage[];
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

export interface LastFmUser {
  name: string;
  playcount: string;
  registered: {
    unixtime: string;
    '#text': string;
  };
  url: string;
  image: LastFmImage[];
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

export interface LastFmRecentTracks {
  recenttracks: {
    track: LastFmTrack[];
    '@attr': {
      user: string;
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
  };
}

export interface LastFmTopArtists {
  topartists: {
    artist: LastFmArtist[];
    '@attr': {
      user: string;
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
  };
}

export interface LastFmTopTracks {
  toptracks: {
    track: LastFmTrack[];
    '@attr': {
      user: string;
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
  };
}
