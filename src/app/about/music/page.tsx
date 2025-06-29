import Image from 'next/image';
import { LastFmWidget } from '@/components/lastfm';
import { getTopArtists, getTopTracks, getUserInfo } from '@/services/lastfm';

export default async function MusicPage() {
  const username = 'Amayacrab';

  // Fetch Last.fm data
  const [userInfo, topTracks, topArtists] = await Promise.all([
    getUserInfo(username).catch(err => {
      console.error('Error fetching user info:', err);
      return null;
    }),
    getTopTracks(username, 'overall', 10).catch(err => {
      console.error('Error fetching top tracks:', err);
      return [];
    }),
    getTopArtists(username, 'overall', 10).catch(err => {
      console.error('Error fetching top artists:', err);
      return [];
    }),
  ]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Music Taste</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Recent Tracks / Now Playing */}
        <div className="col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <LastFmWidget username={username} limit={10} />
          </div>
        </div>

        {/* User Profile */}
        <div className="col-span-1 md:col-span-2">
          {userInfo ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-6">
                {userInfo.image && userInfo.image[3]['#text'] && (
                  <Image
                    src={userInfo.image[3]['#text']}
                    alt={`${userInfo.name}'s profile picture`}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                )}

                <div>
                  <h2 className="text-xl font-bold">{userInfo.name}</h2>
                  <p className="text-sm text-gray-500">
                    Scrobbling since{' '}
                    {new Date(parseInt(userInfo.registered.unixtime) * 1000).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">
                      {parseInt(userInfo.playcount).toLocaleString()}
                    </span>{' '}
                    scrobbles
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Tracks */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Top Tracks</h3>
                  <ol className="space-y-2 list-decimal ml-5">
                    {topTracks.slice(0, 5).map((track, index) => (
                      <li key={`track-${index}`}>
                        <a
                          href={track.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-red-500 transition-colors"
                        >
                          <span className="font-medium">{track.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {' '}
                            by {track.artist.name}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Top Artists */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Top Artists</h3>
                  <ol className="space-y-2 list-decimal ml-5">
                    {topArtists.slice(0, 5).map((artist, index) => (
                      <li key={`artist-${index}`}>
                        <a
                          href={artist.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-red-500 transition-colors font-medium"
                        >
                          {artist.name}
                        </a>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {' '}
                          ({artist.playcount} plays)
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p>Failed to load user profile</p>
            </div>
          )}
        </div>
      </div>

      {/* All Top Tracks */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">My Top 10 Tracks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {topTracks.map((track, index) => (
            <a
              key={`track-card-${index}`}
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square">
                {track.image && track.image[3]['#text'] ? (
                  <Image
                    src={track.image[3]['#text']}
                    alt={`${track.name} album art`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm truncate">{track.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {track.artist.name}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Last.fm Link */}
      <div className="mt-12 text-center">
        <a
          href={`https://www.last.fm/user/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
        >
          <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10.584 3.657c-1.974 0-3.166 1.1-3.96 2.62V3.73H3.5v9.567h3.124V8.48c0-.206.019-.412.073-.56.177-.496.577-1.01 1.25-1.01.883 0 1.235.67 1.235 1.653v4.735h3.124V8.14c0-2.873-1.534-4.483-3.723-4.483zM.414 3.73v9.567H3.54V3.73H.414z" />
          </svg>
          View my full profile on Last.fm
        </a>
      </div>
    </div>
  );
}
