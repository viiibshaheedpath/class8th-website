import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Quiz } from '@/data/mockQuizzes';

interface QuizCardProps {
  quiz: Quiz;
  onStart?: (quiz: Quiz) => void;
}

export function QuizCard({ quiz, onStart }: QuizCardProps) {
  return (
    <Card className="quiz-card">
      <div className="quiz-card-header">
        <span className="quiz-icon">📝</span>
        <Badge variant="primary">{quiz.subject}</Badge>
      </div>
      <div className="quiz-card-body">
        <h3 className="quiz-title">{quiz.title}</h3>
        <p className="quiz-desc">{quiz.description}</p>
        
        <div className="quiz-details">
          <span className="detail-item">❓ {quiz.questionsCount} Questions</span>
          <span className="detail-item">⏱️ {quiz.timeLimitMinutes} Mins</span>
          <span className="detail-item">🎯 Pass: {quiz.passingScore}%</span>
        </div>

        <Button 
          variant="primary" 
          style={{ width: '100%', marginTop: 'auto' }}
          onClick={() => onStart && onStart(quiz)}
        >
          Start Practice Quiz
        </Button>
      </div>
    </Card>
  );
}
