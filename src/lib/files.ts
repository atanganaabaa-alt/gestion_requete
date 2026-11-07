export const MAX_FILES = 5;
export const MAX_BYTES = 5 * 1024 * 1024;
export const MIN_BYTES = 1024;

const ALLOWED: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

export type UploadLike = {
  name: string;
  type: string;
  size: number;
};

export function validateUpload(file: UploadLike): string | null {
  const name = file.name.trim();
  if (!name || name.length > 64) {
    return "Le nom du fichier doit contenir entre 1 et 64 caractères.";
  }
  if (/[\\/:*?]/.test(name)) {
    return "Le nom du fichier contient un caractère interdit.";
  }
  if (file.size < MIN_BYTES) {
    return `${name} est trop petit (minimum 1 Ko).`;
  }
  if (file.size > MAX_BYTES) {
    return `${name} dépasse 5 Mo.`;
  }
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")).toLowerCase() : "";
  const allowedExt = ALLOWED[file.type];
  if (!allowedExt || !allowedExt.includes(ext)) {
    return `${name} : seuls les PDF, JPG et PNG sont acceptés.`;
  }
  return null;
}

export function validateUploads(files: UploadLike[]): string | null {
  if (files.length > MAX_FILES) {
    return "Cinq pièces maximum.";
  }
  for (const file of files) {
    const error = validateUpload(file);
    if (error) return error;
  }
  return null;
}
