## Acceptance Criteria

- Environment file exists.
- Supabase client file exists.
- No secrets are hardcoded.
- App still runs.
- Supabase client can be imported without errors.
```

---

# File 13: `11-auth-connection.md`

```markdown
<!-- file: docs/agent-instructions/11-auth-connection.md -->

# Step 11: Authentication Connection

## Goal

Connect login and signup forms to Supabase Auth.

---

## Required Auth Functions

Create or update:

```txt
src/lib/supabase/supabaseAuth.js
```

Functions:

```txt
signUpWithEmail
loginWithEmail
logout
getCurrentUser
getSession
```

---

## Signup Function

Example:

```js
export async function signUpWithEmail(fullName, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (error) throw error;

  return data;
}
```

---

## Login Function

Example:

```js
export async function loginWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  return data;
}
```

---

## Logout Function

Example:

```js
export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
```

---

## Current User Function

Example:

```js
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;

  return data.user;
}
```

---

## Connect Auth Page

Update auth forms:

- Login form calls `loginWithEmail`.
- Signup form calls `signUpWithEmail`.
- Show loading state.
- Show success message.
- Show error message.
- Redirect to `/dashboard` after successful login.

---

## Password Reset

Add forgot password flow if possible.

Use:

```js
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth`
});
```

---

## Protected Route Guard

Create a guard for protected pages.

Example logic:

```txt
On page load:
  Get current user.
  If no user, redirect to /auth.
  If user exists, show protected content.
```
