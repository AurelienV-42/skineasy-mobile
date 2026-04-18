import { supabase } from '@lib/supabase';

export async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('common.sessionExpired');
  return user.id;
}
