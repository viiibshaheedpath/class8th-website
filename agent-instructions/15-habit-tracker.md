## Acceptance Criteria

- Admin can upload documents.
- Students can view allowed documents.
- Download button appears only when allowed.
- Signed URLs are used.
- Private files are not publicly exposed.
- Document viewer works.
```

---

# File 17: `15-habit-tracker.md`

```markdown
<!-- file: docs/agent-instructions/15-habit-tracker.md -->

# Step 15: Habit Tracker Module

## Goal

Build the habit tracker and study schedule system.

---

## Data Model

### Table: study_schedules

Fields:

```txt
id
user_id
title
schedule_data
start_date
end_date
is_active
created_at
```

`schedule_data` should be JSON.

Example:

```json
{
  "subjects": [
    {
      "name": "Physics",
      "sessions": [
        {
          "day": "Monday",
          "start_time": "17:00",
          "end_time": "18:00",
          "goal": "Revise mechanics"
        }
      ]
    }
  ]
}
```

---

### Table: habit_logs

Fields:

```txt
id
user_id
schedule_id
log_date
completed_items
total_minutes
completion_percent
notes
created_at
```

Example `completed_items`:

```json
{
  "completed": ["Physics"],
  "partial": ["Mathematics"],
  "missed": ["English"]
}
```

---

## Student Features

Student can:

- Create study schedule.
- Upload schedule.
- Edit schedule.
- View daily tasks.
- Mark tasks complete.
- Add notes.
- View streak.
- View weekly progress.
- View completion percentage.

---

## Schedule Form Fields

```txt
Subject
Day
Start Time
End Time
Goal
```

Allow multiple subjects and sessions.

---

## Habit Tracking Logic

For each day:

```txt
Calculate completed tasks.
Calculate partial tasks.
Calculate missed tasks.
Calculate completion percent.
Save log to habit_logs.
```

---

## Streak Logic

Basic streak rule:

```txt
If completion_percent > 0 for a day, count day as active.
If a full day is missed, reset streak.
```

More advanced rule:

```txt
If completion_percent >= 100, mark day as perfect.
```

---

## UI Components

Create:

```txt
ScheduleForm
DailyChecklist
WeeklyCalendar
StreakCounter
ProgressBar
HabitSummaryCard
```

---

## Security

Students can only access their own schedules and logs.

Use Supabase RLS:

```txt
user_id = auth.uid()
```
