'use client';

import { login } from './actions';
import { useUser } from '@/app/context/UserContext'; // Use UserContext
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { setUser } = useUser(); // Access setUser from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
  
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
  
    try {
      const user = await login(formData);
      console.log('User after login:', user); // Log the user object after login
      setUser({ ...user, email: user.email || '' });
      router.push('/map-selection');
    } catch (err: any) {
      console.error('Login error:', err); // Log any error during login
      setError(err.message || 'Login failed. Please try again.');
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 border"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 p-2 border"
      />
      <button onClick={handleLogin} className="p-2 bg-blue-500 text-white">
        Login
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
