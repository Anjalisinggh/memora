'use client';

import { Activity } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onDelete?: (id: string) => void;
}

const categoryColors: Record<Activity['category'], string> = {
  transportation: 'bg-blue-100 text-blue-800',
  accommodation: 'bg-purple-100 text-purple-800',
  attraction: 'bg-green-100 text-green-800',
  dining: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

export function ActivityCard({ activity, onDelete }: ActivityCardProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-300 hover:border-slate-400 animate-fadeInUp">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{activity.title}</CardTitle>
          <Badge className={categoryColors[activity.category]}>
            {activity.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {activity.description && (
          <p className="text-sm text-muted-foreground">{activity.description}</p>
        )}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {activity.start_time} - {activity.end_time}
            </span>
          </div>
          {activity.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{activity.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
