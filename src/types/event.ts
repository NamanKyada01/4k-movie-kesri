export type EventType = 'shoot' | 'consult' | 'edit' | 'deliver';

export type EventStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface OrbitalEvent {
  id?: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: EventType;
  status: EventStatus;
  time: string; // HH:MM
  dur: string; // e.g. "2h", "4h"
  value?: number;
  category?: 'Weddings' | 'Corporate' | 'Portraits' | 'Events';
  description?: string;
  clientName?: string;
}

export interface MetricCardData {
  label: string;
  value: string | number;
  subText: string;
  progress: number; // 0-100
  delta?: string;
  color?: string;
}
