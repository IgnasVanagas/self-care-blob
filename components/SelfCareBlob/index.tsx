"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getXpNeededForLevel, getTotalCustomHabitSlots } from "@/utils/leveling";
import AuthIcon from "@/components/ui/AuthIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NoteEditor from "@/components/ui/NoteEditor";
import LevelUpModal from "@/components/ui/LevelUpModal";


import BlobVisualizer from "./BlobVisualizer";
import HabitButton from "./HabitButton";
import HabitModal from "./HabitModal";
import HabitForm from "./HabitForm";
import ProgressCard from "./ProgressCard";


export default function SelfCareBlob() {
  const [user, setUser] = useState<any>(undefined);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; unlockText?: string } | null>(null);
  const [habitLog, setHabitLog] = useState<{ [key: string]: boolean }>({});
  const [customHabits, setCustomHabits] = useState<{ [key: string]: boolean }>({});
  const [newHabit, setNewHabit] = useState("");
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [confirmDeleteHabit, setConfirmDeleteHabit] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("darkMode");
      if (storedTheme !== null) {
        return storedTheme === "true"; 
      }
  
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  
  

  const xpToLevelUp = getXpNeededForLevel(level);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  useEffect(() => {
    if (user !== undefined) loadData();
  }, [user]);

  useEffect(() => {
    saveData();
  }, [xp, level, habitLog, customHabits]);

  useEffect(() => {
    const classList = document.documentElement.classList;
    if (darkMode) {
      classList.add("dark");
    } else {
      classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);
  
  

  useEffect(() => {
    if (xp >= xpToLevelUp) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setXp((prev) => prev - xpToLevelUp);
  
      let unlockText: string | undefined;
  
      if (nextLevel === 5) unlockText = "✨ You can now create 2 custom habits!";
      else if (nextLevel === 10) unlockText = "📝 Notes feature unlocked!";
      else if (nextLevel === 15) unlockText = "🎯 You can now create 4 custom habits!";
      else if (nextLevel === 20) unlockText = "🏆 You can now create 5 custom habits!";
  
      setLevelUpInfo({ level: nextLevel, unlockText });
    }
  }, [xp]);
  
  

  const loadData = async () => {
    if (user) {
      const { data, error } = await supabase
        .from("users")
        .select("xp, level, habit_log, custom_habits")
        .eq("id", user.id)
        .single();
  
      if (data) {
        setXp(data.xp ?? 0);
        setLevel(data.level ?? 1);
        setHabitLog(data.habit_log ?? { "Sleep Well": false, "Hydrated": false });
        setCustomHabits(data.custom_habits ?? {});
      }
    } else {
      const localXp = localStorage.getItem("xp");
      const localLevel = localStorage.getItem("level");
      const localHabitLog = localStorage.getItem("habitLog");
      const localCustomHabits = localStorage.getItem("customHabits");
  
      if (localXp) setXp(parseInt(localXp));
      if (localLevel) setLevel(parseInt(localLevel));
  
      if (localHabitLog) {
        const parsed = JSON.parse(localHabitLog);
        if (Object.keys(parsed).length > 0) {
          setHabitLog(parsed);
        } else {
          setHabitLog({ "Sleep Well": false, "Hydrated": false });
        }
      } else {
        setHabitLog({ "Sleep Well": false, "Hydrated": false });
      }
  
      if (localCustomHabits) setCustomHabits(JSON.parse(localCustomHabits));
    }
  };
  

  const saveData = async () => {
    if (user) {
      await supabase
        .from("users")
        .upsert({
          id: user.id,
          xp,
          level,
          habit_log: habitLog,
          custom_habits: customHabits,
        });
    } else {
      localStorage.setItem("xp", xp.toString());
      localStorage.setItem("level", level.toString());
      localStorage.setItem("habitLog", JSON.stringify(habitLog));
      localStorage.setItem("customHabits", JSON.stringify(customHabits));
    }
  };

  const logHabit = (habit: string) => {
    if (!habitLog[habit]) {
      setHabitLog((prev) => ({ ...prev, [habit]: true }));
      setXp((prev) => prev + 10);
    }
  };
  

  const logCustomHabit = (habit: string) => {
    if (!customHabits[habit]) {
      setCustomHabits((prev) => ({ ...prev, [habit]: true }));
      setXp((prev) => prev + 10);
    }
  };

  const resetHabits = () => {
    const resetStandardHabits: { [key: string]: boolean } = {};
    Object.keys(habitLog).forEach((habit) => {
      resetStandardHabits[habit] = false;
    });
  
    const resetCustom: { [key: string]: boolean } = {};
    Object.keys(customHabits).forEach((habit) => {
      resetCustom[habit] = false;
    });
  
    setHabitLog(resetStandardHabits);
    setCustomHabits(resetCustom);
  };
  

  const addCustomHabit = () => {
    const currentCustomCount = Object.keys(customHabits).length;
    const allowedCustomSlots = getTotalCustomHabitSlots(level);

    if (
      newHabit.trim() &&
      !customHabits.hasOwnProperty(newHabit.trim()) &&
      currentCustomCount < allowedCustomSlots
    ) {
      setCustomHabits((prev) => ({ ...prev, [newHabit.trim()]: false }));
      setNewHabit("");
    }
  };

  const handleRenameHabit = (oldName: string) => {
    const newName = editText.trim();
    if (!newName || customHabits.hasOwnProperty(newName)) return;
    const updated = { ...customHabits };
    updated[newName] = updated[oldName];
    delete updated[oldName];
    setCustomHabits(updated);
    setEditingHabit(null);
    setEditText("");
  };

  const handleDeleteHabit = (habit: string) => {
    const updated = { ...customHabits };
    delete updated[habit];
    setCustomHabits(updated);
    setConfirmDeleteHabit(null);
  };

  const loggedCount =
  Object.values(habitLog).filter(Boolean).length +
  Object.values(customHabits).filter(Boolean).length;

const totalHabits =
  Object.keys(habitLog).length + Object.keys(customHabits).length;

let blobState: "healthy" | "neutral" | "sick" = "sick";
if (loggedCount >= totalHabits && totalHabits > 0) {
  blobState = "healthy"; // all habits completed
} else if (loggedCount >= 1) {
  blobState = "neutral"; // at least one habit completed
} else {
  blobState = "sick"; // none completed
}


  return (
    <div className="w-full flex flex-col items-center">
      <AuthIcon />
      <div className="w-full flex justify-center items-center my-8">
      <BlobVisualizer state={blobState} animateOnHealthy={blobState === "healthy"} />

</div>




      <ProgressCard level={level} xp={xp} xpToLevelUp={xpToLevelUp} />

      <Card className="w-full max-w-md mt-4 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardContent className="p-6 space-y-5">
          <h2 className="text-lg font-semibold">Today's Self-Care</h2>

          <div className="flex flex-col gap-3">
          {Object.entries(habitLog).map(([habit, done]) => (
  <HabitButton
    key={habit}
    habit={habit}
    done={done}
    onLog={() => logHabit(habit)}
    editing={editingHabit === habit}
    editText={editText}
    setEditText={setEditText}
    onEdit={() => {
      setEditingHabit(habit);
      setEditText(habit);
    }}
    onSaveEdit={() => handleRenameHabit(habit)}
    onCancelEdit={() => setEditingHabit(null)}
    onDelete={() => setConfirmDeleteHabit(habit)}
  />
))}


            {Object.entries(customHabits).map(([habit, done]) => (
              <HabitButton
                key={habit}
                habit={habit}
                done={done}
                onLog={() => logCustomHabit(habit)}
                editing={editingHabit === habit}
                editText={editText}
                setEditText={setEditText}
                onEdit={() => {
                  setEditingHabit(habit);
                  setEditText(habit);
                }}
                onSaveEdit={() => handleRenameHabit(habit)}
                onCancelEdit={() => setEditingHabit(null)}
                onDelete={() => setConfirmDeleteHabit(habit)}
              />
            ))}
          </div>

          <HabitForm
            newHabit={newHabit}
            setNewHabit={setNewHabit}
            onAdd={addCustomHabit}
            disabled={Object.keys(customHabits).length >= getTotalCustomHabitSlots(level)}
          />
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col items-center gap-4">
        <Button variant="ghost" onClick={resetHabits}>
          Reset for Tomorrow
        </Button>

        <div className="flex items-center space-x-3">
          <label htmlFor="mode-toggle" className="text-sm">
            {darkMode ? "Dark Mode" : "Light Mode"}
          </label>
          <div
            id="mode-toggle"
            className="w-12 h-6 flex items-center bg-zinc-300 dark:bg-zinc-700 rounded-full p-1 cursor-pointer"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                darkMode ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>
        {levelUpInfo && (
  <LevelUpModal
    level={levelUpInfo.level}
    unlockText={levelUpInfo.unlockText}
    onClose={() => setLevelUpInfo(null)}
  />
)}

      </div>
      <NoteEditor user={user} level={level} />


      {confirmDeleteHabit && (
        <HabitModal
          habitName={confirmDeleteHabit}
          onCancel={() => setConfirmDeleteHabit(null)}
          onConfirm={() => handleDeleteHabit(confirmDeleteHabit)}
        />
      )}
    </div>
  );
}
