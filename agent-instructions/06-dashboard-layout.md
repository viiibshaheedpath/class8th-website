## Acceptance Criteria

- Auth page renders.
- Login and signup tabs switch correctly.
- Form validation works.
- UI is responsive.
- No backend connection is required yet.
```

---

# File 8: `06-dashboard-layout.md`

```markdown
<!-- file: docs/agent-instructions/06-dashboard-layout.md -->

# Step 6: Dashboard Layout

## Goal

Create the main authenticated student dashboard layout.

## Route

```txt
/dashboard
```

---

## Layout Structure

The dashboard should include:

- Sidebar navigation
- Top bar
- Main content area
- Responsive mobile navigation

---

## Sidebar Menu

Create sidebar links:

```txt
Overview
Simulations
Library
Habit Tracker
Quizzes
Reading
Settings
```

Admin users should later see:

```txt
Admin Panel
```

---

## Top Bar

Top bar should include:

- Page title
- Search box, optional
- Notification icon, optional
- User avatar/menu
- Logout button

---

## Dashboard Overview

The overview page should show placeholder cards:

```txt
Study Streak
Today's Tasks
Completed Quizzes
Articles Read
Recent Simulations
Recommended Quizzes
```

Use mock data.

---

## Responsive Behavior

### Desktop

- Fixed sidebar
- Content area on right

### Tablet

- Collapsible sidebar

### Mobile

- Hidden sidebar
- Hamburger menu or bottom navigation

---

## Protected Route Placeholder

Prepare the dashboard for authentication protection.

For now, you may use a simple placeholder guard:

```txt
If no user, redirect to /auth.
```

Full Supabase auth connection happens later.