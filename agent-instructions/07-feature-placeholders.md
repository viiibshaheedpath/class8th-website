## Acceptance Criteria

- Dashboard layout renders.
- Sidebar navigation works.
- Top bar appears.
- Placeholder overview cards appear.
- Layout is responsive.
- No console errors.
```

---

# File 9: `07-feature-placeholders.md`

```markdown
<!-- file: docs/agent-instructions/07-feature-placeholders.md -->

# Step 7: Feature Placeholders

## Goal

Create placeholder UI for all major student features.

Use mock data only.

Do not connect Supabase yet unless instructed.

---

## Features to Create

### 1. Simulations

Route or tab:

```txt
/simulations
```

UI:

- Grid of simulation cards
- Simulation thumbnail
- Title
- Subject
- Description
- Open button

Create component:

```txt
SimulationCard
```

Use mock data from:

```txt
src/data/mockSimulations.js
```

---

### 2. Library

Route or tab:

```txt
/library
```

UI:

- Grid of document cards
- Document icon/thumbnail
- Title
- Category
- File type
- View button
- Download button

Create component:

```txt
DocumentCard
```

Use mock data from:

```txt
src/data/mockDocuments.js
```

Download button can be conditionally shown:

```txt
allow_download === true
```

---

### 3. Habit Tracker

Route or tab:

```txt
/habits
```

UI:

- Study schedule form
- Daily checklist
- Weekly view
- Progress bar
- Streak counter

Create components:

```txt
ScheduleForm
HabitChecklist
StreakCounter
ProgressSummary
```

Use mock data from:

```txt
src/data/mockSchedule.js
```

---

### 4. Quizzes

Route or tab:

```txt
/quizzes
```

UI:

- Grid of quiz cards
- Quiz title
- Subject
- Number of questions
- Time limit
- Start button

Create component:

```txt
QuizCard
```

Use mock data from:

```txt
src/data/mockQuizzes.js
```

---

### 5. Reading

Route or tab:

```txt
/reading
```

UI:

- Grid of article cards
- Article image
- Title
- Source
- Published date
- Read button

Create component:

```txt
ArticleCard
```

Use mock data from:

```txt
src/data/mockArticles.js
```

Article reader can be a modal placeholder.
