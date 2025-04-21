'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else location.reload();
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Check your email to confirm signup!');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    location.reload();
  };

  if (user) {
    return (
      <div className="mb-6 text-center">
        <p className="mb-2">Signed in as <strong>{user.email}</strong></p>
        <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded">Sign Out</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-3 mb-6">
      <input
        type="email"
        placeholder="Email"
        className="w-full px-3 py-2 border rounded"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-3 py-2 border rounded"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-2">
        <button onClick={handleSignIn} className="flex-1 bg-blue-600 text-white py-2 rounded">Sign In</button>
        <button onClick={handleSignUp} className="flex-1 bg-green-600 text-white py-2 rounded">Sign Up</button>
      </div>
    </div>
  );
}
