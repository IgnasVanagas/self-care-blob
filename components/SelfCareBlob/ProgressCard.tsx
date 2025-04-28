import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ProgressCardProps {
  level: number;
  xp: number;
  xpToLevelUp: number;
}

export default function ProgressCard({ level, xp, xpToLevelUp }: ProgressCardProps) {
  const progressPercent = (xp / xpToLevelUp) * 100;

  return (
    <Card className="w-full max-w-md rounded-xl shadow-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 mb-6">
      <CardContent className="p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
            Level {level}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            XP: {xp}/{xpToLevelUp}
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-2 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
          <motion.div
            className="h-full bg-black dark:bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
      </CardContent>
    </Card>
  );
}