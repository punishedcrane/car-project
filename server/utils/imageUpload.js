// utils/imageUpload.js
import cloudinary from '../config/cloudinaryConfig.js';
import { Readable } from 'stream';

export const uploadToCloudinary = (buffer, folder = 'car-rental/vehicles') => {
  return new Promise((resolve, reject) => {
    const stream = Readable.from(buffer);
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
    stream.pipe(uploadStream);
  });
};