'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Document } from '@/data/mockDocuments';
import {
  getAllDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  uploadDocumentFile,
  DocumentInput
} from '@/services/libraryService';

const STATUS_CYCLE: Record<string, Document['status']> = {
  draft: 'published',
  published: 'archived',
  archived: 'draft'
};

function StatusBadge({ status }: { status: Document['status'] }) {
  switch (status) {
    case 'published': return <Badge variant="success">Published</Badge>;
    case 'draft':     return <Badge variant="warning">Draft</Badge>;
    case 'archived':  return <Badge variant="secondary">Archived</Badge>;
  }
}

const BLANK_FORM: DocumentInput = {
  title: '',
  category: 'Syllabus',
  subject: 'Science',
  description: '',
  filePath: '/docs/sample.pdf',
  fileType: 'pdf',
  allowView: true,
  allowDownload: true,
  status: 'published'
};

export default function AdminLibraryPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [form, setForm]               = useState<DocumentInput>(BLANK_FORM);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Delete confirm state
  const [deleteId, setDeleteId]       = useState<string | null>(null);

  useEffect(() => {
    getAllDocuments().then((data) => {
      setDocuments(data);
      setLoading(false);
    });
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(BLANK_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (doc: Document) => {
    setEditingId(doc.id);
    setForm({
      title: doc.title,
      category: doc.category,
      subject: doc.subject,
      description: doc.description,
      filePath: doc.filePath,
      fileType: doc.fileType,
      allowView: doc.allowView,
      allowDownload: doc.allowDownload,
      status: doc.status
    });
    setIsModalOpen(true);
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);

    try {
      const res = await uploadDocumentFile(file);
      setForm((prev) => ({
        ...prev,
        filePath: res.filePath,
        fileType: res.fileType,
        thumbnailUrl: res.thumbnailUrl,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '')
      }));
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);

    try {
      if (editingId) {
        const updated = await updateDocument(editingId, form);
        setDocuments((prev) => prev.map((d) => (d.id === editingId ? updated : d)));
      } else {
        const created = await createDocument(form);
        setDocuments((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDownload = async (doc: Document) => {
    try {
      const updated = await updateDocument(doc.id, { allowDownload: !doc.allowDownload });
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
    } catch {}
  };

  const handleToggleView = async (doc: Document) => {
    try {
      const updated = await updateDocument(doc.id, { allowView: !doc.allowView });
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
    } catch {}
  };

  const handleToggleStatus = async (doc: Document) => {
    const nextStatus = STATUS_CYCLE[doc.status] ?? 'published';
    try {
      const updated = await updateDocument(doc.id, { status: nextStatus });
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
    } catch {}
  };

  const handleDeleteDocument = async () => {
    if (!deleteId) return;
    try {
      await deleteDocument(deleteId);
      setDocuments((prev) => prev.filter((d) => d.id !== deleteId));
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout title="Manage Library Documents">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Digital Document Repository</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Configure student view and PDF download permissions.</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>
          + Upload Document
        </Button>
      </div>

      {/* Admin Table */}
      {loading ? (
        <div className="loader-container"><div className="spinner" style={{ width: '32px', height: '32px' }} /></div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Allow View</th>
                <th>Allow Download</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td style={{ fontWeight: 600 }}>{doc.title}</td>
                  <td><Badge variant="primary">{doc.category}</Badge></td>
                  <td>{doc.subject}</td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(doc)}
                      title="Click to cycle status"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <StatusBadge status={doc.status} />
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleView(doc)}
                      className={`btn ${doc.allowView ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                    >
                      {doc.allowView ? '✓ Enabled' : '✕ Disabled'}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleDownload(doc)}
                      className={`btn ${doc.allowDownload ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                    >
                      {doc.allowDownload ? '✓ Allowed' : '✕ Disabled'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        variant="outline"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        onClick={() => openEditModal(doc)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        style={{ padding: '4px 10px', fontSize: '0.8rem', color: 'var(--color-danger)' }}
                        onClick={() => setDeleteId(doc.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No documents yet. Click "+ Upload Document" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Document Upload/Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? 'Edit Document Details' : 'Upload Library Document'}
        >
          <form onSubmit={handleSaveDocument} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Direct File Picker Dropzone */}
            <div
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '2px dashed rgba(99, 102, 241, 0.4)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '2rem' }}>📁</span>
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#ffffff', display: 'block' }}>
                  {form.filePath && form.filePath !== '/docs/sample.pdf' ? '✓ File Uploaded & Ready' : 'Choose Document File'}
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Supports PDF (.pdf), Word (.doc, .docx), PowerPoint (.ppt, .pptx)
                </span>
              </div>

              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileSelected}
                style={{
                  marginTop: '6px',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)'
                }}
              />

              {uploadingFile && (
                <span style={{ fontSize: '0.8rem', color: 'var(--color-info)', fontWeight: 600 }}>
                  ⏳ Uploading document file…
                </span>
              )}

              {form.filePath && form.filePath !== '/docs/sample.pdf' && (
                <span style={{ fontSize: '0.78rem', color: '#6ee7b7', background: 'rgba(52,211,153,0.15)', padding: '4px 10px', borderRadius: '6px' }}>
                  Path: {form.filePath} ({form.fileType?.toUpperCase()})
                </span>
              )}
            </div>

            <Input
              label="Document Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="e.g. Class 8 Physics Formula Sheet"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Select
                label="Category"
                options={[
                  { value: 'Syllabus', label: 'Syllabus' },
                  { value: 'Notes', label: 'Notes' },
                  { value: 'Textbooks', label: 'Textbooks' }
                ]}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <Select
                label="Subject"
                options={[
                  { value: 'Science', label: 'Science' },
                  { value: 'Mathematics', label: 'Mathematics' },
                  { value: 'English', label: 'English' }
                ]}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Select
                label="Status"
                options={[
                  { value: 'published', label: 'Published' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'archived', label: 'Archived' }
                ]}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Document['status'] })}
              />
              <Select
                label="File Format"
                options={[
                  { value: 'pdf', label: 'PDF (.pdf)' },
                  { value: 'docx', label: 'Word (.docx)' },
                  { value: 'pptx', label: 'PowerPoint (.pptx)' }
                ]}
                value={form.fileType || 'pdf'}
                onChange={(e) => setForm({ ...form, fileType: e.target.value })}
              />
            </div>

            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Overview of document contents…"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-warning)' }}>
                🔒 Admin Permissions Settings:
              </span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.allowView}
                  onChange={(e) => setForm({ ...form, allowView: e.target.checked })}
                />
                Allow Students to Read Online in Browser Reader
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.allowDownload}
                  onChange={(e) => setForm({ ...form, allowDownload: e.target.checked })}
                />
                Allow Students to Download Local Copy
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={saving}>
                {editingId ? 'Save Changes' : 'Save Document'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Document"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Are you sure you want to delete this document? This action <strong>cannot be undone</strong>.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteDocument}>Yes, Delete</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
