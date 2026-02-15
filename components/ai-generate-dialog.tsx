'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';

interface AIGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  onSuccess?: () => void;
}

export function AIGenerateDialog({ open, onOpenChange, tripId, onSuccess }: AIGenerateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [travelStyle, setTravelStyle] = useState<'adventure' | 'relaxation' | 'cultural' | 'foodie'>('adventure');

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const response = await apiClient.createItinerary(tripId, {
        useAI: true,
        travelStyle,
      });

      if (response.data) {
        onOpenChange(false);
        onSuccess?.();
      } else {
        console.error('Error generating itinerary:', response.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate with AI</DialogTitle>
          <DialogDescription>
            Let AI create a personalized itinerary based on your travel style.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="style">Travel Style</Label>
            <Select value={travelStyle} onValueChange={(value: any) => setTravelStyle(value)}>
              <SelectTrigger id="style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="relaxation">Relaxation</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="foodie">Foodie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleGenerate} className="w-full" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Itinerary'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
