import type { Attachment } from '../domain/models';
export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export async function readAttachment(file: File): Promise<Attachment> {
  if (file.size > MAX_FILE_SIZE) throw new Error('Choose a file smaller than 2 MB.');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, size: file.size, dataUrl: String(reader.result) });
    reader.onerror = () => reject(new Error('This file could not be read. Please try again.'));
    reader.readAsDataURL(file);
  });
}
