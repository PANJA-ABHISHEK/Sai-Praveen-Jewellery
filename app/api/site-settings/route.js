import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/site-settings';
import { DEFAULT_SITE_SETTINGS } from '@/data/siteSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching public site settings:', error);
    return NextResponse.json({ settings: DEFAULT_SITE_SETTINGS });
  }
}
