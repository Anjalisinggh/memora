# Reel Route - Setup Guide

A modern, AI-powered travel itinerary planner built with Next.js 16, Supabase, and TypeScript.

## Architecture Overview

```
Frontend (Next.js 16 + React 19)
├── Landing page with feature highlights
├── Dashboard with trip management
├── Trip details with itinerary generation
└── Components: TripCard, ActivityCard, Dialogs

Backend (Next.js API Routes)
├── /api/trips - Trip CRUD operations
├── /api/trips/[id]/itineraries - Itinerary generation
├── /api/days/[id]/activities - Activity management
├── /api/trips/[id]/memories - Memory photos
└── /api/destinations - Destination lookup

Database (Supabase PostgreSQL)
├── users
├── trips
├── itineraries
├── days
├── activities
├── memories
├── collaborators
└── destinations

Authentication: Supabase Auth
Storage: Supabase Storage (for photos)
```

## Prerequisites

- Node.js 18+ (comes with pnpm)
- Supabase account (https://supabase.com)
- Environment variables configured

## Quick Start

### 1. Clone & Install

```bash
git clone <repo>
cd reel-route
npm install
# or
pnpm install
```

### 2. Setup Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to project settings → API keys and copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)

### 3. Configure Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Initialize Database Schema

1. In Supabase SQL Editor, run the contents of `/scripts/setup-db.sql`
2. This creates all tables with proper RLS (Row Level Security) policies

### 5. Setup Supabase Auth

1. Go to Authentication → Providers in Supabase dashboard
2. Enable Email/Password authentication
3. Configure redirect URLs in Auth settings:
   - `http://localhost:3000/dashboard` (development)
   - `https://yourdomain.com/dashboard` (production)

### 6. Create Auth Context (Optional)

For a complete auth experience, consider wrapping the app with an auth provider that syncs Supabase auth state.

### 7. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000`

## Project Structure

```
/app
  /api                          # Backend API routes
    /trips
      route.ts                  # GET/POST trips
      /[id]
        /itineraries
          route.ts              # Generate/get itineraries
        /memories
          route.ts              # Get/create memories
        route.ts                # GET/PUT/DELETE single trip
    /days
      /[id]
        /activities
          route.ts              # GET/POST activities
    /activities
      /[id]
        route.ts                # PUT/DELETE activity
    /destinations
      route.ts                  # GET/POST destinations

  /dashboard                     # Dashboard routes
    layout.tsx                   # Dashboard nav
    page.tsx                     # Trips list
    /trips
      /[id]
        page.tsx                # Trip details & itineraries

  /components                    # Reusable components
    trip-card.tsx
    activity-card.tsx
    new-trip-dialog.tsx
    ai-generate-dialog.tsx
    loading-skeleton.tsx

  /lib                          # Utilities
    db.ts                       # Supabase client
    types.ts                    # TypeScript types
    api-client.ts               # API client wrapper
    auth.ts                     # Auth helpers
    ai-mock.ts                  # AI mock logic

  page.tsx                      # Landing page
  layout.tsx                    # Root layout
  globals.css                   # Global styles & animations
```

## Key Features

### 1. AI-Generated Itineraries

The app includes a mock AI generator that creates deterministic, seed-based itineraries. This is production-ready for swapping in a real LLM:

```typescript
// In /lib/ai-mock.ts
generateMockItinerary({
  destination: "Tokyo",
  startDate: new Date("2024-02-01"),
  endDate: new Date("2024-02-07"),
  travelStyle: "adventure",
  tripId: "trip-123",
});
```

**To integrate a real LLM:**
1. Replace the mock function with actual API calls to Claude, GPT-4, or similar
2. Maintain the same return shape for compatibility
3. Add streaming for better UX

### 2. Type-Safe API Client

All API calls are wrapped with TypeScript types:

```typescript
const response = await apiClient.getTrips();
if (response.data) {
  // response.data is typed as Trip[]
}
```

### 3. Row Level Security (RLS)

All database tables have RLS policies enabled. Users can only:
- View their own trips and private data
- Create/edit/delete their own content
- View public trips shared by others

### 4. Smooth Animations

- Fade-in animations on cards
- Hover scale effects
- Pulse effects on accent elements
- Loading skeletons for better perceived performance

## API Endpoints

### Trips
- `GET /api/trips` - List user's trips
- `POST /api/trips` - Create trip
- `GET /api/trips/[id]` - Get trip details
- `PUT /api/trips/[id]` - Update trip
- `DELETE /api/trips/[id]` - Delete trip

### Itineraries
- `GET /api/trips/[id]/itineraries` - Get itineraries for trip
- `POST /api/trips/[id]/itineraries` - Create/generate itinerary
  - Body: `{ useAI: true, travelStyle: "adventure" }`

### Activities
- `GET /api/days/[id]/activities` - Get day's activities
- `POST /api/days/[id]/activities` - Create activity
- `PUT /api/activities/[id]` - Update activity
- `DELETE /api/activities/[id]` - Delete activity

### Memories
- `GET /api/trips/[id]/memories` - Get trip photos
- `POST /api/trips/[id]/memories` - Add photo

### Destinations
- `GET /api/destinations` - List destinations
- `POST /api/destinations` - Create destination

## Development Tips

### Testing API Locally

Use the Chrome DevTools Network tab or create a test script:

```typescript
// lib/test-api.ts
async function testAPI() {
  const trips = await apiClient.getTrips();
  console.log("Trips:", trips);
}
```

### Debugging Supabase

Enable verbose logging:

```typescript
// lib/db.ts
const supabase = createClient(url, key, {
  auth: { detectSessionInUrl: true },
  realtime: { params: { eventsPerSecond: 10 } },
});
```

### Performance Tips

1. Use SWR or React Query for client-side caching
2. Implement pagination for large datasets
3. Use database indexes (already created in schema)
4. Compress image uploads before storing

## Deployment

### Vercel Deployment (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# - Go to vercel.com
# - Connect GitHub repo
# - Add environment variables
# - Deploy
```

### Environment Variables on Vercel

In Vercel dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Future Enhancements

- Real LLM integration (Claude, GPT-4)
- Real-time collaboration with Supabase Realtime
- Photo upload to Supabase Storage
- User authentication flow
- Sharing & permissions system
- Mobile app (React Native)
- Map integration (Leaflet, Mapbox)
- Payment processing (Stripe for premium features)

## Troubleshooting

### "Missing NEXT_PUBLIC_SUPABASE_URL"
- Check `.env.local` has correct variables
- Restart dev server after adding env vars

### "Unauthorized" errors
- Verify user is authenticated
- Check RLS policies in Supabase dashboard
- Ensure correct trip/resource ownership

### Database schema not working
- Run SQL migration again
- Check for error messages in Supabase SQL Editor
- Verify RLS is enabled

### Animations not showing
- Clear browser cache
- Check `globals.css` is imported
- Verify Tailwind config is loaded

## Support

For issues:
1. Check Supabase logs (Dashboard → Logs)
2. Check browser console for errors
3. Review API responses in Network tab
4. Post in Reel Route discussions

## License

MIT
