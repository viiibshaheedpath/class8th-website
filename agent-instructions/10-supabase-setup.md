## Acceptance Criteria

- Scroll animations work.
- Tab transitions work.
- Hover effects work.
- Animations are smooth.
- Reduced motion is respected.
- No layout breaking.
```

---

# File 12: `10-supabase-setup.md`

```markdown
<!-- file: docs/agent-instructions/10-supabase-setup.md -->

# Step 10: Supabase Setup

## Goal

Prepare Supabase integration safely.

Do not hardcode secrets.

---

## Environment Variables

Create:

```txt
.env.local
```

Add:

```txt
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If the project uses a different framework, use equivalent environment variable names.

---

## Supabase Client

Create:

```txt
src/lib/supabase/supabaseClient.js
```

Example:

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

If using TypeScript:

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Helper Files

Create:

```txt
src/lib/supabase/supabaseAuth.js
src/lib/supabase/supabaseStorage.js
src/lib/supabase/supabaseQueries.js
```

These files will later contain:

- Auth functions
- Storage functions
- Database query functions

---

## Data Model Overview

The app will need these tables:

```txt
profiles
simulations
documents
study_schedules
habit_logs
quizzes
questions
quiz_attempts
reading_sources
reading_articles
reading_progress
```

Do not fully implement all tables yet unless instructed.

---

## Security Rule

Frontend must only use anon key.

Service role key must only be used in:

```txt
supabase/functions/
```

or another secure backend environment.