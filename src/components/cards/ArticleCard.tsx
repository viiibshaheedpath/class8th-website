import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Article } from '@/data/mockArticles';

interface ArticleCardProps {
  article: Article;
  onRead?: (article: Article) => void;
}

const SOURCE_COLORS: { [key: string]: { bg: string; border: string; text: string } } = {
  'IEEE Spectrum': { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.35)', text: '#60a5fa' },
  'Aeon': { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.35)', text: '#f472b6' },
  'Psyche': { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.35)', text: '#c084fc' }
};

export function ArticleCard({ article, onRead }: ArticleCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const badgeStyle = SOURCE_COLORS[article.sourceName] || SOURCE_COLORS['IEEE Spectrum'];

  return (
    <Card className="article-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, height: '100%' }}>
      {/* Cover Image Header */}
      <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', background: '#0a0c16' }}>
        <img
          src={article.imageUrl}
          alt={article.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          className="article-card-img"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(10,12,22,0.85) 100%)' }} />

        {/* Source Badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: badgeStyle.bg,
              border: `1px solid ${badgeStyle.border}`,
              color: badgeStyle.text,
              backdropFilter: 'blur(8px)',
              letterSpacing: '0.5px'
            }}
          >
            {article.sourceName}
          </span>
        </div>

        {/* Read time badge */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: 'rgba(0,0,0,0.65)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              backdropFilter: 'blur(8px)'
            }}
          >
            ⏱ {article.readTime}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant="secondary" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
            {article.category}
          </Badge>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formattedDate}</span>
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: '1.08rem',
            fontWeight: 700,
            lineHeight: 1.35,
            color: '#ffffff',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {article.title}
        </h3>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>By {article.author}</p>

        <p
          style={{
            fontSize: '0.86rem',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: 1.5,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {article.summary}
        </p>

        <Button
          variant="secondary"
          style={{ width: '100%', marginTop: 'auto', paddingTop: '8px', paddingBottom: '8px', fontSize: '0.85rem' }}
          onClick={() => onRead && onRead(article)}
        >
          Read Article →
        </Button>
      </div>
    </Card>
  );
}
