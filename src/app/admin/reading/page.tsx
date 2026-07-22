'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockArticles } from '@/data/mockArticles';

export default function AdminReadingPage() {
  const [sources, setSources] = useState([
    { id: '1', name: 'NASA Space News', siteUrl: 'https://nasa.gov', feedUrl: 'https://nasa.gov/rss/news.xml', category: 'Science', active: true },
    { id: '2', name: 'National Geographic Kids', siteUrl: 'https://natgeokids.com', feedUrl: 'https://natgeokids.com/feed', category: 'Biology & Earth', active: true },
    { id: '3', name: 'MIT Technology Review', siteUrl: 'https://technologyreview.com', feedUrl: 'https://technologyreview.com/feed', category: 'Technology', active: false }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [feedUrl, setFeedUrl] = useState('');
  const [category, setCategory] = useState('Science');

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newSource = {
      id: Math.random().toString(),
      name,
      siteUrl,
      feedUrl,
      category,
      active: true
    };
    setSources([newSource, ...sources]);
    setIsModalOpen(false);
    setName('');
    setSiteUrl('');
    setFeedUrl('');
  };

  const toggleSourceActive = (id: string) => {
    setSources(sources.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <AdminLayout title="Manage Reading Sources">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>RSS Feeds & News Sync Sources</h2>
          <p style={{ fontSize: '0.875rem' }}>Configure automated educational news feeds for student reading list.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Add Reading Source
        </Button>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Source Name</th>
              <th>Website URL</th>
              <th>Feed URL</th>
              <th>Category</th>
              <th>Sync Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((src) => (
              <tr key={src.id}>
                <td style={{ fontWeight: 600 }}>{src.name}</td>
                <td style={{ fontSize: '0.8rem' }}><code>{src.siteUrl}</code></td>
                <td style={{ fontSize: '0.8rem' }}><code>{src.feedUrl}</code></td>
                <td><Badge variant="primary">{src.category}</Badge></td>
                <td>
                  <button
                    onClick={() => toggleSourceActive(src.id)}
                    className={`btn ${src.active ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    {src.active ? 'Active' : 'Paused'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Edit</Button>
                    <Button variant="ghost" style={{ padding: '4px 10px', fontSize: '0.8rem', color: 'var(--color-danger)' }}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add RSS Feed Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add RSS Feed Source">
          <form onSubmit={handleAddSource} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input label="Source Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Science Daily" />
            <Input label="Website URL" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} placeholder="https://sciencedaily.com" />
            <Input label="RSS / Atom Feed URL" value={feedUrl} onChange={(e) => setFeedUrl(e.target.value)} placeholder="https://sciencedaily.com/rss/all.xml" />
            
            <Select
              label="Category"
              options={[
                { value: 'Science', label: 'Science' },
                { value: 'Technology', label: 'Technology' },
                { value: 'General Knowledge', label: 'General Knowledge' }
              ]}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Save Feed Source</Button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
