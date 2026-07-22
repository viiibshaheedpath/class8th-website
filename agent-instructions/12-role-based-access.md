## Acceptance Criteria

- Signup works.
- Login works.
- Logout works.
- User is redirected after login.
- Protected pages redirect unauthenticated users.
- Errors are shown clearly.
- No secrets are exposed.
```

---

# File 14: `12-role-based-access.md`

```markdown
<!-- file: docs/agent-instructions/12-role-based-access.md -->

# Step 12: Role-Based Access

## Goal

Add user roles and protect admin areas.

---

## Roles

```txt
student
admin
```

Default role:

```txt
student
```

---

## Profiles Table

The `profiles` table should store:

```txt
id
full_name
username
avatar_url
role
created_at
```

The `id` should reference `auth.users(id)`.

---

## Create Profile on Signup

Use a Supabase trigger to create a profile when a new user signs up.

Recommended profile role default:

```txt
student
```

---

## Get User Profile

Create helper:

```txt
getUserProfile(userId)
```

Example:

```js
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;

  return data;
}
```

---

## Route Protection

### Student Routes

Accessible by authenticated users:

```txt
/dashboard
/simulations
/library
/habits
/quizzes
/reading
/settings
```

### Admin Routes

Accessible only if:

```txt
profile.role === 'admin'
```

Admin routes:

```txt
/admin
/admin/simulations
/admin/library
/admin/quizzes
/admin/reading
/admin/students
```

---

## UI Behavior

If user is student:

- Hide admin panel.
- Redirect away from admin routes.

If user is admin:

- Show admin panel.
- Allow content management.

---

## Security

Do not rely only on hiding UI.

Also enforce security using Supabase Row Level Security.

Admin checks should be validated on the backend/database level.