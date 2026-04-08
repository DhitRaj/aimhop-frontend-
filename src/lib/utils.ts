export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  
  // If it's already a full URL (Cloudinary, S3, etc.), return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Otherwise, prepend the API Base URL
  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  
  // Ensure the path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${API_BASE}${cleanPath}`;
}
