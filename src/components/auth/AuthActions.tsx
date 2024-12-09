// src/components/auth/AuthActions.tsx
'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function AuthActions() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    if (email && password) {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        alert(`Login failed: ${error.message}`);
      } else {
        alert('Login successful!');
      }
    }
  };

  const handleSignUp = async () => {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    if (email && password) {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        alert(`Sign up failed: ${error.message}`);
      } else {
        alert('Sign up successful! Check your email for confirmation.');
      }
    }
  };

  return { handleLogin, handleSignUp, loading };
}
