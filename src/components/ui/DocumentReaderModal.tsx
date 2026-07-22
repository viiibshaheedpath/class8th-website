'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { Document } from '@/data/mockDocuments';

interface DocumentReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  viewUrl: string | null;
  onDownload: (doc: Document) => void;
}

export function DocumentReaderModal({
  isOpen,
  onClose,
  document: doc,
  viewUrl,
  onDownload
}: DocumentReaderModalProps) {
  const [zoom, setZoom] = useState(100);
  const [activePage, setActivePage] = useState(1);

  if (!doc) return null;

  const fileExt = (doc.fileType || doc.filePath.split('.').pop() || 'pdf').toLowerCase();
  const isPdf = fileExt === 'pdf';
  const isWord = ['doc', 'docx'].includes(fileExt);
  const isPpt = ['ppt', 'pptx'].includes(fileExt);

  // Resolved URL to use for rendering
  let activeUrl = viewUrl || doc.filePath;
  if (
    activeUrl &&
    !activeUrl.startsWith('http://') &&
    !activeUrl.startsWith('https://') &&
    !activeUrl.startsWith('blob:') &&
    !activeUrl.startsWith('/')
  ) {
    activeUrl = `/${activeUrl}`;
  }
  const isRemoteHttp = activeUrl.startsWith('http://') || activeUrl.startsWith('https://');

  const getDocTypeBadge = () => {
    if (isPdf) return <Badge variant="danger">PDF Document</Badge>;
    if (isWord) return <Badge variant="primary">Word Document (.docx)</Badge>;
    if (isPpt) return <Badge variant="warning">PowerPoint (.pptx)</Badge>;
    return <Badge variant="secondary">{fileExt.toUpperCase()}</Badge>;
  };

  // Mock Pages for Word & PPT interactive online reader preview
  const wordPages = [
    {
      heading: 'Chapter Overview & Key Principles',
      content: `${doc.description || 'This document contains essential study material and textbook notes for Class 8th.'} It covers core theoretical frameworks, formula derivations, step-by-step examples, and conceptual practice problems designed to reinforce learning.`
    },
    {
      heading: 'Important Formulas & Definitions',
      content: '1. Standard Representation & Notation: Always simplify rational numbers and algebraic expressions to standard form.\n2. Law of Conservation: Energy and matter in closed systems are conserved during chemical and physical transformations.\n3. Summary Rules: Review end-of-chapter practice questions and verify step-by-step solutions.'
    },
    {
      heading: 'Chapter Summary & Self-Assessment',
      content: 'Make sure to solve all attached practice exercise questions. For additional practice, check out the interactive simulations and online quizzes available in the Class 8th Hub portal.'
    }
  ];

  const pptSlides = [
    {
      slideNo: 1,
      title: doc.title,
      subtitle: `Class 8th • ${doc.subject} • ${doc.category}`,
      bullets: [
        'Interactive Classroom Presentation Deck',
        `Topic: ${doc.subject} Core Modules`,
        'Instructor Guidelines & Chapter Visuals'
      ]
    },
    {
      slideNo: 2,
      title: 'Key Concepts & Breakdown',
      subtitle: 'Core Learning Objectives',
      bullets: [
        doc.description || 'Comprehensive study notes and visual diagrams.',
        'Step-by-step illustration of fundamental rules & formulas.',
        'Common student misconceptions and exam tips.'
      ]
    },
    {
      slideNo: 3,
      title: 'Summary & Practice Assignments',
      subtitle: 'Review & Homework',
      bullets: [
        'Attempt practice quiz modules in the Quiz section.',
        'Review accompanying PDF formula sheets in the Library.',
        'Ask questions in class for remaining doubts.'
      ]
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={doc.title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Document Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {getDocTypeBadge()}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {doc.subject} • {doc.category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {doc.allowDownload ? (
              <Button
                variant="primary"
                style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                onClick={() => onDownload(doc)}
              >
                📥 Download {fileExt.toUpperCase()}
              </Button>
            ) : (
              <span
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.25)'
                }}
              >
                🔒 Download Disabled by Instructor
              </span>
            )}
          </div>
        </div>

        {/* Online Document Reader Container */}
        {doc.allowView ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '540px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              background: '#0a0c1a',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Reader Toolbar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.82rem',
                color: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>📖 Online Reader</span>
                {(isWord || isPpt) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '6px' }}>
                    <button
                      disabled={activePage <= 1}
                      onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                      style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                    >
                      ◀
                    </button>
                    <span>
                      {isPpt ? `Slide ${activePage} / 3` : `Page ${activePage} / 3`}
                    </span>
                    <button
                      disabled={activePage >= 3}
                      onClick={() => setActivePage((p) => Math.min(3, p + 1))}
                      style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                    >
                      ▶
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setZoom((z) => Math.max(60, z - 15))}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '2px 6px' }}
                >
                  🔍-
                </button>
                <span>{zoom}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(180, z + 15))}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '2px 6px' }}
                >
                  🔍+
                </button>
              </div>
            </div>

            {/* Reader Viewport Canvas */}
            <div style={{ flex: 1, overflow: 'auto', padding: isPdf ? 0 : '24px', display: 'flex', justifyContent: 'center' }}>
              {/* PDF VIEWER */}
              {isPdf ? (
                <div style={{ width: '100%', height: '100%', transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
                  {activeUrl ? (
                    <object
                      data={activeUrl}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                    >
                      <iframe src={activeUrl} width="100%" height="100%" style={{ border: 'none' }} />
                    </object>
                  ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#ffffff' }}>
                      <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>📄</span>
                      <h3>{doc.title}</h3>
                      <p style={{ color: 'var(--text-muted)' }}>{doc.description || 'Class 8th PDF Document'}</p>
                    </div>
                  )}
                </div>
              ) : isWord ? (
                /* WORD DOCUMENT READER */
                <div
                  style={{
                    width: '100%',
                    maxWidth: '680px',
                    background: '#ffffff',
                    color: '#0f172a',
                    borderRadius: '8px',
                    padding: '40px 36px',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.6)',
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                    margin: '12px auto'
                  }}
                >
                  <div style={{ borderBottom: '2px solid #6366f1', paddingBottom: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '2.5rem' }}>📝</span>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#1e293b', fontWeight: 800 }}>{doc.title}</h2>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Microsoft Word Document • Subject: {doc.subject}
                      </span>
                    </div>
                  </div>

                  <div style={{ lineHeight: 1.8, fontSize: '0.95rem', color: '#334155' }}>
                    <h3 style={{ color: '#4338ca', fontSize: '1.1rem', marginBottom: '10px' }}>
                      {wordPages[activePage - 1].heading}
                    </h3>
                    <p style={{ whiteSpace: 'pre-line', margin: '0 0 20px 0' }}>
                      {wordPages[activePage - 1].content}
                    </p>

                    <div style={{ background: '#f1f5f9', borderLeft: '4px solid #4f46e5', padding: '14px', borderRadius: '4px', marginTop: '24px' }}>
                      <strong style={{ color: '#1e293b', display: 'block', marginBottom: '4px' }}>💡 Study Tip:</strong>
                      <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                        Review all definitions in this Word document before attempting the online practice quiz.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* POWERPOINT SLIDE DECK READER */
                <div
                  style={{
                    width: '100%',
                    maxWidth: '720px',
                    background: 'linear-gradient(135deg, #1e1b4b, #311b92)',
                    color: '#ffffff',
                    borderRadius: '16px',
                    padding: '36px 40px',
                    boxShadow: '0 14px 40px rgba(0,0,0,0.6)',
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                    margin: '16px auto',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '999px', fontWeight: 700 }}>
                      📊 SLIDE {pptSlides[activePage - 1].slideNo} OF 3
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                      {doc.subject} PowerPoint Deck
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 8px 0', color: '#ffffff' }}>
                    {pptSlides[activePage - 1].title}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: '#a5b4fc', marginBottom: '24px' }}>
                    {pptSlides[activePage - 1].subtitle}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pptSlides[activePage - 1].bullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          background: 'rgba(255,255,255,0.07)',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          fontSize: '0.92rem'
                        }}
                      >
                        <span style={{ color: '#818cf8', fontSize: '1.1rem' }}>✦</span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Viewing Restricted Notice */
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: 'var(--bg-app)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🔒</span>
            <h4 style={{ color: 'var(--color-warning)', margin: '0 0 6px 0' }}>Online Viewing Restricted</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              The instructor has disabled online reading for this document.
              {doc.allowDownload ? ' You may still download the file using the button above.' : ''}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
