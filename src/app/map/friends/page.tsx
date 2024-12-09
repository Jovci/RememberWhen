import { redirect } from 'next/navigation';
import FullScreenMap from '@/components/Fullscreenmap/FullScreenMap';
import { createClient } from '@/utils/supabase/server';
import { HeaderMap } from '@/components/common/HeaderMap';

export default async function PrivateMapPage() {
  const supabase = await createClient();

  // Verify the user's session
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    redirect('/login'); // Redirect to login if no session exists
  }

  // Fetch private markers
  const { data: markers, error: markersError } = await supabase
    .from('markers')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_private', true);

  if (markersError) {
    console.error('Error fetching markers:', markersError.message);
  }

  const formattedMarkers = markers?.map((marker) => ({
    id: marker.id,
    latitude: marker.latitude,
    longitude: marker.longitude,
    media_urls: marker.media_urls || [], // Default empty array if undefined
    user_id: marker.user_id,
    is_private: marker.is_private,
  }));
  
  const headerMap = await HeaderMap({ className: '' });

  return (
    <div className="min-h-screen flex flex-col">
      {headerMap} {/* Add the map-specific header */}
      <FullScreenMap
        userId={user.id}
        initialMarkers={formattedMarkers || []} // Correctly formatted markers
        isPrivateMap={true}
      />
    </div>
  );
}
