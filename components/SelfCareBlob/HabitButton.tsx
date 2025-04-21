import { Button } from "@/components/ui/button";

interface HabitButtonProps {
  habit: string;
  done: boolean;
  onLog: () => void;
  onEdit: () => void;
  onDelete: () => void;
  editing: boolean;
  editText: string;
  setEditText: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export default function HabitButton({
  habit,
  done,
  onLog,
  onEdit,
  onDelete,
  editing,
  editText,
  setEditText,
  onSaveEdit,
  onCancelEdit,
}: HabitButtonProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      {editing ? (
        <>
          <input
            className="flex-1 px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 transition"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <Button size="sm" onClick={onSaveEdit}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancelEdit}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button
            className={`flex-1 justify-start px-4 py-2 rounded-md text-sm font-medium transition-all border border-zinc-300 dark:border-zinc-700 ${
              done ? "opacity-60 line-through" : ""
            }`}
            variant="ghost"
            onClick={onLog}
          >
            {habit}
          </Button>
          <Button size="sm" variant="ghost" onClick={onEdit} aria-label="Edit">
            ✏️
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete} aria-label="Delete">
            🗑️
          </Button>
        </>
      )}
    </div>
  );
}
