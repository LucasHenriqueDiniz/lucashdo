import { LastFmWidget, LastFmTopArtists } from '@/components/lastfm';

export default function MusicPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Music Taste</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <LastFmWidget limit={10} />
          </div>
        </div>
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <LastFmTopArtists
              username={process.env.NEXT_PUBLIC_LASTFM_USERNAME || 'lucasjs7'}
              limit={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
