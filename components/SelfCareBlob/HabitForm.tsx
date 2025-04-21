import { Button } from "@/components/ui/button";

interface HabitFormProps {
  newHabit: string;
  setNewHabit: (value: string) => void;
  onAdd: () => void;
  disabled: boolean;
}

export default function HabitForm({ newHabit, setNewHabit, onAdd, disabled }: HabitFormProps) {
  return (
    <div className="flex gap-2 mt-4">
      <input
        type="text"
        placeholder="New habit"
        value={newHabit}
        onChange={(e) => setNewHabit(e.target.value)}
        className="flex-1 px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-500 transition"
      />
      <Button
        onClick={onAdd}
        disabled={disabled}
        className="px-4 py-2 rounded-md"
      >
        Add
      </Button>
    </div>
  );
}
