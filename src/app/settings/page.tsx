'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/supabaseClient';
import { getUserQuizResults, QuizResult } from '@/services/quizService';

const PRESET_AVATARS = [
  '🎓', '✦', '🚀', '⚛️', '🧬', '💻', '🧠', '🎨', '🌟', '📚', '⚡', '🏆'
];

export default function SettingsPage() {
  const { user, profile, setProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'quiz_scores'>('profile');

  // Profile Form state
  const [name, setName] = useState(profile?.name || user?.user_metadata?.name || 'Student');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_url || profile?.avatarUrl || '🎓');
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
    if (activeTab === 'quiz_scores') {
      setLoadingResults(true);
      const activeUserId = user?.id || profile?.id || 'mock-student-1';
      getUserQuizResults(activeUserId).then((res) => {
        setQuizResults(res);
        setLoadingResults(false);
      });
    }
  }, [activeTab, user, profile]);

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

        setProfileMsg({ type: 'success', text: 'Profile updated successfully in Supabase database!' });
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
    <DashboardLayout title="Account & Profile Settings">
      <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('profile')}
            style={{ fontSize: '0.9rem', padding: '8px 18px' }}
          >
            👤 Edit Profile & Avatar
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'quiz_scores' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('quiz_scores')}
            style={{ fontSize: '0.9rem', padding: '8px 18px' }}
          >
            📊 Quiz Performance & History
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'security' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('security')}
            style={{ fontSize: '0.9rem', padding: '8px 18px' }}
          >
            🔒 Security & Password
          </button>
        </div>

        {/* TAB 1: Profile & Avatar */}
        {activeTab === 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            style={{
              padding: '28px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {profileMsg && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: profileMsg.type === 'success' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${profileMsg.type === 'success' ? '#34d399' : '#f87171'}`,
                  color: profileMsg.type === 'success' ? '#a7f3d0' : '#fca5a5',
                  fontSize: '0.88rem'
                }}
              >
                {profileMsg.text}
              </div>
            )}

            {/* Display Avatar Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
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
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#fff' }}>{name || 'Student'}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</span>
              </div>
            </div>

            {/* Avatar Selector Grid */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '10px' }}>
                Select Avatar Emoji
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(av);
                      setCustomAvatarUrl('');
                    }}
                    style={{
                      padding: '10px',
                      fontSize: '1.5rem',
                      borderRadius: '12px',
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '6px' }}>
                Or Custom Avatar Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/my-avatar.jpg"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '6px' }}>
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <Button variant="primary" type="submit" disabled={profileSaving} style={{ padding: '10px 24px' }}>
                {profileSaving ? 'Saving Profile…' : 'Save Profile Changes'}
              </Button>
            </div>
          </form>
        )}

        {/* TAB 2: Security & Password */}
        {activeTab === 'security' && (
          <form
            onSubmit={handleChangePassword}
            style={{
              padding: '28px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {passwordMsg && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: passwordMsg.type === 'success' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${passwordMsg.type === 'success' ? '#34d399' : '#f87171'}`,
                  color: passwordMsg.type === 'success' ? '#a7f3d0' : '#fca5a5',
                  fontSize: '0.88rem'
                }}
              >
                {passwordMsg.text}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '6px' }}>
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
                  padding: '12px 14px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '6px' }}>
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
                  padding: '12px 14px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <Button variant="primary" type="submit" disabled={passwordSaving} style={{ padding: '10px 24px' }}>
                {passwordSaving ? 'Updating Password…' : 'Update Password in Database'}
              </Button>
            </div>
          </form>
        )}

        {/* TAB 3: Quiz Performance & History */}
        {activeTab === 'quiz_scores' && (
          <div
            style={{
              padding: '28px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#fff' }}>
                🎓 Quiz Scores & Academic History
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Keep track of all practice quiz scores, percentages, and completed attempts over time.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                <span style={{ fontSize: '0.78rem', color: '#a5b4fc', textTransform: 'uppercase', fontWeight: 700 }}>Total Attempted</span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', color: '#ffffff' }}>{quizResults.length}</h2>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.25)' }}>
                <span style={{ fontSize: '0.78rem', color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>Average Score</span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', color: '#ffffff' }}>
                  {quizResults.length > 0
                    ? Math.round(quizResults.reduce((acc, r) => acc + r.percentage, 0) / quizResults.length)
                    : 0}%
                </h2>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.25)' }}>
                <span style={{ fontSize: '0.78rem', color: '#fcd34d', textTransform: 'uppercase', fontWeight: 700 }}>Highest Score</span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', color: '#ffffff' }}>
                  {quizResults.length > 0 ? Math.max(...quizResults.map((r) => r.percentage)) : 0}%
                </h2>
              </div>
            </div>

            {/* Attempts History Table */}
            {loadingResults ? (
              <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner" style={{ width: '32px', height: '32px' }} /></div>
            ) : quizResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>📝</span>
                <h4 style={{ margin: '0 0 6px 0', color: '#fff' }}>No Quiz Attempts Recorded Yet</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
                  Complete a practice quiz to record your score in your student profile.
                </p>
                <a href="/quizzes" className="btn btn-primary" style={{ textDecoration: 'none', padding: '8px 18px', fontSize: '0.85rem' }}>
                  Take a Practice Quiz →
                </a>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Quiz Title</th>
                      <th>Subject</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Date Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizResults.map((res) => (
                      <tr key={res.id}>
                        <td style={{ fontWeight: 600 }}>{res.quizTitle}</td>
                        <td>{res.subject || 'General'}</td>
                        <td style={{ fontWeight: 700 }}>{res.score} / {res.totalPoints} pts</td>
                        <td>
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              background: res.percentage >= 70 ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: res.percentage >= 70 ? '#6ee7b7' : '#fca5a5'
                            }}
                          >
                            {res.percentage}%
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(res.completedAt).toLocaleDateString()} {new Date(res.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    </DashboardLayout>
  );
}
