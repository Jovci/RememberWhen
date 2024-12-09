'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './FullScreenMap.module.css';
import MapContainer from './MapContainer';
import Sidebar from './Sidebar';
import getSupabaseClient from '@/utils/supabase/client';

interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  media_urls: string[];
  user_id: string;
  is_private: boolean;
  name?: string; // Add name if needed
}


interface FullScreenMapProps {
  initialMarkers: MarkerData[];
  userId: string;
  isPrivateMap: boolean;
  onUploadPhoto?: (markerId: string, file: File) => void; // Optional and separate
}


export default function FullScreenMap({
  initialMarkers,
  userId,
  isPrivateMap,
}: FullScreenMapProps) {
  const [markers, setMarkers] = useState<MarkerData[]>(initialMarkers);
  const [placementMode, setPlacementMode] = useState<boolean>(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null); // Track selected marker
  const supabase = getSupabaseClient();

  // Real-time marker updates
  useEffect(() => {
    const fetchMarkers = async () => {
      // Fetch markers with `name` field from Supabase on initial load
      const { data, error } = await supabase
        .from('markers')
        .select('id, longitude, latitude, user_id, is_private, media_urls, name'); // Ensure 'name' is included
  
      if (error) {
        console.error('Error fetching markers:', error.message);
        return;
      }
  
      setMarkers((data || []).map(marker => ({
        ...marker,
        onUploadPhoto: () => {} // Provide a default onUploadPhoto function
      }))); // Initialize markers with fetched data
    };
  
    fetchMarkers();
  
    const channel = supabase
      .channel('realtime:markers')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'markers' },
        (payload) => {
          setMarkers((prevMarkers) => {
            if (payload.eventType === 'INSERT') {
              if (prevMarkers.find((marker) => marker.id === (payload.new as MarkerData).id)) {
                return prevMarkers;
              }
              return [...prevMarkers, payload.new as MarkerData];
            } else if (payload.eventType === 'DELETE') {
              return prevMarkers.filter((marker) => marker.id !== (payload.old as MarkerData).id);
            } else if (payload.eventType === 'UPDATE') {
              return prevMarkers.map((marker) =>
                marker.id === (payload.new as MarkerData).id ? (payload.new as MarkerData) : marker
              );
            }
            return prevMarkers;
          });
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  
//yay

  const addMarker = useCallback(
    async (marker: MarkerData) => {
      const newMarker = {
        ...marker,
        user_id: userId, // Use the actual userId passed to the component
        media_urls: [],
      };
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  
      const { error } = await supabase.from('markers').insert([newMarker]);
  
      if (error) {
        console.error('Error adding marker:', error.message);
      }
    },
    [supabase, userId]
  );
  

  const updateMarkerName = async (id: string, newName: string) => {
    // Update frontend state
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === id ? { ...marker, name: newName } : marker
      )
    );
  
    // Persist to database
    const { error } = await supabase
      .from('markers')
      .update({ name: newName }) // Update the name column
      .eq('id', id);
  
    if (error) {
      console.error('Error updating marker name in database:', error.message);
    }
  };


  const deleteMarker = async (id: string) => {
    setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== id));

    const { error } = await supabase.from('markers').delete().eq('id', id);

    if (error) {
      console.error('Error deleting marker:', error.message);
    }
  };

  const togglePlacementMode = () => {
    setPlacementMode((prev) => !prev);
  };

  const handleMarkerClick = (markerId: string) => {
    setSelectedMarkerId(markerId); // Highlight marker in the sidebar
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar
        markers={markers}
        selectedMarkerId={selectedMarkerId}
        onDelete={deleteMarker}
        onTogglePlacement={togglePlacementMode}
        placementMode={placementMode}
        onUploadPhoto={() => {}}
        onUpdateMarkerName={updateMarkerName}
      />
      <MapContainer
        markers={markers}
        onAddMarker={addMarker}
        userId={userId}
        isPrivateMap={isPrivateMap}
        placementMode={placementMode}
        onMarkerClick={handleMarkerClick}
      />
    </div>
  );
}
