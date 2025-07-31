export const uploadFileToCloudinary = async (file) => {
  const VITE_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const VITE_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!VITE_CLOUD_NAME || !VITE_UPLOAD_PRESET) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', VITE_UPLOAD_PRESET);

  const url = `https://api.cloudinary.com/v1_1/${VITE_CLOUD_NAME}/raw/upload`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Cloudinary upload failed.');
  }
  return data.secure_url;
};