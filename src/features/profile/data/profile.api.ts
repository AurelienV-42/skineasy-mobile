import type { UpdateProfileDto } from '@features/profile/schemas/profile.schema';
import { mapSupabaseError } from '@lib/error-mapper';
import { supabase } from '@lib/supabase';
import { uploadFile } from '@lib/upload';
import type { UserProfile } from '@shared/types/user.types';
import { compressImage } from '@shared/utils/image';

export async function updateProfile(data: UpdateProfileDto): Promise<UserProfile> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) throw new Error('common.sessionExpired');

  const { data: updated, error } = await supabase
    .from('clients')
    .update({
      first_name: data.firstname,
      last_name: data.lastname,
      birthday: data.birthday,
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw mapSupabaseError(error);

  return {
    id: updated.id,
    user_id: updated.user_id,
    email: updated.email ?? '',
    first_name: updated.first_name ?? '',
    last_name: updated.last_name ?? '',
    phone: updated.phone ?? null,
    skin_type: updated.skin_type ?? null,
    birthday: updated.birthday ?? null,
    avatar_url: updated.avatar_url ?? null,
    has_routine_access: updated.has_routine_access,
  };
}

export async function uploadAvatar(uri: string): Promise<{ avatar_url: string }> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) throw new Error('common.sessionExpired');

  const compressedUri = await compressImage(uri);
  const filename = `${Date.now()}.jpg`;
  const { publicUrl } = await uploadFile('avatars', `${userId}/${filename}`, compressedUri, {
    contentType: 'image/jpeg',
  });

  const { error } = await supabase
    .from('clients')
    .update({ avatar_url: publicUrl })
    .eq('user_id', userId);

  if (error) throw mapSupabaseError(error);

  return { avatar_url: publicUrl ?? '' };
}

export async function deleteAccount(): Promise<void> {
  const { error } = await supabase.rpc('delete_own_account');
  if (error) throw mapSupabaseError(error);
}
