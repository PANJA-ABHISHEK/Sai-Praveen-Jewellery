import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { createScheme, getAllSchemes, normalizeSchemeInput, seedDefaultScheme } from '@/lib/schemes';

async function requireAdmin() {
  return getAdminSession();
}

export async function GET() {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let schemes = await getAllSchemes();
    if (schemes.length === 0) {
      schemes = [await seedDefaultScheme()];
    }
    return NextResponse.json({ schemes });
  } catch (error) {
    console.error('Error fetching admin schemes:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch schemes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scheme = normalizeSchemeInput(await request.json());
    if (!scheme.name || !scheme.description) {
      return NextResponse.json({ error: 'Scheme name and description are required' }, { status: 400 });
    }

    const created = await createScheme(scheme);
    return NextResponse.json({ success: true, scheme: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating scheme:', error);
    return NextResponse.json({ error: error.message || 'Failed to create scheme' }, { status: 500 });
  }
}
