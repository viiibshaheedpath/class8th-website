'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Simulation } from '@/data/mockSimulations';
import {
  getAllSimulations,
  createSimulation,
  updateSimulation,
  deleteSimulation,
  SimulationInput
} from '@/services/simulationsService';

// ─── Status helpers ────────────────────────────────────────────────────────

const STATUS_CYCLE: Record<string, Simulation['status']> = {
  draft: 'published',
  published: 'archived',
  archived: 'draft'
};

function StatusBadge({ status }: { status: Simulation['status'] }) {
  switch (status) {
    case 'published': return <Badge variant="success">Published</Badge>;
    case 'draft':     return <Badge variant="warning">Draft</Badge>;
    case 'archived':  return <Badge variant="secondary">Archived</Badge>;
  }
}

// ─── Blank form state ─────────────────────────────────────────────────────

const BLANK: SimulationInput = {
  title: '',
  subject: 'Physics',
  description: '',
  difficulty: 'Medium',
  status: 'published',
  embedUrl: '',
  filePath: ''
};

// ─── Component ────────────────────────────────────────────────────────────

export default function AdminSimulationsPage() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);

  // Modal state
  const [modalOpen, setModalOpen]   = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [form, setForm]             = useState<SimulationInput>(BLANK);

  // Delete confirm state
  const [deleteId, setDeleteId]     = useState<string | null>(null);

  // ── Load all simulations (including drafts/archived for admin)
  useEffect(() => {
    getAllSimulations().then((data) => {
      setSimulations(data);
      setLoading(false);
    });
  }, []);

  // ── Open add modal
  function openAddModal() {
    setEditingId(null);
    setForm(BLANK);
    setModalOpen(true);
  }

  // ── Open edit modal pre-filled
  function openEditModal(sim: Simulation) {
    setEditingId(sim.id);
    setForm({
      title:       sim.title,
      subject:     sim.subject,
      description: sim.description,
      difficulty:  sim.difficulty,
      status:      sim.status,
      embedUrl:    sim.embedUrl ?? '',
      filePath:    sim.filePath ?? ''
    });
    setModalOpen(true);
  }

  // ── Save (create or update)
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateSimulation(editingId, form);
        setSimulations((prev) => prev.map((s) => s.id === editingId ? updated : s));
      } else {
        const created = await createSimulation(form);
        setSimulations((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  // ── Toggle publish status (cycles draft → published → archived → draft)
  async function handleToggleStatus(sim: Simulation) {
    const nextStatus = STATUS_CYCLE[sim.status] ?? 'published';
    try {
      const updated = await updateSimulation(sim.id, { status: nextStatus });
      setSimulations((prev) => prev.map((s) => s.id === sim.id ? updated : s));
    } catch {}
  }

  // ── Delete
  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteSimulation(deleteId);
      setSimulations((prev) => prev.filter((s) => s.id !== deleteId));
    } finally {
      setDeleteId(null);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Manage Simulations">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Interactive Simulations Catalog</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Upload Z Code packages or set iframe embed URLs.</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>+ Add Simulation</Button>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="loader-container"><div className="spinner" style={{ width: '32px', height: '32px' }} /></div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {simulations.map((sim) => (
                <tr key={sim.id}>
                  <td style={{ fontWeight: 600 }}>{sim.title}</td>
                  <td>{sim.subject}</td>
                  <td>{sim.difficulty}</td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(sim)}
                      title="Click to cycle status"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <StatusBadge status={sim.status} />
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        variant="outline"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        onClick={() => openEditModal(sim)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        style={{ padding: '4px 10px', fontSize: '0.8rem', color: 'var(--color-danger)' }}
                        onClick={() => setDeleteId(sim.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {simulations.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No simulations yet. Click "+ Add Simulation" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Simulation' : 'Add New Simulation Package'}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            placeholder="e.g. Electric Circuit Simulator"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              label="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              options={[
                { value: 'Physics',     label: 'Physics' },
                { value: 'Chemistry',   label: 'Chemistry' },
                { value: 'Mathematics', label: 'Mathematics' }
              ]}
            />
            <Select
              label="Difficulty"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
              options={[
                { value: 'Easy',   label: 'Easy' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Hard',   label: 'Hard' }
              ]}
            />
          </div>

          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' | 'archived' })}
            options={[
              { value: 'published', label: 'Published' },
              { value: 'draft',     label: 'Draft' },
              { value: 'archived',  label: 'Archived' }
            ]}
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Summary of learning objectives…"
          />

          <Input
            label="HTML Embed URL (e.g. PhET simulation link)"
            value={form.embedUrl}
            onChange={(e) => setForm({ ...form, embedUrl: e.target.value })}
            placeholder="https://phet.colorado.edu/sims/html/…"
          />

          <Input
            label="File Path (Supabase Storage path for Z Code package)"
            value={form.filePath}
            onChange={(e) => setForm({ ...form, filePath: e.target.value })}
            placeholder="simulations/my-package.html"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              {editingId ? 'Save Changes' : 'Create Simulation'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Simulation"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Are you sure you want to delete this simulation? This action <strong>cannot be undone</strong>.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
