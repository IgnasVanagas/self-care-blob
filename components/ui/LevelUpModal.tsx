"use client";

import { motion } from "framer-motion";

export default function LevelUpModal({
  level,
  unlockText,
  onClose,
}: {
  level: number;
  unlockText?: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg max-w-sm w-full text-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <h2 className="text-2xl font-bold mb-2">🎉 Level Up!</h2>
        <p className="text-lg">You're now level {level}!</p>
        {unlockText && (
          <p className="text-sm text-green-500 mt-2">{unlockText}</p>
        )}
        <button
          className="mt-4 text-sm underline text-zinc-600 dark:text-zinc-300"
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
