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
        const { data, error } = await supabase
          .from("user_notes")
          .select("content")
          .eq("user_id", user.id)
          .single();

        if (data && !error) {
          setNote(data.content || "");
        }
      } else {
        setNote(localStorage.getItem("note") || "");
      }
    };
    loadNote();
  }, [user, level]);

  const saveNote = async (val: string) => {
    setNote(val);

    if (user) {
      await supabase
        .from("user_notes")
        .upsert({ user_id: user.id, content: val });
    } else {
      localStorage.setItem("note", val);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          className={`text-3xl p-2 rounded-full shadow transition ${
            level >= 10 ? "bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700" : "bg-gray-300 dark:bg-zinc-700 opacity-50 cursor-not-allowed"
          }`}
          onClick={() => level >= 10 && setShow(true)}
          title={level >= 10 ? "Open Notes" : "Unlocks at level 10"}
        >
          <FaStickyNote />
        </button>
      </div>

      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-2xl w-[90%] max-w-md space-y-4">
            <textarea
              className="w-full h-48 p-4 rounded-lg border dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
              value={note}
              onChange={(e) => saveNote(e.target.value)}
              placeholder="Write your notes here..."
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShow(false)}
                className="text-sm underline text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
