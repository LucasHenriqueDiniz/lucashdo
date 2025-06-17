// Test script for Last.fm API
import { getUserInfo, getRecentTracks, getTopTracks, getTopArtists } from '../services/lastfm';

// Replace with your Last.fm username
const username = 'Amayacrab';

async function testLastFmAPI() {
  try {
    // Test user info
    console.log('Fetching user info...');
    const userInfo = await getUserInfo(username);
    console.log('User Info:', JSON.stringify(userInfo, null, 2));

    // Test recent tracks
    console.log('\nFetching recent tracks...');
    const recentTracks = await getRecentTracks(username, 5);
    console.log('Recent Tracks:', JSON.stringify(recentTracks, null, 2));

    // Test top tracks
    console.log('\nFetching top tracks...');
    const topTracks = await getTopTracks(username, 'overall', 5);
    console.log('Top Tracks:', JSON.stringify(topTracks, null, 2));

    // Test top artists
    console.log('\nFetching top artists...');
    const topArtists = await getTopArtists(username, 'overall', 5);
    console.log('Top Artists:', JSON.stringify(topArtists, null, 2));
  } catch (error) {
    console.error('Error testing Last.fm API:', error);
  }
}

// Run the test
testLastFmAPI();
