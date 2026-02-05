# Code Quality & Standards

## Core Principles

### Minimal Code
- Write only the ABSOLUTE MINIMAL amount of code needed
- Avoid verbose implementations
- No code that doesn't directly contribute to the solution
- No unnecessary abstractions or over-engineering

### Type Safety
- **NO explicit `any` types** - EVER
- Always use proper TypeScript types
- Import types from `$lib/types.ts` for database models
- Type all function parameters and return types
- Use type inference where appropriate but be explicit when needed

## TypeScript Standards

### Type Definitions
```typescript
// ✅ Good - Proper typing
function handleDelete(id: number): Promise<void> { }
let items = $state<Item[]>([]);

// ❌ Bad - Using any
function handleDelete(id: any) { }
let items = $state<any>([]);
```

### Database Types
- Define database table types in `$lib/types.ts`
- Separate database types from frontend types
- Use `.returns<Type>()` for Supabase queries

```typescript
// Database type
export interface ResumeExperience {
  id: number;
  company_name: string;
  // ... all database fields
}

// Frontend type (filtered/transformed)
export interface Experience {
  id: number;
  name: string;
  // ... public fields only
}
```

## Svelte 5 Patterns

### Runes
```typescript
// State
let count = $state(0);
let items = $state<Item[]>([]);

// Derived (computed values)
const isNew = $derived(data.item === null);
const total = $derived(items.reduce((sum, i) => sum + i.price, 0));

// Effects (side effects)
$effect(() => {
  items = data.items || [];
});

// Props
let { data, form }: { data: PageData; form: ActionData } = $props();
```

### Component Types
```typescript
import type { Snippet } from 'svelte';

// Children prop
let { children }: { children: Snippet } = $props();

// Render children
{@render children()}
```

### Avoiding State Capture
```typescript
// ❌ Bad - Captures initial value
const isNew = data.item === null;

// ✅ Good - Reactive
const isNew = $derived(data.item === null);
```

## SvelteKit Patterns

### Type-Safe Navigation
```typescript
import { resolve } from '$app/paths';
import { goto } from '$app/navigation';

// ✅ Type-safe routes
href={resolve('/admin/dashboard')}
goto(resolve('/admin/profile'));

// ❌ Plain strings only for non-existent routes
href="/admin/future-page"
```

### Form Actions
```typescript
// Server-side
export const actions: Actions = {
  save: async ({ request }) => {
    const formData = await request.formData();
    // ... handle save
    return { success: true };
  }
};

// Client-side
use:enhance={() => {
  loading = true;
  return async ({ update }) => {
    loading = false;
    await update({ reset: false }); // Preserve form state
  };
}}
```

### Server Routes vs Page Routes
```typescript
// +page.server.ts - Use actions
export const actions: Actions = { ... }

// +server.ts - Use HTTP handlers
export const POST: RequestHandler = async ({ request }) => { ... }
```

## Supabase Integration

### Client Creation
```typescript
// Server-side with service role key
const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);

// Typed queries
const { data } = await supabase
  .from('table_name')
  .select('*')
  .returns<TableType[]>();
```

### RLS Configuration
- Service role key bypasses RLS
- Use service role key for all admin operations
- Public routes use anon key with RLS policies
- Enable RLS on all tables for security

### Environment Variables
```
PUBLIC_SUPABASE_URL=your_url
SUPABASE_SECRET_KEY=your_service_role_key (NOT anon key!)
```

## Component Patterns

### Reusable Components
- Create in `$lib/components/`
- Properly type all props
- Use TypeScript interfaces for prop types
- Export types if needed elsewhere

```typescript
interface Props {
  show: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string; // Optional with default
}

let { show, title, onConfirm, onCancel, confirmText = 'Confirm' }: Props = $props();
```

### Dynamic Arrays
```typescript
// State
let items = $state<string[]>([]);

// Initialize from data
$effect(() => {
  items = data.items || [''];
});

// Add/remove
function addItem() {
  items = [...items, ''];
}

function removeItem(index: number) {
  if (items.length > 1) {
    items = items.filter((_, i) => i !== index);
  }
}
```

## Styling Standards

### Tailwind CSS v4
- Use `@import "tailwindcss"` in CSS
- Define theme variables in `@theme` block
- Use utility classes, avoid custom CSS when possible
- Consistent spacing: p-6, gap-4, space-y-6

### Design Tokens
```css
--color-bg-primary: #0a0a0a
--color-accent-teal: #3b82f6
--color-accent-amber: #d4a574
```

### Component Styling
- Consistent rounded corners: `rounded-lg`, `rounded-xl`, `rounded-2xl`
- Consistent borders: `border border-white/10`
- Consistent backgrounds: `bg-white/5`
- Hover states: `hover:bg-white/10 transition-all`

## Error Handling

### Form Validation
```typescript
// Server-side
if (error) {
  return fail(500, { message: error.message });
}

// Client-side display
{#if form?.message}
  <div class="bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
    {form.message}
  </div>
{/if}
```

### Loading States
```typescript
let loading = $state(false);

// In form
use:enhance={() => {
  loading = true;
  return async ({ update }) => {
    loading = false;
    await update();
  };
}}

// In button
<button disabled={loading}>
  {loading ? 'Saving...' : 'Save'}
</button>
```

## File Organization

### Route Structure
```
routes/
├── admin/
│   ├── +layout.svelte (shared layout)
│   ├── +layout.server.ts (auth protection)
│   ├── dashboard/
│   │   ├── +page.svelte
│   │   └── +page.server.ts
│   └── [resource]/
│       ├── +page.svelte (list view)
│       ├── +page.server.ts (load + actions)
│       └── [id]/
│           ├── +page.svelte (edit/create)
│           └── +page.server.ts (load + save/delete)
```

### Type Definitions
```
lib/
├── types.ts (all TypeScript types)
└── components/
    └── ComponentName.svelte
```

## Security

### Authentication
- All admin routes protected via `+layout.server.ts`
- Session validation on every request
- Magic link authentication (no passwords)
- Logout clears session

### Data Access
- Service role key only in server-side code
- Never expose service role key to client
- RLS policies for public data access
- Input sanitization via Supabase (prevents SQL injection)

## Testing Checklist

Before committing:
- [ ] No `any` types
- [ ] All functions have return types
- [ ] All parameters are typed
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Forms work (create, update, delete)
- [ ] Loading states work
- [ ] Error messages display
- [ ] Responsive on mobile
- [ ] Navigation works
- [ ] Type-safe routes with `resolve()`

## Common Patterns

### CRUD Operations
1. List page: Load all items, display in cards/table, delete action
2. Edit page: Load single item, form with all fields, save/delete actions
3. Reusable delete modal component
4. Type-safe navigation between pages
5. Loading states on all async operations

### Form Fields
- Text inputs: `input type="text"`
- Textareas: `textarea rows="3"`
- Dates: `input type="date"`
- Checkboxes: `input type="checkbox" bind:checked`
- Selects: `select` with `option` elements
- Dynamic arrays: Add/remove buttons with state management

### Drag and Drop
```typescript
let draggedItem = $state<ItemType | null>(null);
let dragOverIndex = $state<number | null>(null);

function handleDragStart(e: DragEvent, item: ItemType): void {
  draggedItem = item;
}

function handleDragOver(e: DragEvent, index: number): void {
  e.preventDefault();
  dragOverIndex = index;
}

async function handleDrop(e: DragEvent, targetIndex: number): Promise<void> {
  e.preventDefault();
  // Reorder logic
  // Update database
  // Refresh data
}
```

## Anti-Patterns to Avoid

❌ Using `any` type
❌ Capturing reactive data in non-reactive variables
❌ Not typing function parameters/returns
❌ Using plain strings for existing routes (use `resolve()`)
❌ Exposing service role key to client
❌ Not handling loading states
❌ Not handling errors
❌ Resetting forms after submit (use `reset: false`)
❌ Not using TypeScript strict mode
❌ Mixing server and client logic
❌ Not using proper Svelte 5 runes

## Code Review Checklist

- [ ] All types are explicit (no `any`)
- [ ] Imports use proper paths (`$lib`, `$app`)
- [ ] Components are properly typed
- [ ] Forms have loading and error states
- [ ] Database queries are typed
- [ ] Navigation uses `resolve()` for existing routes
- [ ] Reusable components are in `$lib/components`
- [ ] Consistent styling with design system
- [ ] Responsive design works on mobile
- [ ] No console.logs in production code
