## Acceptance Criteria

- User profile is fetched after login.
- Role is available in app state.
- Admin links appear only for admin users.
- Non-admin users cannot access admin routes.
- UI remains stable if role is missing.
```

---

# File 15: `13-simulations.md`

```markdown
<!-- file: docs/agent-instructions/13-simulations.md -->

# Step 13: Simulations Module

## Goal

Build the simulations feature.

---

## Data Model

Table:

```txt
simulations
```

Fields:

```txt
id
title
description
subject
thumbnail_url
file_path
embed_url
difficulty
status
created_by
created_at
```

Status values:

```txt
draft
published
archived
```

---

## Storage Bucket

Create Supabase Storage bucket:

```txt
simulations
```

Recommended visibility:

```txt
private
```

Use signed URLs for protected simulation files.

---

## Admin Features

Admin can:

- Add simulation.
- Edit simulation.
- Delete simulation.
- Upload simulation file.
- Add Z Code embed URL.
- Upload thumbnail.
- Set status.
- Publish/unpublish simulation.

---

## Student Features

Student can:

- View published simulations.
- Search simulations.
- Filter by subject.
- Open simulation viewer.
- View simulation details.

---

## Simulation Viewer

Use a secure viewer.

If using iframe:

```html
<iframe
  src="SIMULATION_URL"
  title="Simulation"
  sandbox="allow-scripts"
  loading="lazy"
></iframe>
```

If simulation requires more permissions, add only what is necessary.

Avoid using unsafe permissions unless required.

---

## Security Rules

- Students can only view published simulations.
- Admin can manage all simulations.
- Simulation files should not be publicly exposed if private.
- Use signed URLs when needed.
- Validate uploaded file types.