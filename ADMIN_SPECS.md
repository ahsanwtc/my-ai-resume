# Admin Panel Specifications

## Overview
Simple admin interface for managing portfolio content with Supabase authentication.

## Authentication
- **Provider**: Supabase Auth
- **Method**: Email/Password (magic link optional)
- **Protected Routes**: All `/admin/*` routes require authentication
- **Session Management**: Server-side session validation

## Routes Structure
```
/admin/login          - Login page
/admin/dashboard      - Overview/home
/admin/profile        - Edit profile information
/admin/experiences    - Manage experiences (CRUD + reorder)
/admin/skills         - Manage skills (CRUD + reorder)
/admin/faq            - Manage FAQ responses
```

## Design System
- **Reuse existing design**: Same colors, typography, components
- **Layout**: Simple sidebar navigation + main content area
- **Forms**: Clean, minimal styling matching main site
- **Feedback**: Toast notifications for success/error states

## Features by Section

### 1. Login Page (`/admin/login`)
- Email input
- Password input
- "Sign In" button
- Error message display
- Redirect to dashboard on success

### 2. Dashboard (`/admin/dashboard`)
- Quick stats (# experiences, # skills, last updated)
- Quick links to edit sections
- Logout button

### 3. Profile Editor (`/admin/profile`)
**Fields:**
- Name (text)
- Short Name (text)
- Tagline (text)
- Title (text)
- Subtitle (text)
- Target Titles (array - add/remove text inputs)
- Target Company Stages (array - add/remove text inputs)
- Location (text)
- Remote Preference (text)
- GitHub URL (text)
- LinkedIn URL (text)
- Twitter URL (text)

**Actions:**
- Save button
- Cancel button

### 4. Experiences Manager (`/admin/experiences`)
**List View:**
- Display all experiences in order
- Drag handle for reordering
- Edit button
- Delete button (with confirmation)
- "Add New Experience" button

**Edit/Create Form:**
- Company Name (text)
- Title (text)
- Title Progression (text, optional)
- Team (text, optional)
- Start Date (date picker)
- End Date (date picker, optional)
- Is Current (checkbox)
- Bullet Points (array - add/remove textareas)
- Display Order (number, auto-managed by drag-drop)

**AI Context Fields (not public):**
- Why Joined (textarea)
- Why Left (textarea)
- Actual Contributions (textarea)
- Proudest Achievement (textarea)
- Would Do Differently (textarea)
- Challenges Faced (textarea)
- Lessons Learned (textarea)
- Manager Would Say (textarea)
- Reports Would Say (textarea)

**Actions:**
- Save
- Cancel
- Delete

### 5. Skills Manager (`/admin/skills`)
**List View:**
- Three columns: Strong / Moderate / Gaps
- Drag-drop between columns to change category
- Drag-drop within column to reorder
- Edit button
- Delete button
- "Add New Skill" button

**Edit/Create Form:**
- Skill Name (text)
- Category (dropdown: strong/moderate/gap)
- Display Order (auto-managed)

**Actions:**
- Save
- Cancel
- Delete

### 6. FAQ Manager (`/admin/faq`)
**List View:**
- Display all FAQ items
- Edit button
- Delete button
- "Add New FAQ" button

**Edit/Create Form:**
- Question (text)
- Answer (textarea)

**Actions:**
- Save
- Cancel
- Delete

## Technical Implementation

### Authentication Flow
1. User visits `/admin/*` route
2. Server checks for valid session
3. If no session → redirect to `/admin/login`
4. If valid session → allow access

### Data Operations
- **Create**: POST to API route → Insert to Supabase
- **Read**: Server load function → Fetch from Supabase
- **Update**: PUT to API route → Update in Supabase
- **Delete**: DELETE to API route → Delete from Supabase
- **Reorder**: PATCH to API route → Update display_order fields

### Drag & Drop
- **Library**: Native HTML5 drag-drop or simple library (svelte-dnd-action)
- **Behavior**: Visual feedback during drag, update order on drop
- **Persistence**: Save new order to database immediately

### Form Validation
- Required fields marked with *
- Client-side validation before submit
- Server-side validation in API routes
- Display errors inline

### Array Fields (Bullet Points, Target Titles, etc.)
- Display as list of inputs/textareas
- "Add" button to append new field
- "Remove" button (X icon) next to each field
- Minimum 1 item (can't remove last one)

## API Routes Structure
```
/api/admin/profile          - GET, PUT
/api/admin/experiences      - GET, POST
/api/admin/experiences/[id] - GET, PUT, DELETE
/api/admin/experiences/reorder - PATCH
/api/admin/skills           - GET, POST
/api/admin/skills/[id]      - GET, PUT, DELETE
/api/admin/skills/reorder   - PATCH
/api/admin/faq              - GET, POST
/api/admin/faq/[id]         - GET, PUT, DELETE
```

## Security
- All admin routes require authentication
- Service role key used server-side only
- CSRF protection via SvelteKit
- Input sanitization on all forms
- SQL injection prevention (Supabase handles this)

## UI Components Needed
1. **Sidebar Navigation** - Links to all admin sections
2. **Form Input** - Reusable text input component
3. **Form Textarea** - Reusable textarea component
4. **Array Field Manager** - Add/remove dynamic fields
5. **Drag Handle** - Visual indicator for draggable items
6. **Delete Confirmation Modal** - Confirm before delete
7. **Toast Notification** - Success/error messages
8. **Loading Spinner** - For async operations

## Code Quality Standards

### TypeScript
- ✅ **No explicit `any` types** - Always use proper types
- ✅ **Import types from `$lib/types`** for database models
- ✅ **Use Svelte 5 types**: `Snippet` for children, `$derived` for computed values
- ✅ **Type all function parameters and return types**
- ✅ **Use type-safe navigation** with `resolve()` from `$app/paths`

### Svelte 5 Patterns
- ✅ Use `$state` for reactive variables
- ✅ Use `$derived` for computed values (not capturing initial data)
- ✅ Use `$effect` for side effects
- ✅ Use `$props()` for component props
- ✅ Type children as `Snippet`

### Form Handling
- ✅ Use `enhance` from `$app/forms` for progressive enhancement
- ✅ Set `reset: false` in enhance callback to preserve form state
- ✅ Use FormData for POST requests
- ✅ Handle loading states with `$state`

## Implementation Order
1. ✅ Set up Supabase auth (hooks, types)
2. ✅ Create login page (magic link)
3. ✅ Create admin layout with sidebar
4. ✅ Create dashboard
5. ✅ Create profile editor
6. ✅ Create experiences manager (CRUD)
7. ⏳ Add drag-drop to experiences
8. ⏳ Create skills manager (CRUD)
9. ⏳ Add drag-drop to skills
10. ⏳ Create FAQ manager (CRUD)
11. ⏳ Polish UI and add loading states
12. ⏳ Test all CRUD operations
13. ⏳ Test drag-drop reordering

## Implemented Features

### Authentication
- ✅ Magic link authentication (no password required)
- ✅ Server-side session management with Supabase SSR
- ✅ Protected routes (redirect to login if not authenticated)
- ✅ Logout functionality
- ✅ Auth callback handler for magic link

### Admin Layout
- ✅ Sidebar navigation with icons
- ✅ Active route highlighting
- ✅ User email display
- ✅ Logout button
- ✅ Type-safe navigation with `resolve()`

### Dashboard
- ✅ Stats cards (experiences, skills, FAQs count)
- ✅ Quick action links to all sections
- ✅ Clean, minimal design matching main site

### Profile Editor
- ✅ All basic fields (name, short name, tagline, title, subtitle)
- ✅ Dynamic array fields with add/remove (target titles, company stages)
- ✅ Location and remote preference
- ✅ Social links (GitHub, LinkedIn, Twitter)
- ✅ Form validation (required fields marked)
- ✅ Success/error messages
- ✅ Save and cancel buttons
- ✅ Proper TypeScript typing throughout
- ✅ Form state preservation after submit

### Experiences Manager
- ✅ List view with all experiences
- ✅ Add new experience
- ✅ Edit existing experience
- ✅ Delete with confirmation modal (reusable component)
- ✅ Dynamic bullet points (add/remove textareas)
- ✅ Date fields (start/end with "current" checkbox)
- ✅ Title progression field
- ✅ Team field
- ✅ Display order field
- ✅ Form validation
- ✅ Success/error messages
- ✅ Drag handles (UI ready, functionality pending)

## Reusable Components

### DeleteConfirmModal
Location: `$lib/components/DeleteConfirmModal.svelte`

Props:
- `show: boolean` - Show/hide modal
- `title: string` - Modal title
- `message: string` - Confirmation message
- `onConfirm: () => void` - Callback on confirm
- `onCancel: () => void` - Callback on cancel
- `confirmText?: string` - Confirm button text (default: "Yes, Delete")
- `cancelText?: string` - Cancel button text (default: "Cancel")

Usage:
```svelte
<DeleteConfirmModal
  show={showModal}
  title="Delete Item?"
  message="Are you sure?"
  onConfirm={handleDelete}
  onCancel={() => showModal = false}
/>
```

## Technical Implementation Details

### File Structure
```
src/
├── hooks.server.ts (Supabase auth setup)
├── app.d.ts (Locals types for Supabase)
├── lib/
│   └── components/
│       └── DeleteConfirmModal.svelte (reusable)
└── routes/
    ├── admin/
    │   ├── +layout.svelte (sidebar navigation)
    │   ├── +layout.server.ts (auth protection)
    │   ├── login/
    │   │   ├── +page.svelte (magic link form)
    │   │   └── +page.server.ts (send magic link)
    │   ├── logout/
    │   │   └── +server.ts (POST handler)
    │   ├── dashboard/
    │   │   ├── +page.svelte
    │   │   └── +page.server.ts (fetch stats)
    │   ├── profile/
    │   │   ├── +page.svelte (form UI)
    │   │   └── +page.server.ts (load + update)
    │   └── experiences/
    │       ├── +page.svelte (list view)
    │       ├── +page.server.ts (load + delete action)
    │       └── [id]/
    │           ├── +page.svelte (edit/create form)
    │           └── +page.server.ts (load + save/delete actions)
    └── auth/
        └── callback/
            └── +server.ts (handle magic link)
```

### Key Patterns Used

**Server-side Auth:**
```typescript
// hooks.server.ts
event.locals.supabase = createServerClient(...)
event.locals.safeGetSession = async () => {...}
```

**Protected Routes:**
```typescript
// +layout.server.ts
if (!session && !url.pathname.includes('/admin/login')) {
  throw redirect(303, '/admin/login');
}
```

**Form Actions:**
```typescript
// +page.server.ts
export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    // Update database
    return { success: true };
  }
};
```

**Dynamic Array Fields:**
```typescript
let targetTitles = $state<string[]>([]);

$effect(() => {
  targetTitles = data.profile?.target_titles || [''];
});

function addTargetTitle() {
  targetTitles = [...targetTitles, ''];
}
```

**Type-safe Navigation:**
```typescript
import { resolve } from '$app/paths';
href={resolve('/admin/dashboard')}
```

### RLS Configuration
- Service role key bypasses RLS for admin operations
- Public routes use anon key with RLS policies
- Profile table has "Allow all for authenticated" policy for admin access

### Environment Variables
```
PUBLIC_SUPABASE_URL=your_url
SUPABASE_SECRET_KEY=your_service_role_key (not anon key!)
```

## Notes
- Keep it simple - no fancy UI libraries
- Focus on functionality over aesthetics
- Reuse existing design tokens
- Mobile-friendly but desktop-first
- No need for image uploads (yet)
