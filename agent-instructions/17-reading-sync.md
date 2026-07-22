## Acceptance Criteria

- Admin can create quizzes.
- Admin can add questions.
- Students can attempt quizzes.
- Score is calculated correctly.
- Attempts are saved.
- Explanations show only when enabled.
- UI is responsive.
```

---

# File 19: `17-reading-sync.md`

```markdown
<!-- file: docs/agent-instructions/17-reading-sync.md -->

# Step 17: Reading Sync Module

## Goal

Build the reading section with synced articles.

---

## Important Legal Rule

Only sync articles from websites that allow:

- RSS feeds
- Atom feeds
- Official APIs
- Explicit content syndication permission

Do not:

- Bypass paywalls.
- Scrape copyrighted articles without permission.
- Violate website terms of service.
- Remove source attribution.

---

## Data Model

### Table: reading_sources

Fields:

```txt
id
name
website_url
feed_url
api_type
category
sync_frequency_minutes
is_active
created_by
created_at
```

---

### Table: reading_articles

Fields:

```txt
id
source_id
external_id
title
author
article_url
image_url
summary
content_html
published_at
synced_at
status
```

---

### Table: reading_progress

Fields:

```txt
id
user_id
article_id
progress_percent
completed
updated_at
```

---

## Admin Features

Admin can:

- Add reading source.
- Edit source.
- Delete source.
- Enable/disable source.
- Trigger manual sync.
- Review synced articles.
- Hide unwanted articles.

---

## Student Features

Student can:

- Browse articles.
- Search articles.
- Filter by category/source.
- Read article inside app.
- See original source link.
- Mark article as read.
- Track reading progress.

---

## Sync Logic

Use Supabase Edge Function or secure backend job.

Basic flow:

```txt
1. Fetch active reading sources.
2. Fetch RSS/API data.
3. Parse articles.
4. Check external_id to avoid duplicates.
5. Insert new articles.
6. Sanitize HTML content.
7. Display articles in reading section.
```

---

## Article Reader

Reader should include:

- Article title
- Source name
- Author
- Published date
- Featured image
- Clean article body
- Original source link
- Font size control
- Dark/light mode support
- Reading progress bar

---

## Security

- Sanitize HTML before rendering.
- Remove scripts.
- Remove unsafe attributes.
- Open external links with `rel="noopener"`.
- Store only permitted content.

---
