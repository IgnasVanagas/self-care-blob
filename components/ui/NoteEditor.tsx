"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { FaStickyNote } from "react-icons/fa";

export default function NoteEditor({ user, level }: { user: any; level: number }) {
  const [show, setShow] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (level < 10) return; // 🔒 Skip load if locked
    const loadNote = async () => {
      if (user) {
        const res = await fetch("/api/notes/load");
        const data = await res.json();
        setNote(data.content || "");
      } else {
        setNote(localStorage.getItem("note") || "");
      }
    };
    loadNote();
  }, [user, level]);

  const saveNote = async (val: string) => {
    setNote(val);
    if (user) {
      await fetch("/api/notes/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: val }),
      });
    } else {
      localStorage.setItem("note", val);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          className={`text-3xl p-2 rounded-full shadow ${
            level >= 10 ? "bg-white dark:bg-zinc-800" : "bg-gray-300 dark:bg-zinc-700 opacity-50"
          }`}
          onClick={() => level >= 10 && setShow(true)}
          title={level >= 10 ? "Open Notes" : "Unlocks at level 10"}
        >
          <FaStickyNote />
        </button>
      </div>

      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white dark:bg-zinc-900 p-4 rounded shadow-lg w-[90%] max-w-md">
            <textarea
              className="w-full h-48 p-3 rounded border dark:border-zinc-700 bg-white dark:bg-zinc-800"
              value={note}
              onChange={(e) => saveNote(e.target.value)}
              placeholder="Write your notes here..."
            />
            <div className="flex justify-end mt-3">
              <button onClick={() => setShow(false)} className="text-sm underline">
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

