'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { mockQuizzes, Quiz } from '@/data/mockQuizzes';

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [timeLimit, setTimeLimit] = useState('15');
  const [passingScore, setPassingScore] = useState('70');
  
  // Question builder fields
  const [qType, setQType] = useState<'mcq' | 'true_false' | 'short_answer' | 'multi_select'>('mcq');
  const [qText, setQText] = useState('');
  const [qPoints, setQPoints] = useState('10');

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;
    const newQuiz: Quiz = {
      id: Math.random().toString(),
      title: quizTitle,
      subject,
      description: 'Practice quiz configured by admin',
      timeLimitMinutes: parseInt(timeLimit) || 15,
      passingScore: parseInt(passingScore) || 70,
      shuffleQuestions: true,
      showExplanations: true,
      status: 'published',
      questionsCount: 1,
      questions: [
        {
          id: 'q1',
          questionText: qText || 'Sample Question',
          questionType: qType,
          options: qType === 'true_false' ? ['True', 'False'] : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: qType === 'true_false' ? 'True' : 'Option A',
          points: parseInt(qPoints) || 10
        }
      ]
    };
    setQuizzes([newQuiz, ...quizzes]);
    setIsModalOpen(false);
    setQuizTitle('');
    setQText('');
  };

  return (
    <AdminLayout title="Manage Quizzes & Questions">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Adaptive Quiz Pool</h2>
          <p style={{ fontSize: '0.875rem' }}>Configure test duration, passing thresholds, and question types.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Build New Quiz
        </Button>
      </div>

      {/* Admin Data Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Subject</th>
              <th>Questions</th>
              <th>Time Limit</th>
              <th>Passing Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td style={{ fontWeight: 600 }}>{quiz.title}</td>
                <td><Badge variant="primary">{quiz.subject}</Badge></td>
                <td>{quiz.questionsCount} Qs</td>
                <td>{quiz.timeLimitMinutes} Mins</td>
                <td>{quiz.passingScore}%</td>
                <td><Badge variant="success">Active</Badge></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Edit Pool</Button>
                    <Button variant="ghost" style={{ padding: '4px 10px', fontSize: '0.8rem', color: 'var(--color-danger)' }}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quiz & Question Builder Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Quiz & Add Questions">
          <form onSubmit={handleCreateQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input label="Quiz Title" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} required placeholder="e.g. Linear Equations Chapter Quiz" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <Select
                label="Subject"
                options={[
                  { value: 'Mathematics', label: 'Mathematics' },
                  { value: 'Physics', label: 'Physics' },
                  { value: 'Chemistry', label: 'Chemistry' }
                ]}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Input label="Time Limit (mins)" type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} />
              <Input label="Pass Score (%)" type="number" value={passingScore} onChange={(e) => setPassingScore(e.target.value)} />
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '4px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px' }}>Add Initial Question</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <Select
                  label="Question Type"
                  options={[
                    { value: 'mcq', label: 'Multiple Choice (MCQ)' },
                    { value: 'true_false', label: 'True / False' },
                    { value: 'short_answer', label: 'Short Answer' },
                    { value: 'multi_select', label: 'Multi-Select Checkbox' }
                  ]}
                  value={qType}
                  onChange={(e) => setQType(e.target.value as any)}
                />
                <Input label="Points" type="number" value={qPoints} onChange={(e) => setQPoints(e.target.value)} />
              </div>

              <Textarea label="Question Text" value={qText} onChange={(e) => setQText(e.target.value)} placeholder="Type question prompt here..." />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Save Quiz</Button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
