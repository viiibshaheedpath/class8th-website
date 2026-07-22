'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { QuizCard } from '@/components/cards/QuizCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { mockQuizzes, Quiz } from '@/data/mockQuizzes';
import { useAuth } from '@/hooks/useAuth';
import { saveQuizResult } from '@/services/quizService';

export default function QuizzesPage() {
  const { user, profile } = useAuth();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // 10-Minute Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 mins in seconds

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (selectedQuiz && !submitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (selectedQuiz && !submitted && timeLeft === 0) {
      // Auto submit when 10 minutes expire
      handleSubmitQuiz();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [selectedQuiz, submitted, timeLeft]);

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setTimeLeft(quiz.timeLimitMinutes * 60 || 600); // Default 10 mins (600s)
  };

  const handleSelectOption = (qId: string, option: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz || !selectedQuiz.questions) return;
    let totalScore = 0;
    const maxPoints = selectedQuiz.questions.reduce((acc, q) => acc + q.points, 0) || 1;

    selectedQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        totalScore += q.points;
      }
    });

    const percentage = Math.round((totalScore / maxPoints) * 100);
    setScore(totalScore);
    setSubmitted(true);

    // Record quiz attempt to student profile & Supabase
    try {
      const activeUserId = user?.id || profile?.id || 'mock-student-1';
      await saveQuizResult({
        userId: activeUserId,
        quizId: selectedQuiz.id,
        quizTitle: selectedQuiz.title,
        score: totalScore,
        totalPoints: maxPoints,
        percentage: percentage,
        subject: selectedQuiz.subject
      });
    } catch (e) {
      console.error('Quiz result save error:', e);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout title="Adaptive Practice Quizzes">
      {/* Quiz Section Wrapper with 2.mp4 Video Background (Muted) */}
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
        {/* Muted Video Background (2.mp4) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          src="/2.mp4"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.55) contrast(1.1) saturate(0.9)',
            zIndex: 0
          }}
        />

        {/* Dark Vignette Tint Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(120% 100% at 50% 50%, rgba(5,6,14,0.45), rgba(5,6,14,0.85)), linear-gradient(180deg, rgba(5,6,14,0.65) 0%, rgba(5,6,14,0.2) 50%, rgba(5,6,14,0.8) 100%)',
            zIndex: 1
          }}
        />

        {/* Quiz Cards Content Sitting Above Video */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ marginBottom: '20px', color: '#fff' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>⚡ Tough Scholar Challenges</h2>
            <p style={{ margin: '4px 0 0 0', color: '#b6b2cc', fontSize: '13.5px' }}>
              10 Tough Questions per topic · Strict 10-Minute Timer · Deep Concept Explanations
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            {mockQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onStart={handleStartQuiz} />
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Modal Player */}
      {selectedQuiz && (
        <Modal
          isOpen={!!selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
          title={`${selectedQuiz.title} (${selectedQuiz.subject})`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header Timer Bar */}
            {!submitted && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(168,85,247,0.12)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  padding: '10px 16px',
                  borderRadius: '12px'
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#e9d5ff' }}>
                  🔥 Difficulty: Tough / Advanced (10 Questions)
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: timeLeft < 120 ? '#f87171' : '#34d399',
                    fontFamily: 'monospace'
                  }}
                >
                  ⏱ Time Left: {formatTimer(timeLeft)}
                </span>
              </div>
            )}

            {submitted ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(168,85,247,0.15))',
                    border: '1px solid rgba(52,211,153,0.3)',
                    borderRadius: '16px'
                  }}
                >
                  <span style={{ fontSize: '3rem', display: 'block' }}>🎉</span>
                  <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.4rem' }}>
                    Quiz Completed!
                  </h3>
                  <p style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#34d399' }}>
                    Score: {score} / {selectedQuiz.questions?.reduce((acc, q) => acc + q.points, 0) || 0} pts
                    ({Math.round((score / (selectedQuiz.questions?.reduce((acc, q) => acc + q.points, 0) || 1)) * 100)}%)
                  </p>
                </div>

                <h4 style={{ margin: '10px 0 0 0', color: '#fff', fontSize: '1.1rem' }}>
                  Detailed Answers &amp; Step-by-Step Explanations:
                </h4>

                {selectedQuiz.questions?.map((q, qIdx) => {
                  const userAns = selectedAnswers[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div
                      key={q.id}
                      style={{
                        background: isCorrect ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)',
                        border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`,
                        borderRadius: '12px',
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '13px' }}>
                        <span style={{ color: '#fff' }}>
                          Q{qIdx + 1}: {q.questionText}
                        </span>
                        <span style={{ color: isCorrect ? '#34d399' : '#f87171' }}>
                          {isCorrect ? '✓ Correct (+2 pts)' : '✗ Incorrect'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#b6b2cc' }}>
                        Your answer: <b style={{ color: isCorrect ? '#34d399' : '#f87171' }}>{userAns || 'Not Answered'}</b>
                      </div>
                      {!isCorrect && (
                        <div style={{ fontSize: '12.5px', color: '#34d399' }}>
                          Correct answer: <b>{q.correctAnswer}</b>
                        </div>
                      )}
                      {q.explanation && (
                        <div style={{ fontSize: '12px', color: '#e9d5ff', background: 'rgba(255,255,255,0.04)', padding: '8px 10px', borderRadius: '8px', marginTop: '4px' }}>
                          💡 <b>Explanation:</b> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              selectedQuiz.questions?.map((q, qIdx) => (
                <div
                  key={q.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: '#fff' }}>
                    Q{qIdx + 1}: {q.questionText} <span style={{ color: '#a855f7', fontSize: '12px' }}>({q.points} pts)</span>
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {q.options.map((opt) => {
                      const isSelected = selectedAnswers[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt)}
                          style={{
                            textAlign: 'left',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            background: isSelected ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(255,255,255,0.05)',
                            border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.12)',
                            color: '#fff',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <Button variant="secondary" onClick={() => setSelectedQuiz(null)}>
                {submitted ? 'Close' : 'Cancel'}
              </Button>
              {!submitted && (
                <Button variant="primary" onClick={handleSubmitQuiz}>
                  Submit 10 Answers
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
