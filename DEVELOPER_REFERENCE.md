# Reel Route - Developer Quick Reference

## Essential Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build           # Build for production
npm start               # Run production server
npm run lint            # Run linter

# Database
# Run SQL in Supabase dashboard: scripts/setup-db.sql
```

## Project Structure

```
app/
  api/                  # Backend route handlers
  dashboard/            # Dashboard routes (protected)
  page.tsx              # Landing page
  layout.tsx            # Root layout
  globals.css           # Global styles & animations

components/
  *-card.tsx            # UI cards
  *-dialog.tsx          # Modal dialogs
  loading-skeleton.tsx  # Loading states

lib/
  db.ts                 # Supabase client
  types.ts              # TypeScript interfaces
  api-client.ts         # API wrapper
  auth.ts               # Auth helpers
  ai-mock.ts            # Mock LLM generator

scripts/
  setup-db.sql          # Database schema
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `lib/types.ts` | All TypeScript interfaces |
| `lib/api-client.ts` | All API calls |
| `lib/ai-mock.ts` | Itinerary generation |
| `app/api/trips/route.ts` | Trip CRUD logic |
| `app/dashboard/trips/[id]/page.tsx` | Main UI |

## Adding a New Feature

### 1. Add Type Definition
```typescript
// lib/types.ts
export interface NewFeature {
  id: string;
  // ...
}
```

### 2. Create API Endpoint
```typescript
// app/api/new-feature/route.ts
export async function GET() { /* ... */ }
export async function POST(req: NextRequest) { /* ... */ }
```

### 3. Add API Client Method
```typescript
// lib/api-client.ts
getNewFeatures: () => apiCall('/new-feature'),
```

### 4. Create Component
```typescript
// components/new-feature-card.tsx
export function NewFeatureCard({ data }: Props) { /* ... */ }
```

### 5. Use in Page
```typescript
// app/dashboard/page.tsx
const data = await apiClient.getNewFeatures();
return <NewFeatureCard data={data} />;
```

## API Response Pattern

All API endpoints follow this pattern:

```typescript
// Success
{ data: { /* actual data */ } }

// Error
{ error: { message: "Error description", code: "500" } }
```

Client usage:
```typescript
const response = await apiClient.getTrips();
if (response.data) {
  // Use response.data (typed)
} else {
  console.error(response.error?.message);
}
```

## Authentication Flow (Ready to Implement)

```typescript
// Get current user
const user = await getCurrentUser(); // null if not authenticated

// In API routes
const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

## Database Access Pattern

```typescript
// Select
const { data, error } = await supabase
  .from('trips')
  .select('*')
  .eq('user_id', userId);

// Insert
const { data } = await supabase
  .from('trips')
  .insert({ /* data */ })
  .select()
  .single();

// Update
const { data } = await supabase
  .from('trips')
  .update({ title: 'New Title' })
  .eq('id', tripId)
  .select()
  .single();

// Delete
await supabase
  .from('trips')
  .delete()
  .eq('id', tripId);
```

## Component Animation Classes

```html
<!-- Fade in with upward motion -->
<div className="animate-fadeInUp">

<!-- Slide in from left -->
<div className="animate-slideInLeft">

<!-- Slide in from right -->
<div className="animate-slideInRight">

<!-- Scale up fade in -->
<div className="animate-scale-in">

<!-- Pulsing glow effect -->
<div className="animate-pulse-glow">

<!-- Hover effects -->
<div className="hover:scale-105 transition-all duration-300">
```

## Useful Tailwind Classes

```html
<!-- Responsive -->
<div className="md:grid-cols-2 lg:grid-cols-3">

<!-- Spacing -->
<div className="p-4 gap-2 mb-6">

<!-- Text utilities -->
<p className="text-balance text-muted-foreground">

<!-- Flexbox -->
<div className="flex items-center justify-between">

<!-- Grid -->
<div className="grid grid-cols-3 gap-4">

<!-- States -->
<button className="hover:shadow-lg active:scale-95">
```

## Component Props Pattern

```typescript
interface ComponentProps {
  // Data
  data: DataType;
  
  // Callbacks
  onAction?: (value: string) => void;
  onDelete?: (id: string) => void;
  
  // States
  loading?: boolean;
  error?: string;
  
  // Styling
  className?: string;
}
```

## Error Handling Checklist

- [ ] HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- [ ] Error messages are user-friendly
- [ ] Authorization checks on protected routes
- [ ] Input validation with Zod (optional)
- [ ] Try-catch in API routes
- [ ] Console logging for debugging

## Performance Tips

1. **Use loading skeletons** instead of spinners
2. **Implement pagination** for large datasets
3. **Add database indexes** (already done)
4. **Compress images** before upload
5. **Use SWR/React Query** for client caching
6. **Lazy load components** with dynamic imports

## Testing an API Endpoint

```typescript
// In browser console
const response = await fetch('/api/trips');
const data = await response.json();
console.log(data);
```

## Common Mistakes to Avoid

❌ Not awaiting async functions  
❌ Using default/random IDs (use UUIDs)  
❌ Forgetting RLS policies  
❌ Hard-coding environment variables  
❌ Not handling errors from Supabase  
❌ Returning sensitive data (passwords)  
❌ Forgetting to validate user ownership  

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=<your_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
```

## Debugging Tips

```typescript
// Log in components
console.log("[v0]", "Component mounted with props:", props);

// Log in API routes
console.error('API Error:', error);

// Check Supabase
const { error } = await supabase.from('table').select();
if (error) console.error('DB Error:', error.message);
```

## Git Commit Messages

```
feat: Add new feature description
fix: Fix bug description
docs: Update documentation
style: Format code
refactor: Refactor code structure
perf: Improve performance
test: Add tests
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Docs](https://react.dev)

## Quick Wins (Easy Additions)

- [ ] Add toast notifications (sonner installed)
- [ ] Add input validation (zod installed)
- [ ] Add form handling (react-hook-form installed)
- [ ] Add keyboard shortcuts
- [ ] Add search functionality
- [ ] Add filters/sorting
- [ ] Add export to PDF
- [ ] Add dark mode toggle

---

**Last Updated:** February 15, 2026  
**Project:** Reel Route MVP
