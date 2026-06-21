// R2 upload helper — used in API routes only (server-side)
// Client uploads go through /api/upload which uses this

export function getR2PublicUrl(key: string): string {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;
  return `${base}/${key}`;
}

export function generateR2Key(folder: string, filename: string): string {
  const timestamp = Date.now();
  const clean = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${folder}/${timestamp}_${clean}`;
}
