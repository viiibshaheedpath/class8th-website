'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { supabase } from '@/lib/supabase/supabaseClient';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  created_at?: string;
}

export default function AdminStudentsPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (data && !error) {
        setUsers(
          data.map((p) => ({
            id: p.id,
            name: p.name || 'User',
            email: p.email || 'Registered User',
            role: (p.role as any) || 'student',
            created_at: p.updated_at
          }))
        );
      }
    } catch (e) {
      console.log('Error fetching profiles:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'student' | 'teacher' | 'admin') => {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);

      if (!error) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        setActionMsg(`Successfully updated role to ${newRole.toUpperCase()}`);
        setTimeout(() => setActionMsg(null), 3000);
      } else {
        setActionMsg(`Failed to update role: ${error.message}`);
      }
    } catch (err: any) {
      setActionMsg(`Error updating role: ${err.message}`);
    }
  };

  const handleAddAdminByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    try {
      // Elevate profile in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .ilike('email', newAdminEmail.trim());

      setActionMsg(`Updated admin status for ${newAdminEmail.trim()}`);
      setNewAdminEmail('');
      fetchUsers();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err: any) {
      setActionMsg(`Error adding admin: ${err.message}`);
    }
  };

  return (
    <AdminLayout title="User & Admin Directory">
      {/* Action Banner */}
      {actionMsg && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(129, 140, 248, 0.4)', color: '#e0e7ff', marginBottom: '20px', fontSize: '0.9rem' }}>
          ✦ {actionMsg}
        </div>
      )}

      {/* Header & Add Admin Box */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px 0' }}>User Directory & Admin Management</h2>
          <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--text-muted)' }}>
            Promote users to Admin, assign roles, and view registered student profiles.
          </p>
        </div>

        {/* Form to Add Admin by Email */}
        <form onSubmit={handleAddAdminByEmail} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="email"
            placeholder="Enter user email to make Admin…"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              minWidth: '240px',
              outline: 'none'
            }}
          />
          <Button variant="primary" type="submit" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            ➕ Make Admin
          </Button>
        </form>
      </div>

      {/* Directory Table */}
      {loading ? (
        <div className="loader-container">
          <div className="spinner" style={{ width: '32px', height: '32px' }} />
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.82rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: u.role === 'admin' ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-surface)',
                        color: u.role === 'admin' ? '#818cf8' : 'var(--text-main)',
                        fontWeight: u.role === 'admin' ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin 👑</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => setSelectedUser(u)}>
                        View Profile
                      </Button>
                      {u.role !== 'admin' && (
                        <Button variant="primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => handleRoleChange(u.id, 'admin')}>
                          Promote to Admin
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title={`Profile: ${selectedUser.name}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Current Role:</strong> {selectedUser.role.toUpperCase()}</p>
            <p><strong>User ID:</strong> <code>{selectedUser.id}</code></p>

            <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '8px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '6px' }}>Supabase Permissions</h4>
              <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-muted)' }}>
                {selectedUser.role === 'admin'
                  ? '👑 Full Admin Access Granted: Can upload PDFs, edit quizzes, add simulations, and promote users.'
                  : '🎓 Student Access: Can attempt quizzes, view library books, log study habits, and read articles.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <Button variant="primary" onClick={() => setSelectedUser(null)}>Close Profile</Button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
