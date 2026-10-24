import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadBufferToCloudinary(buffer, folder = 'skj_jewellery', resourceType = 'image') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export function getOptimizedCloudinaryUrl(publicId, resourceType = 'image') {
  return cloudinary.url(publicId, {
    secure: true,
    resource_type: resourceType,
    transformation: [
      {
        fetch_format: 'auto',
        quality: 'auto',
      },
    ],
  });
}

export default cloudinary;
