/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import ImageUploader from '../ImageUploader/ImageUploader';
import TextEditor from '../TextEditor/TextEditor';
import PollOptions from './PollOptions';
import { PublishIcon } from '../../assets/icons/PublishIcon';
import { CrossIcon2 } from '../../assets/icons/CrossIcon';
import Dropdown from '../Dropdown/Dropdown';
import CircularProgress from '@mui/material/CircularProgress';

const NoticeForm = ({
  notice,
  onSubmit,
  onCancel,
  onFormDataChange,
  isSubmitting,
  noticeTypes,
  userRole,
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
  const hasUnsavedChanges = useRef(false);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (isEditing && notice) {
      setFormData({
        id: notice.id,
        title: notice.title || '',
        content: notice.content || '',
        type: notice.type || '',
        options: notice.poll_options || notice.options || [],
        images: notice.images || notice.attachments || [],
      });
    }
    initialLoadRef.current = false;
  }, [notice, isEditing]);

  // Notify parent component of form changes
  useEffect(() => {
    if (!initialLoadRef.current) {
      const hasContent = !!(formData.title?.trim() || formData.content?.trim());
      hasUnsavedChanges.current = hasContent;
      
      if (onFormDataChange) {
        onFormDataChange({
          ...formData,
          id: notice?.id, // Pass the notice ID for updates
        });
      }
    }
  }, [formData, notice?.id, onFormDataChange]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'type') updated.options = value.toLowerCase() === 'poll' ? [''] : [];
      return updated;
    });
  };

  const handleContentChange = (content) => setFormData((p) => ({ ...p, content }));

  const handleRemoveExistingImage = (i) => {
    setFormData((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim() || !formData.type) {
      alert('Please fill out all required fields.');
      return;
    }
    const submitData = {
      ...formData,
      ...(selectedImages.length > 0 && { newImages: selectedImages }),
      ...(isEditing && { id: notice.id }),
    };
    hasUnsavedChanges.current = false;
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black/0 font-montserrat w-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray900">{isEditing ? 'Edit Notice' : 'Create New Notice'}</h2>
          <p className="text-sm text-dark-gray font-medium">Share important information with your society members</p>
          {hasUnsavedChanges.current && (
            <p className="text-sm text-blue-600 font-medium mt-1">• You have unsaved changes (auto-saved as draft)</p>
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray100 p-2 rounded-lg flex items-center gap-2 hover:bg-white"
          >
            <CrossIcon2 />
            <span className="text-gray700 font-medium">Cancel</span>
          </button>
          <button type="submit" disabled={isSubmitting || (isEditing && !confirmUpdate)} className="border bg-navy text-white p-2 rounded-lg flex items-center justify-center gap-2 w-32 hover:bg-navy/80 disabled:opacity-50">
            {isSubmitting ? 
            <CircularProgress size={20} color="inherit" /> 
            : (<><PublishIcon /><span>{isEditing ? 'Update' : 'Publish'}</span></>)}
          </button>
        </div>
      </div>

      <div className="mx-12 my-6 p-6 bg-white font-medium text-sm border border-purplegray rounded-lg space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-gray-700">Notice Title <span className="text-red-400">*</span></label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} placeholder="Enter notice title" maxLength={80} className="w-full p-2 px-4 border border-gray100 rounded-lg" />
        </div>

        <Dropdown label="Notice Type" name="type" placeholder="Select notice type" options={noticeTypes} value={formData.type} onChange={handleInputChange} />

        {userRole === 'society' && formData.type === 'Poll' && (
          <PollOptions options={formData.options} setOptions={(opts) => setFormData((p) => ({ ...p, options: opts }))} />
        )}

        <div className="space-y-2">
          <label htmlFor="content" className="block text-gray-700">Notice Content <span className="text-red-400">*</span></label>
          <TextEditor value={formData.content} onChange={handleContentChange} placeholder="Write your notice content here..." />
        </div>

        <ImageUploader selectedImages={selectedImages} setSelectedImages={setSelectedImages} existingImages={formData.images} onRemoveExisting={handleRemoveExistingImage} />

        {isEditing && (
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="confirmUpdate" checked={confirmUpdate} onChange={() => setConfirmUpdate((p) => !p)} className="w-4 h-4" />
            <label htmlFor="confirmUpdate" className="text-sm text-gray-700">I confirm that I want to save these changes</label>
          </div>
        )}
      </div>
    </form>
  );
};

export default NoticeForm;