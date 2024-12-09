'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseClient from '@/utils/supabase/client';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Redirect to the login page
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition duration-150 ease-in-out"
    >
      Sign Out
    </button>
  );
}
