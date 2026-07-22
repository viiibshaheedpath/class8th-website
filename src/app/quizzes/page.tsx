'use client';

import React, { useState } from 'react';
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

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const handleSelectOption = (qId: string, option: string) => {
    if (submitted) return;
    setSelectedAnswers({ ...selectedAnswers, [qId]: option });
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
          title={selectedQuiz.title}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {submitted ? (
              <div
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  background: 'var(--color-success-bg)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <span style={{ fontSize: '3rem', display: 'block' }}>🎉</span>
                <h3 style={{ color: 'var(--color-success)', marginBottom: '8px' }}>Quiz Completed!</h3>
                <p style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                  Score: {score} / {selectedQuiz.questions?.reduce((acc, q) => acc + q.points, 0) || 0}
                </p>
              </div>
            ) : (
              selectedQuiz.questions?.map((q, qIdx) => (
                <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    Q{qIdx + 1}: {q.questionText} ({q.points} pts)
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption(q.id, opt)}
                        className={`btn ${selectedAnswers[q.id] === opt ? 'btn-primary' : 'btn-outline'}`}
                        style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                      >
                        {opt}
                      </button>
                    ))}
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
                  Submit Answers
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
