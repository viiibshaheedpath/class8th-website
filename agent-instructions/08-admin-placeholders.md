## Acceptance Criteria

- All feature sections render.
- Mock data displays correctly.
- Cards are responsive.
- Buttons exist even if not fully functional.
- No console errors.
```

---

# File 10: `08-admin-placeholders.md`

```markdown
<!-- file: docs/agent-instructions/08-admin-placeholders.md -->

# Step 8: Admin Placeholders

## Goal

Create placeholder UI for the admin panel.

Do not connect backend yet unless instructed.

## Route

```txt
/admin
```

---

## Admin Sections

Create admin navigation:

```txt
Dashboard
Simulations
Library
Quizzes
Reading Sources
Students
Settings
```

---

## Manage Simulations

Create a table and upload form.

Table columns:

```txt
Title
Subject
Status
Created At
Actions
```

Upload form fields:

```txt
Title
Description
Subject
Thumbnail
Z Code file or embed URL
Difficulty
Status
```

Status options:

```txt
draft
published
archived
```

---

## Manage Library

Table columns:

```txt
Title
Category
File Type
Allow View
Allow Download
Status
Actions
```

Upload form fields:

```txt
Title
Description
Category
Subject
File
Allow View Toggle
Allow Download Toggle
Status
```

---

## Manage Quizzes

Table columns:

```txt
Quiz Title
Subject
Questions
Status
Actions
```

Quiz form fields:

```txt
Quiz Title
Description
Subject
Time Limit
Passing Score
Shuffle Questions
Show Explanations
Status
```

Question form fields:

```txt
Question Text
Question Type
Options
Correct Answer
Explanation
Points
Image URL
```

Question types:

```txt
mcq
true_false
short_answer
multi_select
```

---

## Manage Reading Sources

Table columns:

```txt
Source Name
Website URL
Feed URL
Category
Active
Actions
```

Form fields:

```txt
Source Name
Website URL
Feed URL
API Type
Category
Sync Frequency
Active Status
```

---

## Manage Students

Table columns:

```txt
Name
Email
Role
Joined Date
Actions
```

Actions can include:

```txt
View
Change Role
Disable
```

Be careful with privacy.
