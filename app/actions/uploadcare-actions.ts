'use server';

import { deleteFile } from '@uploadcare/rest-client';
import { UploadcareSimpleAuthSchema } from '@uploadcare/rest-client';

const authSchema = new UploadcareSimpleAuthSchema({
  publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
  secretKey: process.env.UPLOADCARE_SECRET_KEY!,
});

export async function deleteFileFromUploadcare(uuid: string) {
  if (!uuid) return { success: false, error: 'No file UUID provided.' };

  try {
    await deleteFile({ uuid }, { authSchema });
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete file from Uploadcare:', error);
    return { success: false, error: error.message };
  }
}
