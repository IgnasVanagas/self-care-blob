import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { xp, level, habitLog, customHabits } = await req.json();

  const { error } = await supabase
    .from('user_state')
    .upsert([
      {
        user_id: user.id,
        xp,
        level,
        habit_log: habitLog,
        custom_habits: customHabits
      }
    ]);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
