'use client';

import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './MapContainer.module.css';
import { v4 as uuidv4 } from 'uuid';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam92Y2kiLCJhIjoiY2x2dWVzNzU2MWphdDJ3bzZ0NDh6dmR5ZiJ9.T8BAscTbUkJhCBTnq1_iSQ';

interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  media_urls: string[];
  user_id: string;
  is_private: boolean;
  name?: string; // Add name if needed
}


interface MapContainerProps {
  markers: MarkerData[];
  onAddMarker: (marker: MarkerData) => Promise<void>;
  userId: string;
  isPrivateMap: boolean;
  placementMode: boolean;
  onMarkerClick: (markerId: string) => void; // Notify parent of marker click
}

const MapContainer: React.FC<MapContainerProps> = ({
  markers,
  onAddMarker,
  placementMode,
  onMarkerClick,
  userId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  //yay
  // Initialize the map
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/jovci/clxbm0ukj024301pohxdx4u98',
      center: [-95.7129, 37.0902],
      zoom: 3,
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current
      .getContainer()
      .querySelectorAll('.mapboxgl-marker')
      .forEach((marker) => marker.remove());

    markers.forEach((marker) => {
      const mapMarker = new mapboxgl.Marker()
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(mapRef.current!);

      mapMarker.getElement().addEventListener('click', () => {
        onMarkerClick(marker.id); 
      });
    });
  }, [markers, onMarkerClick]);

  useEffect(() => {
    if (!mapRef.current) return;

    const handleMapClick = async (event: mapboxgl.MapMouseEvent) => {
      if (!placementMode) return;
    
      const { lng, lat } = event.lngLat;
      const markerId = uuidv4();
    
      const newMarker: MarkerData = {
        id: markerId,
        longitude: lng,
        latitude: lat,
        user_id: userId, // Use the actual userId prop
        is_private: true,
        media_urls: [],
        name: `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`,
      };
    
      await onAddMarker(newMarker);
    };
    

    mapRef.current.on('click', handleMapClick);

    return () => {
      mapRef.current?.off('click', handleMapClick);
    };
  }, [onAddMarker, placementMode]);

  return <div ref={mapContainerRef} className={styles.mapContainer}></div>;
};

export default MapContainer;
