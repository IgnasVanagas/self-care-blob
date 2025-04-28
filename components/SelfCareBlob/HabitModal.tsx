import { Button } from "@/components/ui/button";

interface HabitModalProps {
  habitName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function HabitModal({ habitName, onCancel, onConfirm }: HabitModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl w-full max-w-sm p-6 transition-all">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          Delete Habit?
        </h3>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6 text-sm leading-relaxed">
          Are you sure you want to delete <strong>{habitName}</strong>? This action can’t be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
  className="bg-red-500 hover:bg-red-600 text-white"
  onClick={onConfirm}
>
  Delete
</Button>

        </div>
      </div>
    </div>
  );
}
