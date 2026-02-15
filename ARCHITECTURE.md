# Reel Route - System Architecture

## High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                             │
│  Landing Page (/) → Dashboard (/dashboard)                  │
│  Trip List → Trip Details → Itinerary Generation            │
└────────────────────┬────────────────────────────────────────┘
                     │ API Calls (JSON)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS 16 SERVER                              │
│  Route Handlers (/app/api/*)                                │
│  - Trip CRUD                                                │
│  - Itinerary Generation (Mock AI)                           │
│  - Activity Management                                      │
│  - Memory Photos                                            │
└────────────────────┬────────────────────────────────────────┘
                     │ Database Queries (SQL)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│            SUPABASE (Managed PostgreSQL)                    │
│  - users, trips, itineraries, days, activities             │
│  - memories, collaborators, destinations                   │
│  - Row Level Security (RLS) policies                       │
│  - Real-time subscriptions (future)                        │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Endpoint Map

```
Frontend Components
│
├─ Landing (/) 
│  └─ Static page with features
│
├─ Dashboard (/dashboard)
│  ├─ TripCard (links to trip detail)
│  ├─ NewTripDialog
│  └─ GET /api/trips → Display list
│
└─ Trip Detail (/dashboard/trips/[id])
   ├─ AIGenerateDialog
   │  └─ POST /api/trips/[id]/itineraries (useAI: true)
   ├─ Itinerary cards (mapped)
   │  └─ GET /api/trips/[id]/itineraries
   ├─ Day cards
   └─ Activity cards
      ├─ GET /api/days/[id]/activities
      ├─ POST /api/days/[id]/activities
      └─ PUT/DELETE /api/activities/[id]
```

## Database Entity Relationships

```
┌─────────────┐
│   USERS     │ (PK: id)
├─────────────┤
│ id (UUID)   │
│ email       │
│ full_name   │
│ avatar_url  │
└────────┬────┘
         │ 1:N
         │
    ┌────▼──────────────┐
    │  TRIPS            │ (PK: id, FK: user_id)
    ├───────────────────┤
    │ id (UUID)         │
    │ user_id (FK)      │◄──── Owner
    │ title             │
    │ description       │
    │ start_date        │
    │ end_date          │
    │ destination_id    │
    │ is_public         │
    └────┬──────┬──────┬────┘
         │ 1:N  │ 1:N  │ 1:N
         │      │      │
    ┌────▼─────┐ │   ┌─▼──────────────────┐
    │ITINERARIES│ │   │  MEMORIES          │
    ├────────────┤ │   ├────────────────────┤
    │ id (UUID)  │ │   │ id (UUID)          │
    │ trip_id(FK)│ │   │ trip_id (FK)       │
    │ title      │ │   │ user_id (FK)       │
    │ description│ │   │ image_url          │
    └────┬───────┘ │   │ caption            │
         │ 1:N     │   │ date_taken         │
         │         │   └────────────────────┘
    ┌────▼──────┐  │
    │ DAYS      │  │
    ├──────────┤  │
    │ id (UUID)│  │
    │ itin_id │  │
    │ day_num   │  │
    │ date      │  │
    └────┬─────┘  │
         │ 1:N    │
         │        │
    ┌────▼────────────┐
    │ ACTIVITIES      │
    ├─────────────────┤
    │ id (UUID)       │
    │ day_id (FK)     │
    │ title           │
    │ description     │
    │ start_time      │
    │ end_time        │
    │ location        │
    │ category        │
    └─────────────────┘
         
┌────────────────────────────┐
│  DESTINATIONS              │
├────────────────────────────┤
│ id (UUID)                  │
│ name                       │
│ country                    │
│ latitude, longitude        │
│ description, image_url     │
└────────────────────────────┘

┌────────────────────────────┐
│  COLLABORATORS             │
├────────────────────────────┤
│ id (UUID)                  │
│ trip_id (FK)               │
│ user_id (FK)               │
│ role (owner|editor|viewer) │
└────────────────────────────┘
```

## API Layer Architecture

```
API Request Flow:
┌──────────────┐
│ Client Fetch │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│ Next.js Route Handler            │
│ (/app/api/trips/route.ts)        │
├──────────────────────────────────┤
│ 1. Parse request (method, body)  │
│ 2. Authenticate user             │
│ 3. Validate input (Zod optional) │
│ 4. Check authorization           │
│ 5. Query database                │
│ 6. Return response (200/400/500) │
└──────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Supabase Client                  │
│ (@supabase/supabase-js)          │
├──────────────────────────────────┤
│ - Auth context                   │
│ - Query builder                  │
│ - RLS policy enforcement         │
│ - Error handling                 │
└──────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ PostgreSQL Database              │
│ (Managed by Supabase)            │
├──────────────────────────────────┤
│ - Row Level Security             │
│ - Indexes for performance        │
│ - CASCADE deletes                │
│ - Check constraints              │
└──────────────────────────────────┘
```

## Authentication & Authorization Flow

```
User Authentication (to be implemented):
┌─────────────┐
│ Sign Up     │─────┐
└─────────────┘     │
                    ▼
            ┌──────────────────┐
            │ Supabase Auth    │
            │ (Email/Password) │
            └────────┬─────────┘
                     │
            ┌────────▼─────────┐
            │ Session Created  │
            │ (JWT Token)      │
            └────────┬─────────┘
                     │
     ┌───────────────▼──────────────┐
     │ Protected Routes             │
     │ (/dashboard/*)               │
     │ Require auth.uid()           │
     └───────────────┬──────────────┘
                     │
            ┌────────▼─────────┐
            │ API Requests     │
            │ Include Auth     │
            │ Context          │
            └────────┬─────────┘
                     │
            ┌────────▼─────────────┐
            │ RLS Policies        │
            │ - User can view own  │
            │ - User can edit own  │
            │ - Cascade deletes    │
            └─────────────────────┘

Current Flow (Mock Auth):
User → Can access dashboard → Can create/view trips
(Auth checks are placeholders, ready for Supabase Auth)
```

## Itinerary Generation Flow

```
User clicks "Generate with AI"
│
├─ AIGenerateDialog opens
│  └─ User selects travel style
│
├─ POST /api/trips/[id]/itineraries
│  └─ { useAI: true, travelStyle: "adventure" }
│
├─ Backend receives request
│  ├─ Verifies trip ownership
│  └─ Calls generateMockItinerary()
│
├─ AI Mock Generator
│  ├─ Takes seed from tripId
│  ├─ Generates deterministic days
│  └─ Creates 3-5 activities per day
│
├─ Database insertion
│  ├─ Insert itinerary
│  ├─ Insert days
│  └─ Batch insert activities
│
└─ Return created itinerary
   └─ Frontend displays with animations
```

## Component Hierarchy

```
<RootLayout>
  <body>
    {/* Landing Page */}
    {/* OR */}
    <DashboardLayout>
      <DashboardPage>
        <TripCard /> × N
        <NewTripDialog />
      </DashboardPage>
      {/* OR */}
      <TripDetailsPage>
        <AIGenerateDialog />
        {/* Itineraries */}
        {/* Days */}
        <ActivityCard /> × N
      </TripDetailsPage>
    </DashboardLayout>
  </body>
</RootLayout>
```

## Type Safety Flow

```
TypeScript Type Definition (types.ts)
│
├─ Database Schema (types.ts interface)
│
├─ API Response Type
│  └─ { data?: T; error?: { message: string } }
│
├─ Component Props Type
│  └─ Interface extends base type
│
└─ Runtime Validation
   └─ Zod schemas (optional future enhancement)
```

## State Management Strategy

**Current:** Client-side state with component props + API calls
**Future:** Add SWR or React Query for caching

```
User Action (e.g., click "Create Trip")
│
├─ Dialog opens
│  └─ Form state in local useState
│
├─ User submits
│  └─ Call apiClient.createTrip()
│
├─ API Response
│  ├─ Success: Close dialog, reload trips
│  └─ Error: Show error message
│
└─ UI updates
   └─ List re-renders with new trip
```

## Error Handling Strategy

```
API Route:
├─ Input validation errors → 400 Bad Request
├─ Authentication missing → 401 Unauthorized
├─ Permission denied → 403 Forbidden
├─ Resource not found → 404 Not Found
├─ Database errors → 500 Internal Server Error
└─ Return structured error: { error: { message, code } }

Frontend:
├─ Check if response.data exists
├─ If not, show response.error?.message
├─ Optionally log to monitoring service
└─ Display user-friendly error UI
```

## Performance Optimizations

```
Database:
├─ 9 indexes on frequently queried columns
├─ Normalized schema (reduces redundancy)
├─ Cascade deletes (no orphaned records)
└─ RLS policies (filters at DB level)

Frontend:
├─ Lazy component loading
├─ Loading skeletons (perceived performance)
├─ CSS animations (smooth transitions)
├─ Responsive design (mobile optimization)
└─ Tailwind CSS purging (minimal CSS)

API:
├─ Error handling at routes
├─ Input validation
├─ Single responsibility (one endpoint = one action)
└─ Proper HTTP status codes
```

## Security Layers

```
1. Transport Security
   └─ HTTPS on Vercel (automatic)

2. Authentication
   └─ Supabase Auth (JWT tokens)

3. Authorization
   └─ API route checks: getUser()

4. Database Security
   ├─ RLS Policies (enforce at DB level)
   ├─ No sensitive data in responses
   └─ Parameterized queries (prevent SQL injection)

5. Input Validation
   └─ Type checking at compile time
   └─ Runtime validation (Zod ready)

6. Environment Variables
   └─ Never expose API keys in client code
   └─ Service role key only on server
```

## Scalability Considerations

```
Current MVP (SQLite/Demo):
└─ Perfect for <1000 users

To Scale to Production:
├─ Supabase PostgreSQL (handles 1M+ users)
├─ Add pagination for large datasets
├─ Implement database connection pooling
├─ Use Vercel Edge Functions for API
├─ Add Redis caching layer (Upstash)
├─ Implement CDN for static assets
└─ Set up monitoring (Sentry, PostHog)

Future Enhancements:
├─ Serverless functions (AWS Lambda)
├─ Message queues (Bull, Bullmq)
├─ Real-time updates (WebSockets)
├─ Microservices if needed
└─ GraphQL layer (optional)
```

## Deployment Architecture

```
GitHub Repository
│
├─ Feature Branch
│  └─ Create PR
│
├─ Main Branch
│  ├─ Triggers Vercel build
│  ├─ Runs tests/linter
│  └─ Deploys to preview
│
└─ Production Deployment
   ├─ Vercel (serverless functions)
   ├─ Supabase (managed database)
   ├─ Vercel Blob (file storage)
   └─ Custom domain (DNS config)
```

## Monitoring & Debugging

```
Development:
├─ Browser DevTools (Network, Console)
├─ VS Code debugger
├─ Supabase dashboard logs
└─ console.log() statements

Production:
├─ Sentry (error tracking)
├─ Vercel Analytics (performance)
├─ PostHog (user analytics)
├─ Supabase logs (database queries)
└─ Custom dashboard (KPIs)
```

---

**Architecture Design:** February 15, 2026  
**Status:** Production-ready blueprint for MVP scaling
