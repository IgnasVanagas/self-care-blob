export function getXpNeededForLevel(level: number): number {
    if (level === 1) return 30;
    return 30 + 20 * (level - 1);
  }
  
  export function getTotalCustomHabitSlots(level: number): number {
    const totalHabits = 3 + Math.floor(level / 5); // 2 fixed + 1 starting custom
    return totalHabits - 2;
  }
  