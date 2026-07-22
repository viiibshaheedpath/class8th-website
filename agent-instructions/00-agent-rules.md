```markdown
<!-- file: docs/agent-instructions/README.md -->

# Agent Instructions: Student Learning Platform

This folder contains step-by-step instructions for building the Student Learning Platform using:

- Antigravity for the frontend/UI
- Z Code for interactive simulations
- Supabase for authentication, database, storage, and backend logic

## How the Agent Should Use These Files

The agent must follow the instruction files in order.

Do not skip steps unless the user explicitly says to skip.

## Instruction Order

1. `00-agent-rules.md`
2. `01-project-overview.md`
3. `02-folder-structure.md`
4. `03-design-system.md`
5. `04-public-pages.md`
6. `05-auth-page-ui.md`
7. `06-dashboard-layout.md`
8. `07-feature-placeholders.md`
9. `08-admin-placeholders.md`
10. `09-animation-system.md`
11. `10-supabase-setup.md`
12. `11-auth-connection.md`
13. `12-role-based-access.md`
14. `13-simulations.md`
15. `14-library.md`
16. `15-habit-tracker.md`
17. `16-quizzes.md`
18. `17-reading-sync.md`
19. `18-testing-and-launch.md`

## Important Rule

Each step must be completed and verified before moving to the next step.

If a step fails, the agent should stop, explain the issue, and suggest a fix.
```
Examples:

```txt
src/data/mockSimulations.js
src/data/mockDocuments.js
src/data/mockQuizzes.js
src/data/mockArticles.js
src/data/mockSchedule.js
```


### 4. Do Not Expose Secrets

Never hardcode Supabase secret keys.

Frontend may only use:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Never use Supabase service role key in frontend code.

Service role keys may only be used inside secure backend functions such as Supabase Edge Functions.


### 5. Use Secure Defaults

- Enable Supabase Row Level Security on all tables.
- Protect admin routes.
- Protect student data.
- Use signed URLs for private files.
- Validate file types before upload.
- Sanitize HTML content before rendering.
- Use sandboxed iframes for external simulations when possible.


### 6. Keep UI Responsive

Every page must work on:

- Mobile
- Tablet
- Desktop

Use responsive spacing, flexible grids, and accessible form controls.


### 7. Keep Animations Smooth

Animations should be subtle and performant.

Use animations for:

- Scroll reveal
- Tab switching
- Page transitions
- Hover states
- Modal open/close
- Progress indicators

Avoid heavy animations that block interaction.

Support reduced motion preferences.

### 8. Ask When Uncertain

If required information is missing, stop and ask the user.

Examples:

- Missing Supabase environment variables
- Missing Z Code embed format
- Missing file upload requirements
- Missing article sync permissions
- Missing design preferences

