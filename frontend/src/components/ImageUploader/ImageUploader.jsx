import PropTypes from 'prop-types';
import { useToast } from '../../context/ToastContext';

const ImageUploader = ({ selectedImages, setSelectedImages, existingImages = [], onRemoveExisting }) => {
  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const showToast = useToast();

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    const validFiles = files.filter(file => {
      if (file.size > MAX_SIZE_BYTES) {
        showToast(`File "${file.name}" exceeds ${MAX_SIZE_MB}MB limit`, 'error');
        return false;
      }
      return true;
    });

    setSelectedImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    if (onRemoveExisting) {
      onRemoveExisting(index);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Attach Images (Optional)
      </label>
      
      <div 
        className="flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleImageSelect({ target: { files: e.dataTransfer.files } });
        }}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />
        
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4 flex flex-col text-sm text-gray-600">
            <span className="font-medium">Drag and drop your image here, or browse</span>
            <span className="mt-1">PNG, JPG up to {MAX_SIZE_MB}MB</span>
          </div>
        </div>
      </div>

      {/* Preview Thumbnails */}
      {(existingImages.length > 0 || selectedImages.length > 0) && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {existingImages.map((imageUrl, index) => (
            <div key={`existing-${index}`} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                <img 
                  src={imageUrl.file_path} 
                  alt={`Existing ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeExistingImage(index);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          
          {/* Newly Selected Images */}
          {selectedImages.map((file, index) => (
            <div key={`new-${index}`} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* File Info */}
              <div className="mt-1 text-xs text-gray-500 truncate">
                {file.name.substring(0, 20)}{file.name.length > 20 ? '...' : ''}
              </div>
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default ImageUploader;