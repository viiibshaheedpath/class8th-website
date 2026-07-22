## Acceptance Criteria

- Admin layout renders.
- Admin navigation works.
- Placeholder tables render.
- Placeholder forms render.
- UI is responsive.
- No backend connection required yet.
```

---

# File 11: `09-animation-system.md`

```markdown
<!-- file: docs/agent-instructions/09-animation-system.md -->

# Step 9: Animation System

## Goal

Add a smooth animation system across the app.

## Animation Principles

Animations should be:

- Smooth
- Fast
- Purposeful
- Non-distracting
- Accessible
- Performant

---

## Required Animations

### 1. Scroll Reveal

Animate elements when they enter the viewport.

Examples:

```txt
fade-up
fade-in
slide-left
slide-right
scale-in
```

Use for:

- Feature cards
- Dashboard cards
- Article cards
- Simulation cards
- Sections on landing page

---

### 2. Tab Switching

When switching tabs:

```txt
fade content
slide content
animate active underline
```

Use for:

- Auth page tabs
- Dashboard tabs
- Admin panel tabs

---

### 3. Page Transitions

Use subtle transitions between pages:

```txt
fade
slide
scale
```

Avoid long delays.

Recommended duration:

```txt
250ms to 500ms
```

---

### 4. Hover Effects

Use hover effects for:

- Buttons
- Cards
- Links
- Navigation items

Examples:

```txt
scale: 1.02
shadow increase
border glow
background change
```

---

### 5. Progress Animations

Animate:

- Progress bars
- Streak counters
- Quiz score reveal
- Habit completion checkmarks

---

### 6. Modal Animations

Modals should:

```txt
fade in background
scale in panel
fade out on close
```

---

## Reduced Motion

Respect user preference:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Performance Rules

Prefer animating:

```txt
opacity
transform
```

Avoid animating:

```txt
width
height
top
left
margin
padding
```

Use lazy loading for heavy components.
