'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DocumentCard } from '@/components/cards/DocumentCard';
import { DocumentReaderModal } from '@/components/ui/DocumentReaderModal';
import { Toast, ToastItem } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { VectorField } from '@/components/ui/vector-field';
import { getDocuments, getViewUrl, getDownloadUrl } from '@/services/libraryService';
import { Document } from '@/data/mockDocuments';

const CATEGORIES = ['All', 'Syllabus', 'Notes', 'Textbooks'];
const SUBJECTS = ['All', 'Science', 'Mathematics', 'English'];

export default function LibraryPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    getDocuments().then((data) => {
      setDocuments(data);
      setLoading(false);
    });
  }, []);

  const handleOpenViewer = async (doc: Document) => {
    setSelectedDoc(doc);
    if (doc.allowView) {
      const url = await getViewUrl(doc.filePath);
      setViewUrl(url);
    } else {
      setViewUrl(null);
    }
  };

  const handleDownload = async (doc: Document) => {
    if (!doc.allowDownload) return;
    try {
      const url = await getDownloadUrl(doc.filePath);
      const newToast: ToastItem = {
        id: Math.random().toString(),
        message: `Preparing download for ${doc.title}…`,
        type: 'success'
      };
      setToasts((prev) => [...prev, newToast]);

      if (url) {
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = `${doc.title}.${doc.fileType || 'pdf'}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        } catch {
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.download = `${doc.title}.${doc.fileType || 'pdf'}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }
    } catch {
      const errorToast: ToastItem = {
        id: Math.random().toString(),
        message: `Failed to download ${doc.title}`,
        type: 'error'
      };
      setToasts((prev) => [...prev, errorToast]);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSubject = activeSubject === 'All' || doc.subject === activeSubject;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q || doc.title.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q);
    return matchesCategory && matchesSubject && matchesSearch;
  });

  return (
    <DashboardLayout title="Digital Library & Books">
      {/* Container with Darkened Study Image + Hovering Bright VectorField Animation */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          padding: '28px 24px',
          minHeight: '85vh',
          background: '#070810'
        }}
      >
        {/* Layer 1: Darkened Ghibli Study Artwork */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("/images/library-study.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.38) contrast(1.1) saturate(0.85)',
            zIndex: 0
          }}
        />

        {/* Layer 2: Dark Vignette Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(110% 90% at 50% 50%, rgba(8, 10, 22, 0.45), rgba(5, 6, 14, 0.85)), linear-gradient(180deg, rgba(8,10,22,0.65) 0%, rgba(8,10,22,0.3) 50%, rgba(8,10,22,0.85) 100%)',
            zIndex: 1
          }}
        />

        {/* Layer 3: Brighter Hovering VectorField Particle Currents */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, mixBlendMode: 'screen' }}>
          <VectorField
            color="220 225 255"
            particleCount={240}
            speed={1.0}
            trail={0.08}
            transparentBg={true}
            className="w-full h-full"
          />
        </div>

        {/* Layer 4: Readable Library Cards & Search Controls */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Search and Filters Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '220px' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    pointerEvents: 'none'
                  }}
                >
                  🔍
                </span>
                <input
                  id="library-search"
                  type="search"
                  placeholder="Search documents by title or keyword…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    background: 'rgba(12, 14, 28, 0.78)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: 'var(--radius-md)',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    outline: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                  }}
                />
              </div>

              {/* Subject Filter Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600, marginRight: '2px' }}>
                  Subject:
                </span>
                {SUBJECTS.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubject(sub)}
                    className={`btn ${activeSubject === sub ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '6px 14px', fontSize: '0.82rem', backdropFilter: 'blur(10px)' }}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600, marginRight: '2px' }}>
                Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '6px 14px', fontSize: '0.85rem', backdropFilter: 'blur(10px)' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Document Cards */}
          {loading ? (
            <div className="loader-container">
              <div className="spinner" style={{ width: '32px', height: '32px' }} />
            </div>
          ) : filteredDocs.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredDocs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onView={handleOpenViewer}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          ) : (
            <div
              className="empty-state"
              style={{
                background: 'rgba(12, 14, 28, 0.75)',
                backdropFilter: 'blur(16px)',
                borderColor: 'rgba(255, 255, 255, 0.15)'
              }}
            >
              <div className="empty-state-icon">📚</div>
              <h3 className="empty-state-title" style={{ color: '#fff' }}>
                No Documents Found
              </h3>
              <p className="empty-state-description" style={{ color: 'rgba(255,255,255,0.7)' }}>
                No matching documents found for current filter settings.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Document Reader Modal */}
      <DocumentReaderModal
        isOpen={!!selectedDoc}
        onClose={() => {
          setSelectedDoc(null);
          setViewUrl(null);
        }}
        document={selectedDoc}
        viewUrl={viewUrl}
        onDownload={handleDownload}
      />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} id={t.id} message={t.message} type={t.type} onClose={(id) => setToasts(prev => prev.filter(x => x.id !== id))} />
        ))}
      </div>
    </DashboardLayout>
  );
}
