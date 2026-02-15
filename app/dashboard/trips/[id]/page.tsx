'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityCard } from '@/components/activity-card';
import { AIGenerateDialog } from '@/components/ai-generate-dialog';
import { apiClient } from '@/lib/api-client';
import { Trip, Itinerary, Day, Activity } from '@/lib/types';
import { Sparkles, ChevronLeft, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function TripDetailsPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [itineraries, setItineraries] = useState<(Itinerary & { days?: (Day & { activities?: Activity[] })[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAIDialog, setShowAIDialog] = useState(false);

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  const loadTrip = async () => {
    setLoading(true);
    const tripResponse = await apiClient.getTrip(tripId);
    if (tripResponse.data) {
      setTrip(tripResponse.data);

      const itinerariesResponse = await apiClient.getItineraries(tripId);
      if (itinerariesResponse.data) {
        setItineraries(itinerariesResponse.data);
      }
    }
    setLoading(false);
  };

  if (loading || !trip) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-center text-slate-600">Loading trip...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 animate-slideInLeft">
          <ChevronLeft className="w-5 h-5" />
          Back to Trips
        </Link>

        {/* Trip Header */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8 animate-fadeInUp">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{trip.title}</h1>
          {trip.description && <p className="text-slate-600 mb-4">{trip.description}</p>}

          <div className="flex flex-wrap gap-6 text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{trip.title}</span>
            </div>
          </div>
        </div>

        {/* Itineraries Section */}
        <div className="space-y-6 animate-fadeInUp">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Itineraries</h2>
            <Button onClick={() => setShowAIDialog(true)} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </Button>
          </div>

          {itineraries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-600 mb-4">No itineraries yet. Create one to get started!</p>
                <Button onClick={() => setShowAIDialog(true)} variant="outline" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate AI Itinerary
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {itineraries.map((itinerary) => (
                <div key={itinerary.id} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{itinerary.title}</CardTitle>
                      {itinerary.description && <CardDescription>{itinerary.description}</CardDescription>}
                    </CardHeader>
                  </Card>

                  {/* Days and Activities */}
                  <div className="space-y-4 ml-4">
                    {itinerary.days?.map((day) => (
                      <div key={day.id} className="space-y-3">
                        <h4 className="font-semibold text-slate-900">
                          Day {day.day_number} - {new Date(day.date).toLocaleDateString()}
                        </h4>

                        <div className="grid md:grid-cols-2 gap-4">
                          {day.activities?.map((activity) => (
                            <ActivityCard key={activity.id} activity={activity} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Generate Dialog */}
      <AIGenerateDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        tripId={tripId}
        onSuccess={loadTrip}
      />
    </main>
  );
}
