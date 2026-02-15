'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TripCard } from '@/components/trip-card';
import { NewTripDialog } from '@/components/new-trip-dialog';
import { apiClient } from '@/lib/api-client';
import { Trip } from '@/lib/types';
import { Plus } from 'lucide-react';
import { TripCardSkeleton } from '@/components/loading-skeleton';

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    const response = await apiClient.getTrips();
    if (response.data) {
      setTrips(response.data);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Your Trips</h1>
            <p className="text-slate-600 mt-2">Plan, organize, and explore your adventures</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2" size="lg">
            <Plus className="w-5 h-5" />
            New Trip
          </Button>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <TripCardSkeleton key={i} />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-600 mb-4">No trips yet. Create your first one!</p>
              <Button onClick={() => setDialogOpen(true)} variant="outline">
                Create a Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>

      {/* New Trip Dialog */}
      <NewTripDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={loadTrips} />
    </main>
  );
}
