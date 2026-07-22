## Acceptance Criteria

- Home page renders correctly.
- Navbar works.
- Buttons link to `/auth`.
- Page is responsive.
- No console errors.
```

---

# File 7: `05-auth-page-ui.md`

```markdown
<!-- file: docs/agent-instructions/05-auth-page-ui.md -->

# Step 5: Authentication Page UI

## Goal

Create the authentication page UI.

Do not connect Supabase yet unless instructed.

## Route

```txt
/auth
```

---

## Page Layout

The auth page should have:

- Centered card
- Logo
- Tabs for Login and Signup
- Animated tab switching
- Form validation
- Forgot password link
- Helpful error messages

---

## Login Form

Fields:

```txt
Email
Password
```

Actions:

```txt
Login button
Forgot password link
```

---

## Signup Form

Fields:

```txt
Full Name
Email
Password
Confirm Password
```

Actions:

```txt
Signup button
```

Optional:

```txt
Terms and privacy checkbox
```

---

## Validation Rules

### Email

- Required
- Must be valid email format

### Password

- Required
- Minimum 6 characters recommended

### Confirm Password

- Must match password

### Full Name

- Required for signup

---

## UI States

Forms should support:

```txt
idle
loading
success
error
```

Show appropriate messages.

Example success message:

```txt
Account created. Please check your email to confirm your account.
```

Example error message:

```txt
Invalid email or password.
```

---

## Animation

Add subtle animation:

- Fade in page
- Slide tab indicator
- Fade/slide tab content
- Button loading spinner
