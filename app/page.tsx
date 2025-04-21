"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import SelfCareBlob from "@/components/SelfCareBlob";

export default function HomePage() {
  const [user, setUser] = useState<any>(undefined); // <-- undefined means "still checking"

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user || null);
    });
  }, []);

  // Optionally show a loading spinner while checking auth
  if (user === undefined) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-800 text-zinc-800 dark:text-zinc-100 transition-colors">
      <div className="max-w-xl mx-auto px-4 py-12 flex flex-col items-center justify-start">

        <SelfCareBlob />
      </div>
    </main>
  );
}
