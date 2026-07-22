import { NextResponse } from 'next/server';

export interface RSSArticle {
  id: string;
  sourceId: string;
  title: string;
  author: string;
  articleUrl: string;
  imageUrl: string;
  summary: string;
  publishedAt: string;
  sourceName: 'IEEE Spectrum' | 'Aeon' | 'Psyche' | 'TechCrunch AI';
  category: string;
  readTime: string;
  content: string;
}

const FEEDS = [
  {
    name: 'IEEE Spectrum' as const,
    sourceId: 'ieee-spectrum',
    url: 'https://spectrum.ieee.org/feeds/feed.rss',
    category: 'Robotics & Physics',
    defaultImg: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Aeon' as const,
    sourceId: 'aeon',
    url: 'https://aeon.co/feed.rss',
    category: 'Cosmology & Philosophy',
    defaultImg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Psyche' as const,
    sourceId: 'psyche',
    url: 'https://psyche.co/feed.rss',
    category: 'Cognitive Psychology',
    defaultImg: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'TechCrunch AI' as const,
    sourceId: 'techcrunch-ai',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'Artificial Intelligence',
    defaultImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
  }
];

function cleanText(htmlStr: string): string {
  return htmlStr
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseFeedItems(xmlText: string, feed: typeof FEEDS[number]): RSSArticle[] {
  const articles: RSSArticle[] = [];
  const itemMatches = xmlText.match(/<item[\s\S]*?<\/item>/gi) || xmlText.match(/<entry[\s\S]*?<\/entry>/gi) || [];

  for (let i = 0; i < Math.min(8, itemMatches.length); i++) {
    const raw = itemMatches[i];

    const titleMatch = raw.match(/<title>([\s\S]*?)<\/title>/i);
    const linkMatch = raw.match(/<link>([\s\S]*?)<\/link>/i) || raw.match(/href=["']([^"']+)["']/i);
    const descMatch =
      raw.match(/<description>([\s\S]*?)<\/description>/i) ||
      raw.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i) ||
      raw.match(/<summary>([\s\S]*?)<\/summary>/i);
    const authorMatch =
      raw.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/i) ||
      raw.match(/<author>([\s\S]*?)<\/author>/i);
    const pubDateMatch =
      raw.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) ||
      raw.match(/<published>([\s\S]*?)<\/published>/i);

    const imgMatch =
      raw.match(/<media:content[^>]+url=["']([^"']+)["']/i) ||
      raw.match(/<enclosure[^>]+url=["']([^"']+)["']/i) ||
      raw.match(/src=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["']/i);

    const title = titleMatch ? cleanText(titleMatch[1]) : '';
    const link = linkMatch ? cleanText(linkMatch[1]) : '';
    const description = descMatch ? cleanText(descMatch[1]) : '';
    const author = authorMatch ? cleanText(authorMatch[1]) : `${feed.name} Editors`;
    const pubDate = pubDateMatch ? cleanText(pubDateMatch[1]) : new Date().toISOString();
    const imageUrl = imgMatch ? imgMatch[1] : feed.defaultImg;

    if (title && link) {
      const summaryText = description.slice(0, 240) + (description.length > 240 ? '...' : '');
      articles.push({
        id: `${feed.sourceId}-${i}-${Date.now()}`,
        sourceId: feed.sourceId,
        title,
        author: author || `${feed.name} Writers`,
        articleUrl: link,
        imageUrl,
        summary: summaryText || title,
        publishedAt: pubDate,
        sourceName: feed.name,
        category: feed.category,
        readTime: `${Math.max(3, Math.ceil(description.split(' ').length / 50))} min read`,
        content: description || title
      });
    }
  }

  return articles;
}

export async function GET() {
  const allArticles: RSSArticle[] = [];

  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Class8thHub/1.0'
        },
        next: { revalidate: 1800 } // Cache for 30 minutes
      });

      if (res.ok) {
        const xmlText = await res.text();
        const parsed = parseFeedItems(xmlText, feed);
        allArticles.push(...parsed);
      }
    } catch (e) {
      console.warn(`RSS fetch notice for ${feed.name}:`, e);
    }
  }

  return NextResponse.json({
    articles: allArticles,
    lastSynced: new Date().toISOString()
  });
}
