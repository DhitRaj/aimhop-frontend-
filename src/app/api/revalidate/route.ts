import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/revalidate?tag=services&secret=REVALIDATE_SECRET
 *
 * Called by the Express backend (or admin panel) after any CUD operation
 * to invalidate the Next.js data cache for a given tag.
 *
 * Supported tags: services, banners, blogs, clients, testimonials, settings
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const tag = req.nextUrl.searchParams.get('tag');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json({ message: 'Missing tag' }, { status: 400 });
  }

  const allowedTags = ['services', 'banners', 'blogs', 'clients', 'testimonials', 'settings'];
  if (!allowedTags.includes(tag)) {
    return NextResponse.json({ message: `Unknown tag: ${tag}` }, { status: 400 });
  }

  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, tag, ts: Date.now() });
}
