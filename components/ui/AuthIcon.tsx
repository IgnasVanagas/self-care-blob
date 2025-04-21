"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { FaUserCircle } from "react-icons/fa";

export default function AuthIcon() {
  const [user, setUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleSubmit = async () => {
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      if (error) alert(error.message);
      else alert("Check your email to confirm!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
    setShowForm(false);
  };

  return (
    <div className="absolute top-4 right-4">
      {user ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm">{user.user_metadata?.username || user.email}</span>
          <button onClick={handleLogout} title="Sign out">
            <FaUserCircle className="text-2xl text-zinc-700 dark:text-white hover:text-zinc-500" />
          </button>
        </div>
      ) : (
        <button onClick={() => setShowForm(!showForm)} title="Sign in">
          <FaUserCircle className="text-2xl text-zinc-700 dark:text-white hover:text-zinc-500" />
        </button>
      )}

      {showForm && (
        <div className="absolute right-0 mt-2 w-72 p-4 bg-white dark:bg-zinc-800 rounded shadow-lg z-50">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-2 p-2 rounded border"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-2 p-2 rounded border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-2 p-2 rounded border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="w-full py-2 rounded bg-blue-600 text-white"
          >
            {mode === "signup" ? "Sign Up" : "Log In"}
          </button>
          <p className="text-sm mt-2 text-center text-zinc-500">
            {mode === "login" ? (
              <>
                No account?{" "}
                <button onClick={() => setMode("signup")} className="underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have one?{" "}
                <button onClick={() => setMode("login")} className="underline">
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
