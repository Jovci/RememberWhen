import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function MapSelectionPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login'); // Redirect to login if user is not authenticated
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-6">Choose Your Map</h1>
      <div className="flex gap-4">
        <a href="/map/private" className="p-3 bg-blue-500 text-white rounded">
          Private Map
        </a>
        <a href="/map/friends" className="p-3 bg-green-500 text-white rounded">
          Friends Map
        </a>
      </div>
    </div>
  );
}
