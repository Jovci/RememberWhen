import mapboxgl from 'mapbox-gl';

export function createMarker(map: mapboxgl.Map, lng: number, lat: number) {
  return new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
}

export function deleteMarker(marker: mapboxgl.Marker) {
  marker.remove();
}
