import { Article, mockArticles } from '@/data/mockArticles';

/**
 * Reading Service
 *
 * Manages daily collection and RSS syncing of articles from IEEE Spectrum, Aeon, Psyche, and TechCrunch AI.
 */

const SYNC_KEY = 'class8th_articles_last_sync';
const STORAGE_ARTICLES_KEY = 'class8th_articles_data';

export async function getDailyArticles(): Promise<{ articles: Article[]; lastSynced: string }> {
  // Check localStorage for persisted articles first
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_ARTICLES_KEY);
    const lastSync = localStorage.getItem(SYNC_KEY) || new Date().toISOString();

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { articles: parsed, lastSynced: lastSync };
        }
      } catch (e) {
        console.error('Failed to parse saved articles:', e);
      }
    }
  }

  // Attempt live RSS sync on initial load
  try {
    return await syncTodayArticles();
  } catch (e) {
    return { articles: mockArticles, lastSynced: new Date().toISOString() };
  }
}

export async function syncTodayArticles(): Promise<{ articles: Article[]; lastSynced: string }> {
  const todayStr = new Date().toISOString();

  try {
    const res = await fetch('/api/rss');
    if (res.ok) {
      const data = await res.json();
      if (data.articles && data.articles.length > 0) {
        // Merge fresh RSS articles with base articles
        const rssArticles: Article[] = data.articles;
        const existingUrls = new Set(rssArticles.map((a) => a.articleUrl));
        const customMocks = mockArticles.filter((a) => !existingUrls.has(a.articleUrl));
        const combined = [...rssArticles, ...customMocks];

        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(combined));
          localStorage.setItem(SYNC_KEY, todayStr);
        }

        return { articles: combined, lastSynced: todayStr };
      }
    }
  } catch (err) {
    console.warn('RSS API sync notice:', err);
  }

  // Fallback if offline
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(mockArticles));
    localStorage.setItem(SYNC_KEY, todayStr);
  }

  return { articles: mockArticles, lastSynced: todayStr };
}
