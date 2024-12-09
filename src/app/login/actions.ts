'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { email, password } = Object.fromEntries(formData.entries()) as {
    email: string;
    password: string;
  };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect('/error'); // Redirect to an error page if login fails
  }

  const { user } = data;

  if (user) {
    // Save user data in the session store (cookies/local storage if needed)
    return {
      id: user.id,
      email: user.email,
    };
  }

  redirect('/map-selection'); // Redirect to map selection page on success
}
