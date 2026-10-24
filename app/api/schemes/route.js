import { NextResponse } from 'next/server';
import { getPublishedSchemes } from '@/lib/schemes';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const schemes = await getPublishedSchemes();
    return NextResponse.json({ schemes });
  } catch (error) {
    console.error('Error fetching public schemes:', error);
    return NextResponse.json({ schemes: [] }, { status: 200 });
  }
}
