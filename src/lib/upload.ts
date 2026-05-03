import { mapSupabaseError } from '@lib/error-mapper';
import { supabase } from '@lib/supabase';

interface UploadOptions {
  contentType?: string;
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  path: string;
  publicUrl?: string;
}

const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 500;

async function uriToArrayBuffer(uri: string): Promise<ArrayBuffer> {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error(`Failed to fetch local file: status ${response.status}`);
  }
  return response.arrayBuffer();
}

async function attempt(
  bucket: string,
  path: string,
  body: ArrayBuffer,
  contentType: string,
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, body, { contentType, upsert: true });
  if (error) throw mapSupabaseError(error);
}

export async function uploadFile(
  bucket: string,
  path: string,
  fileUri: string,
  options: UploadOptions = {},
): Promise<UploadResult> {
  const { contentType = 'image/jpeg', onProgress } = options;

  const body = await uriToArrayBuffer(fileUri);
  if (body.byteLength === 0) throw new Error('common.error');

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      onProgress?.(0);
      await attempt(bucket, path, body, contentType);
      onProgress?.(1);

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(path);

      return { path, publicUrl: publicUrl || undefined };
    } catch (err) {
      const isLast = i === MAX_ATTEMPTS - 1;
      if (isLast) throw err;
      await new Promise((r) => setTimeout(r, BASE_DELAY_MS * 2 ** i));
    }
  }

  throw new Error('common.error');
}
