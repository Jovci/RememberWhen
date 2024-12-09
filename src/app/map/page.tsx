// src/app/map/page.tsx

'use client';

import React from 'react';
import FullScreenMap from '@/components/Fullscreenmap/FullScreenMap';

type MarkerData = {
  id: string;
  latitude: number;
  longitude: number;
  user_id: string;
  is_private: boolean;
  media_urls: string[]; // This is sufficient
};


export default function MapPage() {
  const initialMarkers: MarkerData[] = []; // Define your initial markers here
  return <FullScreenMap 
    initialMarkers={initialMarkers} 
    userId="yourUserId" 
    isPrivateMap={false} 
  />;
}
