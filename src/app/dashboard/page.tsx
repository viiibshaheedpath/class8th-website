'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockSimulations } from '@/data/mockSimulations';
import { mockQuizzes } from '@/data/mockQuizzes';
import { mockSchedule } from '@/data/mockSchedule';

export default function DashboardOverviewPage() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [studentXP, setStudentXP] = useState(1250);
  const [studentCoins, setStudentCoins] = useState(350);
  const [claimedDaily, setClaimedDaily] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure video plays in full, then mutes, darkens, loops in background, and reveals dashboard
  const handleFullVideoCompleted = () => {
    setVideoEnded(true);
    if (videoRef.current) {
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
    setTimeout(() => {
      setShowDashboard(true);
    }, 200);
  };

  const handleClaimDailyBonus = () => {
    if (claimedDaily) return;
    setStudentXP((prev) => prev + 50);
    setStudentCoins((prev) => prev + 25);
    setClaimedDaily(true);
    setToastMsg('🎉 Daily Study Bonus Claimed! +50 XP & +25 Coins');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <DashboardLayout title="Overview">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            zIndex: 999,
            padding: '12px 18px',
            background: 'rgba(52, 211, 153, 0.25)',
            border: '1px solid #34d399',
            borderRadius: '12px',
            color: '#a7f3d0',
            fontWeight: 700,
            fontSize: '0.88rem',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
          }}
        >
          {toastMsg}
        </div>
      )}

      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          minHeight: '85vh',
          background: '#04050e',
          padding: '8px'
        }}
      >
        {/* Background Video 4.mp4 - Mutes, Darkens, and Loops once videoEnded is true */}
        <video
          ref={videoRef}
          autoPlay
          muted={videoEnded}
          loop={videoEnded}
          playsInline
          src="/4.mp4"
          onEnded={handleFullVideoCompleted}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: videoEnded
              ? 'brightness(0.25) contrast(1.15) saturate(0.8)'
              : 'brightness(0.98) contrast(1.05)',
            transition: 'filter 1.2s ease',
            zIndex: 0
          }}
        />

        {/* Dark Vignette Overlay Tint */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(120% 100% at 50% 50%, rgba(4, 5, 14, 0.55), rgba(4, 5, 14, 0.92)), linear-gradient(180deg, rgba(4,5,14,0.75) 0%, transparent 40%, rgba(4,5,14,0.92) 100%)',
            opacity: videoEnded ? 1 : 0,
            transition: 'opacity 1.2s ease',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Skip Intro Button */}
        {!showDashboard && (
          <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 20 }}>
            <button
              onClick={handleFullVideoCompleted}
              style={{
                padding: '10px 20px',
                borderRadius: '999px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>View Dashboard →</span>
            </button>
          </div>
        )}

        {/* Responsive Dashboard Content Container - Animated Slide Up From Bottom */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '980px',
            margin: '0 auto',
            padding: '12px 10px',
            transform: showDashboard ? 'translateY(0) scale(1)' : 'translateY(120px) scale(0.96)',
            opacity: showDashboard ? 1 : 0,
            transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease',
            pointerEvents: showDashboard ? 'auto' : 'none'
          }}
        >
          {/* Stat Metric Cards (Responsive Grid for Mobile) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '10px',
              marginBottom: '14px'
            }}
          >
            <Card style={{ padding: '10px 12px', background: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(16px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.18)',
                    color: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}
                >
                  🔥
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>7 Days</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)' }}>Study Streak</div>
                </div>
              </div>
            </Card>

            <Card style={{ padding: '10px 12px', background: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(16px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(59, 130, 246, 0.18)',
                    color: '#60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}
                >
                  📋
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>3 Tasks</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)' }}>Today's Goal</div>
                </div>
              </div>
            </Card>

            <Card style={{ padding: '10px 12px', background: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(16px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(52, 211, 153, 0.18)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}
                >
                  ✅
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>12 Passed</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)' }}>Quizzes</div>
                </div>
              </div>
            </Card>

            <Card style={{ padding: '10px 12px', background: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(16px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(168, 85, 247, 0.18)',
                    color: '#c084fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}
                >
                  ⚡
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>{studentXP.toLocaleString()} XP</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.65)' }}>Scholar XP</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Student Rewards & Achievements Banner */}
          <Card
            style={{
              padding: '14px 16px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(16px)',
              borderColor: 'rgba(129, 140, 248, 0.3)',
              marginBottom: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                  Student Level 4 Scholar
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.05rem', color: '#ffffff', fontWeight: 800 }}>
                  🏆 Rewards &amp; Unlocked Badges
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  🪙 {studentCoins} Coins
                </div>
                <button
                  onClick={handleClaimDailyBonus}
                  disabled={claimedDaily}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    border: 'none',
                    background: claimedDaily ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: claimedDaily ? 'default' : 'pointer',
                    boxShadow: claimedDaily ? 'none' : '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  {claimedDaily ? '✅ Claimed' : '🎁 Claim Bonus (+50 XP)'}
                </button>
              </div>
            </div>

            {/* Badges Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              <div style={{ padding: '8px 10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>🥇</span>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>Consistency</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>7-day streak</div>
                </div>
              </div>

              <div style={{ padding: '8px 10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>⚡</span>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>Lab Explorer</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>5 simulations</div>
                </div>
              </div>

              <div style={{ padding: '8px 10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>📚</span>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>Avid Reader</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>8 articles read</div>
                </div>
              </div>

              <div style={{ padding: '8px 10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>🎯</span>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>Quiz Champion</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>100% quiz score</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Main Widgets Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {/* Today's Schedule & Habit Progress */}
            <Card
              title="Today's Study Schedule"
              subtitle={mockSchedule.title}
              style={{ background: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(16px)', padding: '14px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', color: 'rgba(255,255,255,0.8)' }}>
                    <span>Daily Completion</span>
                    <strong>66%</strong>
                  </div>
                  <ProgressBar value={66} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  {mockSchedule.subjects.map((sub, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1rem' }}>📌</span>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>
                            {sub.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
                            {sub.sessions[0]?.day || 'Scheduled'} • {sub.sessions[0]?.goal || 'Practice'}
                          </div>
                        </div>
                      </div>
                      <Badge variant="warning" style={{ fontSize: '0.65rem' }}>
                        {sub.sessions[0]?.startTime || '17:00'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Interactive Simulations */}
            <Card
              title="Featured Physics Simulations"
              subtitle="Hands-on interactive learning modules"
              style={{ background: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(16px)', padding: '14px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mockSimulations.slice(0, 2).map((sim) => (
                  <div
                    key={sim.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        flexShrink: 0
                      }}
                    >
                      ⚡
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {sim.title}
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {sim.description}
                      </p>
                    </div>
                    {sim.openInNewTab && sim.embedUrl ? (
                      <a href={sim.embedUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Button variant="primary" style={{ padding: '5px 10px', fontSize: '0.72rem' }}>
                          Launch ↗
                        </Button>
                      </a>
                    ) : (
                      <Link href={`/simulations/${sim.id}`}>
                        <Button variant="primary" style={{ padding: '5px 10px', fontSize: '0.72rem' }}>
                          Play
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Practice Quizzes */}
            <Card
              title="Recommended Practice Quizzes"
              subtitle="Test your knowledge & gain XP"
              style={{ background: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(16px)', padding: '14px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mockQuizzes.slice(0, 2).map((quiz) => (
                  <div
                    key={quiz.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                        {quiz.title}
                      </h4>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                        {quiz.subject} • {quiz.questionsCount} Questions
                      </div>
                    </div>
                    <Link href={`/quizzes`}>
                      <Button variant="outline" style={{ padding: '5px 10px', fontSize: '0.72rem' }}>
                        Start Quiz
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
