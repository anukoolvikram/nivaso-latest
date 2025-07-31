/* eslint-disable react/prop-types */
const ImageGallery = ({ images }) => {
  return (
    <div className="mx-4 grid grid-cols-1 gap-4">
      {images.map((url, idx) => (
        <img
          key={idx}
          src={url.file_path}
          alt={`Image`}
          className="rounded-lg shadow-sm object-cover w-full h-48"
        />
      ))}
    </div>
  );
};

export default ImageGallery;