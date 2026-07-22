## Acceptance Criteria

The agent is ready for the next step when:

- The project goal is understood.
- User roles are clear.
- Main pages are identified.
- Main routes are identified.
- No code has been broken.
```

---

# File 4: `02-folder-structure.md`

```markdown
<!-- file: docs/agent-instructions/02-folder-structure.md -->

# Step 2: Folder Structure

## Goal

Create a clean and scalable project folder structure.

## Required Main Folders

Create these 12 main folders:

```txt
public/
src/app/
src/components/
src/features/
src/layouts/
src/lib/
src/hooks/
src/styles/
src/types/
src/utils/
src/data/
supabase/
```

If the project does not use `src/`, create:

```txt
public/
app/
components/
features/
layouts/
lib/
hooks/
styles/
types/
utils/
data/
supabase/
```

---

## Recommended Subfolders

Inside `src/components/`, create:

```txt
ui/
navbar/
sidebar/
cards/
modals/
animations/
```

Inside `src/features/`, create:

```txt
auth/
dashboard/
simulations/
library/
habits/
quizzes/
reading/
admin/
```

Inside `src/lib/`, create:

```txt
supabase/
```

Inside `supabase/`, create:

```txt
migrations/
functions/
```

Inside `public/`, create:

```txt
icons/
images/
simulations/
```

---

## Placeholder Files

Create placeholder files where useful.

Examples:

```txt
src/components/ui/Button.jsx
src/components/ui/Input.jsx
src/components/ui/Card.jsx
src/components/ui/Tabs.jsx
src/components/ui/Modal.jsx
src/components/ui/Loader.jsx
src/components/ui/ProgressBar.jsx
src/components/ui/EmptyState.jsx

src/layouts/PublicLayout.jsx
src/layouts/AuthLayout.jsx
src/layouts/DashboardLayout.jsx
src/layouts/AdminLayout.jsx

src/data/mockSimulations.js
src/data/mockDocuments.js
src/data/mockQuizzes.js
src/data/mockArticles.js
src/data/mockSchedule.js

src/lib/supabase/supabaseClient.js

src/styles/globals.css
src/styles/animations.css
```

If using TypeScript, use `.tsx` and `.ts` instead of `.jsx` and `.js`.

