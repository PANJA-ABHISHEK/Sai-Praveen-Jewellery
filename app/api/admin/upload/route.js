import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getOptimizedCloudinaryUrl, uploadBufferToCloudinary } from '@/lib/cloudinary';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export async function POST(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const isVideo = file.type?.startsWith('video/');
    const isImage = file.type?.startsWith('image/');
    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Only image and video files are supported.' }, { status: 400 });
    }

    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `${isVideo ? 'Video' : 'Image'} must be smaller than ${isVideo ? '50 MB' : '10 MB'}.` },
        { status: 413 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const resourceType = isVideo ? 'video' : 'image';
    const uploadResult = await uploadBufferToCloudinary(buffer, 'skj_jewellery', resourceType);
    const deliveryUrl = isImage
      ? getOptimizedCloudinaryUrl(uploadResult.public_id, resourceType)
      : uploadResult.secure_url;

    return NextResponse.json({
      success: true,
      url: deliveryUrl,
      originalUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image to Cloudinary' },
      { status: 500 }
    );
  }
}
