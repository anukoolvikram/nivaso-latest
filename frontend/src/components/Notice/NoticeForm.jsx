/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import ImageUploader from '../ImageUploader/ImageUploader';
import TextEditor from '../TextEditor/TextEditor';
import PollOptions from './PollOptions';
import { PublishIcon } from '../../assets/icons/PublishIcon';
import { CrossIcon2 } from '../../assets/icons/CrossIcon';
import Dropdown from '../Dropdown/Dropdown'
import CircularProgress from '@mui/material/CircularProgress';

const NoticeForm = ({
  notice,
  onSubmit,
  onCancel,
  isSubmitting,
  noticeTypes,
  userRole
}) => {
  const isEditing = Boolean(notice?.id);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: '',
    options: [],
    images: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [confirmUpdate, setConfirmUpdate] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: notice.title || '',
        content: notice.content || notice.description || '',
        type: notice.type || '',
        options: notice.options || [],
        images: notice.images || notice.attachments || [],
      });
    }
  }, [notice, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === 'type') {
        newState.options = value.toLowerCase() === 'poll' ? [''] : [];
      }
      return newState;
    });
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleRemoveExistingImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim() || !formData.type) {
      alert('Please fill out all required fields.');
      return;
    }
    
    const submitData = {
      ...formData,
      ...(selectedImages.length > 0 && { newImages: selectedImages }),
      ...(isEditing && { id: notice.id })
    };
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black/0 font-montserrat w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray900">
            {isEditing ? 'Edit Notice' : 'Create New Notice'}
          </h2>
          <p className="text-sm text-dark-gray font-medium">
            Share important information with your society members
          </p>
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={onCancel} className="border border-gray100 p-2 rounded-lg flex items-center gap-2 hover:bg-white">
            <CrossIcon2 />
            <span className="text-gray700 font-medium">Cancel</span>
          </button>
          <button type="submit" disabled={isSubmitting || (isEditing && !confirmUpdate)} className="border bg-navy text-white p-2 rounded-lg flex items-center justify-center gap-2 w-32 hover:bg-navy/80 disabled:opacity-50">
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <>
                <PublishIcon />
                <span>{isEditing ? 'Update' : 'Publish'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Body */}
      <div className="mx-12 my-6 p-6 bg-white font-medium text-sm border border-purplegray rounded-lg space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-gray-700">Notice Title <span className="text-red-400">*</span></label>
          <input
            type="text" name="title" id="title" value={formData.title} onChange={handleInputChange}
            placeholder="Enter notice title (max 80 characters)"
            maxLength={80} required className="w-full p-2 px-4 text-gray700 border border-gray100 rounded-lg focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Notice Type Dropdown */}
        <div className="space-y-2 relative">
          <Dropdown
            label="Notice Type"
            name="type"
            placeholder="Select notice type"
            options={noticeTypes}
            value={formData.type}
            onChange={handleInputChange}
          />
        </div>

        {/* Poll Options (Conditional) */}
        {userRole === 'society' && formData.type === 'Poll' && (
          <PollOptions options={formData.options} setOptions={(opts) => setFormData((prev) => ({ ...prev, options: opts }))} />
        )}

        {/* Content Editor */}
        <div className="space-y-2">
          <label htmlFor="content" className="block text-gray-700">Notice Content <span className="text-red-400">*</span></label>
          <TextEditor value={formData.content} onChange={handleContentChange} placeholder="Write your notice content here..." />
        </div>

        {/* Image Upload */}
        <ImageUploader 
          selectedImages={selectedImages} 
          setSelectedImages={setSelectedImages}
          existingImages={formData.images}
          onRemoveExisting={handleRemoveExistingImage}
        />

        {/* Confirmation Checkbox (Conditional) */}
        {isEditing && (
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="confirmUpdate" checked={confirmUpdate} onChange={() => setConfirmUpdate((p) => !p)} className="w-4 h-4" />
            <label htmlFor="confirmUpdate" className="text-sm text-gray-700">I confirm that I want to save these changes</label>
          </div>
        )}
      </div>

      <div className="w-full flex justify-center gap-4 mt-6">
        <button
          type="submit"
          disabled={isSubmitting || (isEditing && !confirmUpdate)}
          className={`w-1/5 flex items-center justify-center py-2 rounded-lg text-white transition bg-purple hover:bg-purple/80 disabled:opacity-50`}
        >
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Publish'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-1/5 bg-my-gray py-2 text-navy border border-purplegray rounded-lg hover:bg-white transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoticeForm;