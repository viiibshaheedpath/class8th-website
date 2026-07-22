'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/supabaseClient';
import { getUserQuizResults, QuizResult } from '@/services/quizService';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'security' | 'quiz_scores';
}

const PRESET_AVATARS = [
  '🎓', '✦', '🚀', '⚛️', '🧬', '💻', '🧠', '🎨', '🌟', '📚', '⚡', '🏆'
];

export function ProfileSettingsModal({ isOpen, onClose, initialTab = 'profile' }: ProfileSettingsModalProps) {
  const { user, profile, setProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'quiz_scores'>(initialTab);

  // Profile Form state
  const [name, setName] = useState(profile?.name || user?.user_metadata?.name || 'Student');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_url || '🎓');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Quiz Results state
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    if (activeTab === 'quiz_scores' && isOpen) {
      setLoadingResults(true);
      const activeUserId = user?.id || profile?.id || 'mock-student-1';
      getUserQuizResults(activeUserId).then((res) => {
        setQuizResults(res);
        setLoadingResults(false);
      });
    }
  }, [activeTab, isOpen, user, profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);

    const avatarToSave = customAvatarUrl.trim() || selectedAvatar;

    try {
      if (user?.id) {
        // Update Supabase public.profiles table
        const { error: dbError } = await supabase
          .from('profiles')
          .update({
            name: name.trim(),
            avatar_url: avatarToSave,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (dbError) {
          // If profile row doesn't exist yet, insert it
          await supabase.from('profiles').upsert({
            id: user.id,
            name: name.trim(),
            avatar_url: avatarToSave,
            role: profile?.role || 'student'
          });
        }

        // Update Auth Metadata
        await supabase.auth.updateUser({
          data: { name: name.trim(), avatar_url: avatarToSave }
        });

        // Update local state
        if (setProfile) {
          setProfile({
            id: user.id,
            name: name.trim(),
            avatar_url: avatarToSave,
            avatarUrl: avatarToSave,
            role: profile?.role || 'student',
            email: user.email || ''
          });
        }

        setProfileMsg({ type: 'success', text: 'Profile updated successfully in Supabase!' });
      }
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      setPasswordSaving(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      setPasswordSaving(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setPasswordMsg({ type: 'error', text: error.message });
      } else {
        setPasswordMsg({ type: 'success', text: 'Password updated successfully in Supabase database!' });
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Settings & Profile">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('profile')}
            style={{ fontSize: '0.88rem', padding: '6px 16px' }}
          >
            👤 Profile & Avatar
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'quiz_scores' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('quiz_scores')}
            style={{ fontSize: '0.88rem', padding: '6px 16px' }}
          >
            📊 Quiz History
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'security' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('security')}
            style={{ fontSize: '0.88rem', padding: '6px 16px' }}
          >
            🔒 Security & Password
          </button>
        </div>

        {/* TAB 1: Profile & Avatar */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {profileMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: profileMsg.type === 'success' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${profileMsg.type === 'success' ? '#34d399' : '#f87171'}`,
                  color: profileMsg.type === 'success' ? '#a7f3d0' : '#fca5a5',
                  fontSize: '0.85rem'
                }}
              >
                {profileMsg.text}
              </div>
            )}

            {/* Display Avatar Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                  overflow: 'hidden'
                }}
              >
                {customAvatarUrl.trim() ? (
                  <img src={customAvatarUrl.trim()} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  selectedAvatar
                )}
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#fff' }}>{name || 'Student'}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</span>
              </div>
            </div>

            {/* Avatar Selector Grid */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
                Select Preset Avatar Emoji
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(av);
                      setCustomAvatarUrl('');
                    }}
                    style={{
                      padding: '8px',
                      fontSize: '1.4rem',
                      borderRadius: '10px',
                      border: selectedAvatar === av && !customAvatarUrl ? '2px solid #818cf8' : '1px solid var(--border-color)',
                      background: selectedAvatar === av && !customAvatarUrl ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-app)',
                      cursor: 'pointer'
                    }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Avatar Image URL */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '6px' }}>
                Or Custom Avatar Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/my-avatar.jpg"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '6px' }}>
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <Button variant="secondary" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={profileSaving}>
                {profileSaving ? 'Saving Profile…' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}

        {/* TAB 2: Security & Password */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {passwordMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: passwordMsg.type === 'success' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${passwordMsg.type === 'success' ? '#34d399' : '#f87171'}`,
                  color: passwordMsg.type === 'success' ? '#a7f3d0' : '#fca5a5',
                  fontSize: '0.85rem'
                }}
              >
                {passwordMsg.text}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '6px' }}>
                New Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter at least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '6px' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <Button variant="secondary" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={passwordSaving}>
                {passwordSaving ? 'Updating Password…' : 'Update Password'}
              </Button>
            </div>
          </form>
        )}

        {/* TAB 3: Quiz Scores & History */}
        {activeTab === 'quiz_scores' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#fff' }}>
                🎓 Practice Quiz Performance
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Your completed quiz attempts are recorded under your student profile.
              </p>
            </div>

            {loadingResults ? (
              <div style={{ textAlign: 'center', padding: '30px' }}><div className="spinner" style={{ width: '28px', height: '28px' }} /></div>
            ) : quizResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px dashed var(--border-color)' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '6px' }}>📝</span>
                <h5 style={{ margin: '0 0 4px 0', color: '#fff' }}>No Quiz Attempts Recorded Yet</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                  Complete a practice quiz to view your progress here.
                </p>
                <a href="/quizzes" onClick={onClose} className="btn btn-primary" style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.8rem' }}>
                  Start a Quiz →
                </a>
              </div>
            ) : (
              <div className="admin-table-container" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Quiz Title</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizResults.map((res) => (
                      <tr key={res.id}>
                        <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{res.quizTitle}</td>
                        <td style={{ fontWeight: 700, fontSize: '0.85rem' }}>{res.score} / {res.totalPoints}</td>
                        <td>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: res.percentage >= 70 ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: res.percentage >= 70 ? '#6ee7b7' : '#fca5a5'
                            }}
                          >
                            {res.percentage}%
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {new Date(res.completedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
