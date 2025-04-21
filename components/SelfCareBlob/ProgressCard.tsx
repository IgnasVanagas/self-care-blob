import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressCardProps {
  level: number;
  xp: number;
  xpToLevelUp: number;
}

export default function ProgressCard({ level, xp, xpToLevelUp }: ProgressCardProps) {
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
        <Progress value={(xp / xpToLevelUp) * 100} className="h-3 rounded-full" />
      </CardContent>
    </Card>
  );
}
