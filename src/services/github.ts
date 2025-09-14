'use server';

import { cache } from 'react';

/**
 * Fetch the number of stars for a GitHub repository.
 * Uses a 1 hour cache to avoid hitting the rate limit frequently.
 *
 * @param username - GitHub username or organization
 * @param repo - Repository name
 * @returns Number of stargazers
 */
export const getRepoStars = cache(async (username: string, repo: string): Promise<number> => {
  const response = await fetch(`https://api.github.com/repos/${username}/${repo}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch repository stars');
  }

  const data = await response.json();
  return data.stargazers_count ?? 0;
});
