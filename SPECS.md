# Portfolio Website Technical Specifications

## Tech Stack
- SvelteKit (already initialized)
- TypeScript
- Tailwind CSS (for styling)

## Color System
```css
--color-bg-primary: #0a0a0a
--color-accent-teal: #3b82f6 (bright blue)
--color-accent-amber: #d4a574
```

## Typography
- **Sans-serif (body)**: Roboto (local fonts: Regular 400, Medium 500, Bold 700)
- **Serif (headings)**: Georgia (system font)

## Component Structure

### 1. Layout (`+page.svelte`)
- Fixed navigation bar
- Scrollable main content
- Chat drawer overlay (conditional render)

### 2. Navigation Component
- Fixed position, backdrop blur
- Logo/initials (left)
- Nav links (center/right)
- "Ask AI" button (right, blue)

### 3. Hero Section
- Status badge (pill shape, green dot)
- Name (serif, large)
- Title (blue)
- Positioning statement
- Company badges (horizontal scroll on mobile)
- CTA button
- Scroll indicator

### 4. Experience Section
- Section header with subhead
- Experience cards (array iteration)
- Expandable AI context panels (toggle state)
- Card structure:
  - Header: company + dates
  - Title progression
  - Bullet list
  - Toggle button
  - Conditional expanded panel

### 5. Skills Matrix Section
- 3-column grid (responsive: stack on mobile)
- Cards with different accent colors
- Icon + category header
- Skill list

### 6. Chat Drawer Component
- Slide-in animation from right
- Overlay backdrop
- Chat messages container
- Suggested questions (chips)
- Input field + send button
- Close button

### 7. Footer
- Name + title
- Social links (icons)
- Tagline

## State Management
- Chat drawer open/closed: boolean
- Experience card expanded states: Record<id, boolean>
- Chat messages: array of { role: 'user' | 'ai', content: string }

## Responsive Breakpoints
- Mobile: < 768px (stack sections, horizontal scroll for badges)
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Animations
- Chat drawer: slide-in/out (transform translateX)
- Experience panels: expand/collapse (max-height transition)
- Scroll indicator: bounce animation
- Hover states: subtle scale/glow effects

## Data Structure (Placeholder)

```typescript
interface Experience {
  id: string;
  company: string;
  dateRange: string;
  titleProgression: string;
  achievements: string[];
  aiContext: {
    situation: string;
    approach: string;
    technicalWork: string;
    lessonsLearned: string;
  };
}
```

## Implementation Order
1. ✅ Install Tailwind CSS
2. ✅ Set up global styles and color variables
3. ✅ Build layout structure (nav + footer)
4. ✅ Hero section
5. ✅ Experience section with toggle
6. ✅ Skills matrix
7. ✅ Chat drawer
8. ✅ Polish animations and responsive design
9. ✅ Add local Roboto fonts

## Notes
- All content is placeholder for now
- AI functionality will be stubbed (no real API calls yet)
- Focus on UI/UX and component structure
- Admin panel for content management comes later
