## Acceptance Criteria

- Admin can add sources.
- Sync function fetches articles safely.
- Duplicate articles are avoided.
- Articles display inside app.
- Original source is credited.
- HTML is sanitized.
- Reading progress can be saved.
```

---

# File 20: `18-testing-and-launch.md`

```markdown
<!-- file: docs/agent-instructions/18-testing-and-launch.md -->

# Step 18: Testing and Launch

## Goal

Test the full platform before launch.

---

## Authentication Tests

Check:

```txt
[ ] Signup works
[ ] Login works
[ ] Logout works
[ ] Password reset works
[ ] Email confirmation works if enabled
[ ] Session persists correctly
[ ] Protected routes redirect unauthenticated users
```

---

## Role Tests

Check:

```txt
[ ] Student role is assigned by default
[ ] Admin role can access admin panel
[ ] Student cannot access admin panel
[ ] Admin UI appears only for admin users
[ ] Backend policies enforce roles
```

---

## Simulations Tests

Check:

```txt
[ ] Admin can upload simulation
[ ] Admin can publish simulation
[ ] Student can view published simulation
[ ] Draft simulations are hidden from students
[ ] Simulation viewer loads safely
[ ] Z Code embed works
```

---

## Library Tests

Check:

```txt
[ ] Admin can upload document
[ ] Student can view allowed document
[ ] Download button appears only when allowed
[ ] Signed URLs expire correctly
[ ] Private files are not publicly accessible
[ ] Document viewer works
```

---

## Habit Tracker Tests

Check:

```txt
[ ] Student can create schedule
[ ] Schedule saves correctly
[ ] Daily progress saves correctly
[ ] Completion percent calculates correctly
[ ] Streak calculates correctly
[ ] Student cannot access another student's data
```

---

## Quiz Tests

Check:

```txt
[ ] Admin can create quiz
[ ] Admin can add questions
[ ] Student can start quiz
[ ] Student can submit quiz
[ ] Score calculates correctly
[ ] Attempt saves correctly
[ ] Explanations show only when enabled
[ ] Draft quizzes are hidden from students
```

---

## Reading Tests

Check:

```txt
[ ] Admin can add source
[ ] Sync fetches articles
[ ] Duplicate articles are prevented
[ ] Articles display correctly
[ ] HTML is sanitized
[ ] Original source link works
[ ] Reading progress saves
```

---

## Animation Tests

Check:

```txt
[ ] Scroll animations work
[ ] Tab transitions work
[ ] Page transitions work
[ ] Hover effects work
[ ] Animations do not block interaction
[ ] Reduced motion is respected
```

---

## Responsive Tests

Check:

```txt
[ ] Mobile layout works
[ ] Tablet layout works
[ ] Desktop layout works
[ ] Sidebar collapses correctly
[ ] Forms are usable on mobile
[ ] Modals are usable on mobile
```

---

## Security Tests

Check:

```txt
[ ] Supabase RLS is enabled
[ ] No secrets are exposed
[ ] Admin routes are protected
[ ] Private storage is protected
[ ] Signed URLs are used
[ ] HTML content is sanitized
[ ] File uploads are validated
```

---

## Performance Tests

Check:

```txt
[ ] Pages load quickly
[ ] Images are optimized
[ ] Heavy components are lazy loaded
[ ] Animations are smooth
[ ] No unnecessary re-renders
[ ] Database queries are efficient
```

---

## Final Launch Checklist

```txt
[ ] All core features work
[ ] No console errors
[ ] No broken links
[ ] Environment variables are configured
[ ] Supabase policies are active
[ ] Storage buckets are configured
[ ] Admin account is created
[ ] Test student account is created
[ ] Backup database if possible
[ ] Deploy frontend
[ ] Verify production environment variables
[ ] Test production login
[ ] Test production uploads
```

---

## Completion Rule

The project is ready for launch only when all critical tests pass.

If any critical test fails:

```txt
Stop.
Report the issue.
Fix the issue.
Retest.
```
```

---

# How to Use These Files With Your Agent

You can tell your agent:

```txt
Read all files inside docs/agent-instructions/ in order.
Start with 00-agent-rules.md.
Complete each step one by one.
Do not move to the next step until the current step passes its acceptance criteria.
If something is missing or unclear, stop and ask me.
```

If your agent only accepts one prompt at a time, give the files in this order:

```txt
00-agent-rules.md
01-project-overview.md
02-folder-structure.md
03-design-system.md
04-public-pages.md
05-auth-page-ui.md
06-dashboard-layout.md
07-feature-placeholders.md
08-admin-placeholders.md
09-animation-system.md
10-supabase-setup.md
11-auth-connection.md
12-role-based-access.md
13-simulations.md
14-library.md
15-habit-tracker.md
16-quizzes.md
17-reading-sync.md
18-testing-and-launch.md
```
