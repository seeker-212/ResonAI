import { supabase } from "./supabase";
import { env } from "./env";

type UploadAudioOptions = {
  buffer: Buffer;
  key: string;
  contentType?: string;
};

export async function uploadAudio({
  buffer,
  key,
  contentType = "audio/wav",
}: UploadAudioOptions): Promise<void> {
  const { error } = await supabase.storage
    .from(env.SUPABASE_BUCKET_NAME)
    .upload(key, buffer, {
      contentType,
      upsert: false,
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(`Failed to upload audio: ${error.message}`);
  }
}

export async function deleteAudio(key: string): Promise<void> {
  const { error } = await supabase.storage
    .from(env.SUPABASE_BUCKET_NAME)
    .remove([key]);

  if (error) {
    throw new Error(`Failed to delete audio: ${error.message}`);
  }
}

export async function getSignedAudioUrl(
  key: string,
  expiresIn = 60 * 60,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(env.SUPABASE_BUCKET_NAME)
    .createSignedUrl(key, expiresIn);

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

export async function audioExists(key: string): Promise<boolean> {
  const { data, error } = await supabase.storage
    .from(env.SUPABASE_BUCKET_NAME)
    .list(key.split("/").slice(0, -1).join("/"), {
      search: key.split("/").pop(),
    });

  if (error) {
    return false;
  }

  return data.length > 0;
}

export async function replaceAudio({
  buffer,
  key,
  contentType = "audio/wav",
}: UploadAudioOptions): Promise<void> {
  const { error } = await supabase.storage
    .from(env.SUPABASE_BUCKET_NAME)
    .upload(key, buffer, {
      contentType,
      upsert: true,
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(`Failed to replace audio: ${error.message}`);
  }
}
