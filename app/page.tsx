"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function SelfCareBlob() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [habitLog, setHabitLog] = useState({ sleep: false, water: false, movement: false });
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    const classList = document.documentElement.classList;
    if (darkMode) {
      classList.add("dark");
    } else {
      classList.remove("dark");
    }
  }, [darkMode]);

  const xpToLevelUp = level * 100;

  useEffect(() => {
    if (xp >= xpToLevelUp) {
      setLevel((prev) => prev + 1);
      setXp((prev) => prev - xpToLevelUp);
    }
  }, [xp]);

  const logHabit = (habit: keyof typeof habitLog) => {
    if (!habitLog[habit]) {
      setHabitLog((prev) => ({ ...prev, [habit]: true }));
      setXp((prev) => prev + 10);
    }
  };

  const resetHabits = () => {
    setHabitLog({ sleep: false, water: false, movement: false });
  };

  const loggedCount = Object.values(habitLog).filter(Boolean).length;
  const blobState = loggedCount === 3 ? "healthy" : loggedCount === 0 ? "sick" : "neutral";

  const blobVisuals = {
    healthy: {
      gradient: ["#A9F1DF", "#FFBBBB"],
      emoji: "😊"
    },
    neutral: {
      gradient: ["#E0C3FC", "#8EC5FC"],
      emoji: "😐"
    },
    sick: {
      gradient: ["#C1C1C1", "#A1A1A1"],
      emoji: "😷"
    }
  };

  const blob = blobVisuals[blobState];

  return (
    <div>
      <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white flex flex-col items-center justify-center p-6 transition-colors">
        <motion.h1
          className="text-4xl font-bold mb-6 text-center tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Self-Care Companion
        </motion.h1>

        <motion.svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="mb-10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <defs>
            <radialGradient id="circleGradient" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor={blob.gradient[0]} />
              <stop offset="100%" stopColor={blob.gradient[1]} />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="url(#circleGradient)" />
          <text
            x="100"
            y="115"
            textAnchor="middle"
            fontSize="40"
          >
            {blob.emoji}
          </text>
        </motion.svg>

        <Card className="w-full max-w-md mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between mb-2">
              <span className="text-lg font-semibold">Level {level}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">XP: {xp}/{xpToLevelUp}</span>
            </div>
            <Progress value={(xp / xpToLevelUp) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-medium mb-2">Today's Self-Care</h2>
            <div className="flex flex-col space-y-3">
              <Button className="w-full" variant={habitLog.sleep ? "secondary" : "default"} onClick={() => logHabit("sleep")}>Slept Well</Button>
              <Button className="w-full" variant={habitLog.water ? "secondary" : "default"} onClick={() => logHabit("water")}>Hydrated</Button>
              <Button className="w-full" variant={habitLog.movement ? "secondary" : "default"} onClick={() => logHabit("movement")}>Moved Body</Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-col items-center gap-4">
          <Button variant="ghost" onClick={resetHabits}>Reset for Tomorrow</Button>

          <div className="flex items-center space-x-3">
            <label htmlFor="mode-toggle" className="text-sm">{darkMode ? "Dark Mode" : "Light Mode"}</label>
            <div
              id="mode-toggle"
              className={`w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 cursor-pointer transition-colors`}
              onClick={() => setDarkMode(prev => !prev)}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${darkMode ? "translate-x-6" : "translate-x-0"}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}