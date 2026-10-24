import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getSiteSettings, saveSiteSettings } from '@/lib/site-settings';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const settings = await getSiteSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching admin site settings:', error);
    return NextResponse.json({ error: error.message || 'Could not load settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const settings = await saveSiteSettings(body, session.username || 'admin');

    return NextResponse.json({
      success: true,
      settings,
      message: 'Store settings saved successfully.',
    });
  } catch (error) {
    console.error('Error saving site settings:', error);
    return NextResponse.json({ error: error.message || 'Could not save settings' }, { status: 500 });
  }
}
