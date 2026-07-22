## Acceptance Criteria

- Student can create schedule.
- Schedule saves to backend.
- Student can mark daily progress.
- Progress saves correctly.
- Streak displays correctly.
- User cannot access another user's habit data.
```

---

# File 18: `16-quizzes.md`

```markdown
<!-- file: docs/agent-instructions/16-quizzes.md -->

# Step 16: Quiz Module

## Goal

Build the quiz system.

---

## Data Model

### Table: quizzes

Fields:

```txt
id
title
description
subject
time_limit_minutes
passing_score
shuffle_questions
show_explanations
status
created_by
created_at
```

Status:

```txt
draft
published
archived
```

---

### Table: questions

Fields:

```txt
id
quiz_id
question_text
question_type
options
correct_answer
explanation
points
image_url
created_at
```

Question types:

```txt
mcq
true_false
short_answer
multi_select
```

---

### Table: quiz_attempts

Fields:

```txt
id
quiz_id
user_id
answers
score
total_points
started_at
submitted_at
```

---

## Admin Features

Admin can:

- Create quiz.
- Edit quiz.
- Delete quiz.
- Add questions.
- Edit questions.
- Delete questions.
- Publish quiz.
- View attempts.

---

## Student Features

Student can:

- View published quizzes.
- Start quiz.
- Answer questions.
- Submit quiz.
- See score.
- See explanations if enabled.
- View past attempts.

---

## Quiz Flow

```txt
1. Student selects quiz.
2. App loads published questions.
3. Student answers questions.
4. Student submits quiz.
5. Score is calculated.
6. Attempt is saved.
7. Result is shown.
```

---

## Scoring Logic

For each question:

```txt
If answer is correct, add points.
If answer is incorrect, add zero.
```

Store:

```txt
score
total_points
```

Example:

```txt
Score: 8
Total Points: 10
Percentage: 80%
```

---

## Security

- Students can only see published quizzes.
- Students can only see questions for published quizzes.
- Students can only view their own attempts.
- Admin can manage all quizzes.
- Correct answers should not be exposed before submission unless intended.

---
