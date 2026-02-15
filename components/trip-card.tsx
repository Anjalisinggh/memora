'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trip } from '@/lib/types';
import { MapPin, Calendar } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const startDate = new Date(trip.start_date);
  const endDate = new Date(trip.end_date);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Link href={`/dashboard/trips/${trip.id}`}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full animate-fadeInUp">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-xl">{trip.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-2">
                <MapPin className="w-4 h-4" />
                {trip.destination_id ? 'Destination' : 'New trip'}
              </CardDescription>
            </div>
            {trip.is_public && <Badge variant="secondary">Public</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            {trip.description && <p>{trip.description}</p>}
            <div className="flex items-center gap-2 pt-2">
              <Calendar className="w-4 h-4" />
              <span>
                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                <span className="ml-2 font-medium">({duration} days)</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
