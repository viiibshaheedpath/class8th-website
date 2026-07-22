'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Article } from '@/data/mockArticles';
import { getDailyArticles, syncTodayArticles } from '@/services/readingService';

const SOURCES = ['All', 'IEEE Spectrum', 'Aeon', 'Psyche', 'TechCrunch AI'];
const CATEGORIES = [
  'All',
  'Artificial Intelligence',
  'Robotics & Physics',
  'Cosmology & Philosophy',
  'Cognitive Psychology',
  'Learning & Memory',
  'Quantum Tech'
];

export default function ReadingPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeSource, setActiveSource] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getDailyArticles().then(({ articles, lastSynced }) => {
      setArticles(articles);
      setLastSyncedTime(new Date(lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setLoading(false);
    });
  }, []);

  const handleSyncDaily = async () => {
    setSyncing(true);
    const { articles, lastSynced } = await syncTodayArticles();
    setArticles(articles);
    setLastSyncedTime(new Date(lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setSyncing(false);
  };

  const filteredArticles = articles.filter((art) => {
    const matchesSource = activeSource === 'All' || art.sourceName === activeSource;
    const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.author.toLowerCase().includes(q);

    return matchesSource && matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout title="Curated Reading & Essays">
      {/* Container with Darkened Uploaded AI Background + Glassmorphic Article Cards */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          padding: '28px 24px',
          minHeight: '85vh',
          background: '#060814'
        }}
      >
        {/* Uploaded AI Illustration Background (/images/reading-bg.png) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("/images/reading-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.32) contrast(1.15) saturate(0.9)',
            zIndex: 0
          }}
        />

        {/* Dark Vignette Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(120% 100% at 50% 50%, rgba(6, 8, 20, 0.45), rgba(4, 5, 14, 0.88)), linear-gradient(180deg, rgba(6,8,20,0.65) 0%, transparent 40%, rgba(6,8,20,0.85) 100%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Reading Section Content Above Background */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Daily Auto-Collector Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(16px)',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="live" style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>
                Daily Article Collector Active
              </span>
              {lastSyncedTime && (
                <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  (Last synced today at {lastSyncedTime})
                </span>
              )}
            </div>

            <Button
              variant="secondary"
              onClick={handleSyncDaily}
              disabled={syncing}
              style={{ fontSize: '0.8rem', padding: '5px 14px', background: 'rgba(99, 102, 241, 0.25)', borderColor: 'rgba(129, 140, 248, 0.4)' }}
            >
              {syncing ? '🔄 Syncing Fresh Articles…' : '🔄 Sync Today\'s Articles'}
            </Button>
          </div>

          {/* Header Banner & Filters Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '220px' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    pointerEvents: 'none'
                  }}
                >
                  🔍
                </span>
                <input
                  id="reading-search"
                  type="search"
                  placeholder="Search articles from IEEE Spectrum, Aeon, Psyche…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    background: 'rgba(15, 23, 42, 0.78)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: 'var(--radius-md)',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    backdropFilter: 'blur(16px)',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Source Tabs */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600, marginRight: '4px' }}>
                  Source:
                </span>
                {SOURCES.map((src) => (
                  <button
                    key={src}
                    onClick={() => setActiveSource(src)}
                    className={`btn ${activeSource === src ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '6px 14px', fontSize: '0.82rem', backdropFilter: 'blur(10px)' }}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600, marginRight: '4px' }}>
                Topic:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '4px 12px', fontSize: '0.8rem', backdropFilter: 'blur(10px)' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Article Cards */}
          {loading ? (
            <div className="loader-container">
              <div className="spinner" style={{ width: '32px', height: '32px' }} />
            </div>
          ) : filteredArticles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredArticles.map((art) => (
                <ArticleCard key={art.id} article={art} onRead={(a) => setSelectedArticle(a)} />
              ))}
            </div>
          ) : (
            <div
              className="empty-state"
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                borderColor: 'rgba(255, 255, 255, 0.15)'
              }}
            >
              <div className="empty-state-icon">📰</div>
              <h3 className="empty-state-title" style={{ color: '#fff' }}>
                No Articles Found
              </h3>
              <p className="empty-state-description" style={{ color: 'rgba(255,255,255,0.7)' }}>
                No articles found matching the current search filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fully Scrollable Article Reader Modal */}
      {selectedArticle && (
        <Modal
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle.title}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              maxHeight: '75vh',
              overflowY: 'auto',
              paddingRight: '6px'
            }}
          >
            {/* Modal Image Banner */}
            <div
              style={{
                width: '100%',
                height: '240px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0
              }}
            >
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(10,12,22,0.92) 100%)' }} />
              <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: '#60a5fa', fontWeight: 700 }}>
                  {selectedArticle.sourceName} • {selectedArticle.category}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)' }}>
                  ⏱ {selectedArticle.readTime}
                </span>
              </div>
            </div>

            {/* Author & Published Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>By <strong>{selectedArticle.author}</strong></span>
              <span>Published: {new Date(selectedArticle.publishedAt).toLocaleDateString()}</span>
            </div>

            {/* Summary */}
            <div style={{ padding: '14px 16px', background: 'rgba(99, 102, 241, 0.1)', borderLeft: '3px solid var(--primary-start)', borderRadius: 'var(--radius-sm)' }}>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#e2e8f0', fontStyle: 'italic', lineHeight: 1.5 }}>
                "{selectedArticle.summary}"
              </p>
            </div>

            {/* Full Formatted Article Content */}
            <div
              style={{
                fontSize: '0.96rem',
                lineHeight: 1.8,
                color: 'var(--text-main)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                whiteSpace: 'pre-line'
              }}
            >
              {selectedArticle.content}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
              <a
                href={selectedArticle.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                Read Full Essay on {selectedArticle.sourceName} ↗
              </a>
              <Button variant="primary" onClick={() => setSelectedArticle(null)}>
                Done Reading
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
