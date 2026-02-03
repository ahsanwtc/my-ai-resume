# Portfolio Website Technical Specifications

## Tech Stack
- SvelteKit (SSR for data fetching)
- TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL database)
- Supabase Edge Functions (for AI chat)

## Color System
```css
--color-bg-primary: #0a0a0a (near-black background)
--color-accent-teal: #3b82f6 (bright blue for CTAs and highlights)
--color-accent-amber: #d4a574 (warm amber for gaps/warnings)
--border-subtle: rgba(255, 255, 255, 0.1)
```

## Typography
- **Sans-serif (body)**: Roboto (local fonts: Regular 400, Medium 500, Bold 700)
- **Serif (headings)**: Georgia (system font)
- Font files located in: `/static/fonts/`

## Layout Structure

### 1. Fixed Navigation
- Logo/initials (left) - clickable, scrolls to top
- Nav links: "Experience" | "Skills" (hidden on mobile)
- "Ask AI" button (right, blue accent)
- Backdrop blur effect with subtle border
- Sticky at top, z-index 40

### 2. Hero Section
- **Status badge**: Green pulse dot + availability text
- **Name**: Large serif heading (6xl/7xl)
- **Title + Subtitle**: Blue accent + gray, separated by dot
- **Elevator pitch**: Large body text (xl), gray-300
- **Meta info**: Location + remote preference with icons
- **Company badges**: Pill-shaped, from past experiences
- **CTAs**: Primary (Ask AI) + Secondary (View Experience)
- **Scroll indicator**: Animated bounce at bottom

### 3. Experience Section
- **Section header**: Large serif + descriptive subhead
- **Experience cards**:
  - Company name (2xl bold)
  - Title progression (blue accent)
  - Team/department (small gray)
  - Date range (top right, gray)
  - Bullet points with blue dots
  - "Ask AI about this role" CTA with arrow
  - Hover effects: lighter background, border glow
  - Rounded corners (2xl)
  - No logos/emojis

### 4. Skills Matrix Section
- **Three columns**: Strong / Moderate / Gaps
- **Card styling**:
  - Icon circle with background color
  - Category label (colored)
  - Skill list (small text, relaxed spacing)
  - Border colors match category
  - Rounded corners (2xl)
- **Philosophy callout**: Blue tinted box explaining gaps

### 5. Footer
- **Two-column layout** (stacked on mobile):
  - Left: Name, title, social links
  - Right: "Ask AI Anything" CTA button
- **Bottom bar**: Tagline centered
- Border top, subtle

### 6. Chat Drawer
- **Slides in from right** (max-width: lg)
- **Header**: Title + description + close button
- **Messages area**:
  - Suggested questions (if empty)
  - Message bubbles (user: blue right, AI: gray left)
  - Rounded corners (2xl)
  - Scrollable
- **Input area**: Text input + Send button
- **Backdrop**: Dark blur overlay
- **Animation**: Smooth slide-in with cubic-bezier easing

## Component Specifications

### Status Badge
```
- Inline-flex with gap
- Green background (green-500/10)
- Green border (green-500/20)
- Animated pulse dot
- Small text (sm)
- Rounded full
```

### Experience Card
```
- Background: white/5
- Border: white/10
- Padding: 8 (2rem)
- Hover: white/[0.07] bg, white/20 border
- Transition: all
- Group hover for nested elements
```

### Skill Category Card
```
Strong:
  - Border: accent-teal/30
  - Icon bg: accent-teal/20
  - Text: accent-teal

Moderate:
  - Border: gray-500/30
  - Icon bg: gray-500/20
  - Text: gray-400

Gaps:
  - Border: accent-amber/30
  - Icon bg: accent-amber/20
  - Text: accent-amber
```

## Responsive Breakpoints
- Mobile: < 768px
  - Stack sections
  - Hide nav links
  - Single column skills
  - Full-width chat drawer
- Tablet: 768px - 1024px
  - Show nav links
  - 2-column skills (if space)
- Desktop: > 1024px
  - Full layout
  - 3-column skills
  - Max-width containers (5xl-6xl)

## Animations

### Bounce (Scroll Indicator)
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
animation: bounce 2s infinite;
```

### Slide-in (Chat Drawer)
```css
@keyframes slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
```

### Hover Effects
- Scale: 1.05 on buttons
- Background: lighter on cards
- Border: brighter on focus
- Transform: translateX on arrows

## Database Schema (Supabase)

### Tables Used
1. **candidate_profile** - Hero section data
2. **experiences** - Experience cards
3. **skills** - Skills matrix (filtered by category)
4. **faq_responses** - Chat suggested questions (where is_common_question = true)
5. **gaps_weaknesses** - Additional context for AI
6. **values_culture** - AI context
7. **ai_instructions** - AI behavior rules

### Data Flow
- **SSR Load**: Fetch all data in `+page.server.ts`
- **Public data**: Filtered and passed to component
- **Private data**: Kept server-side for AI context
- **Chat**: Calls Supabase Edge Function with question

## File Structure
```
src/
├── routes/
│   ├── +page.svelte (main portfolio)
│   ├── +page.server.ts (SSR data fetching)
│   └── api/
│       └── test-db/+server.ts (test endpoint)
├── app.css (Tailwind + custom styles)
├── app.html (HTML shell with Roboto fonts)
└── app.d.ts

static/
└── fonts/
    ├── Roboto-Regular.ttf
    ├── Roboto-Medium.ttf
    └── Roboto-Bold.ttf

supabase/
└── functions/
    └── get-profile/
        └── index.ts (Edge Function example)
```

## Environment Variables
```
PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_secret_key
```

## Implementation Checklist
- ✅ Install Tailwind CSS v4
- ✅ Configure PostCSS with @tailwindcss/postcss
- ✅ Add local Roboto fonts
- ✅ Set up Supabase client
- ✅ Create database tables with RLS policies
- ✅ Build SSR data fetching with proper TypeScript types
- ✅ Create type definitions for database and frontend
- ✅ Design hero section with status badge
- ✅ Create experience cards with hover effects
- ✅ Build skills matrix (3 categories)
- ✅ Add philosophy callout
- ✅ Implement chat drawer with animations
- ✅ Add responsive navigation
- ✅ Polish footer with CTAs
- ✅ Test on mobile/tablet/desktop
- ✅ Integrate real data from Supabase
- ✅ Type all components and functions

## TypeScript Types

All types are defined in `/src/lib/types.ts`:

### Database Types (match Supabase schema)
- `ResumeProfile` - resume_profile table
- `ResumeExperience` - resume_experiences table
- `ResumeSkill` - resume_skills table
- `ResumeFaqResponse` - resume_faq_responses table
- `ResumeWeakness` - resume_weaknesses table
- `ResumeValuesCulture` - resume_values_culture table

### Frontend Types (public-facing)
- `Profile` - Filtered profile data for display
- `Experience` - Experience card data
- `SkillsMatrix` - Skills organized by category
- `PageData` - Complete page data structure

### Server Load Function
```typescript
export const load: PageServerLoad = async (): Promise<PageData>
```
- Fetches data from Supabase with proper types
- Filters sensitive data (keeps private context server-side)
- Returns strongly-typed PageData object

### Component Props
```typescript
const { data }: { data: PageData } = $props();
```
- Uses SvelteKit's auto-generated PageData type
- All variables and functions are properly typed
- State variables use explicit types

## Next Steps
1. Populate Supabase tables with real data
2. Create AI chat Edge Function (Claude integration)
3. Wire chat UI to Edge Function
4. Add loading states
5. Deploy to Netlify/Vercel
6. Set up environment variables in hosting platform

## Design Principles
- **Honesty over polish**: Show gaps, not just strengths
- **Queryable context**: Everything has deeper AI-accessible context
- **Clean hierarchy**: Clear visual structure, generous spacing
- **Subtle interactions**: Smooth transitions, no jarring effects
- **Mobile-first**: Works perfectly on all devices
- **Fast loading**: Minimal dependencies, optimized assets
