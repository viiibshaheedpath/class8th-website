## Acceptance Criteria

- Admin can create simulation records.
- Admin can publish simulations.
- Students can see only published simulations.
- Simulation viewer opens correctly.
- Z Code embeds load safely.
- UI is responsive.
```

---

# File 16: `14-library.md`

```markdown
<!-- file: docs/agent-instructions/14-library.md -->

# Step 14: Library Module

## Goal

Build the library feature for PDFs, books, and notes.

---

## Data Model

Table:

```txt
documents
```

Fields:

```txt
id
title
description
category
subject
file_path
file_type
thumbnail_url
allow_view
allow_download
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
documents
```

Recommended visibility:

```txt
private
```

---

## Admin Features

Admin can:

- Upload document.
- Add title.
- Add description.
- Add category.
- Add subject.
- Set file type.
- Enable/disable view.
- Enable/disable download.
- Publish/unpublish document.
- Delete document.

---

## Student Features

Student can:

- View published documents.
- Search documents.
- Filter by category/subject.
- Open document viewer.
- Download document only if allowed.

---

## Document Viewing

Use secure signed URLs.

Example:

```js
const { data } = await supabase
  .storage
  .from('documents')
  .createSignedUrl(filePath, 60);
```

Use short expiration time.

---

## Download Permission

Before generating download URL:

```txt
Check document.allow_download === true
```

For download:

```js
const { data } = await supabase
  .storage
  .from('documents')
  .createSignedUrl(filePath, 60, {
    download: true
  });
```

If download is not allowed:

- Hide download button.
- Do not generate download URL.
- Do not expose direct file URL.

---

## Document Viewer

Use:

- Browser PDF viewer
- PDF.js
- Custom modal viewer
- Inline document viewer

---

## Security Notes

Downloading cannot be fully prevented if a user can view a file.

However, you should:

- Use private buckets.
- Use signed URLs.
- Use short expiration.
- Hide download options.
- Avoid public file URLs.
- Only upload content you have rights to distribute.
