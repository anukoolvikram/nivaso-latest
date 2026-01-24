/* eslint-disable react/prop-types */
import { useState } from 'react';
import ImageUploader from '../ImageUploader/ImageUploader';
import { CrossIcon2 } from '../../assets/icons/CrossIcon';
import { PublishIcon } from '../../assets/icons/PublishIcon';
import TextEditor from '../TextEditor/TextEditor';
import { CircularProgress } from '@mui/material';

const TAGS = ['Event', 'Buy & Sell', 'Awareness', 'Advertisement'];

const BlogForm = ({ blog, onSubmit, onCancel, isSubmitting }) => {
    const isEditing = Boolean(blog?.id);
    const [title, setTitle] = useState(blog?.title || '');
    const [content, setContent] = useState(blog?.content || '');
    const [selectedTags, setSelectedTags] = useState(blog?.tags ? blog.tags.map(tag => tag.name) : []);
    const [selectedImages, setSelectedImages] = useState([]);
    const [existingImages, setExistingImages] = useState(blog?.attachments?.map(a => a) || []);
    const [confirmUpdate, setConfirmUpdate] = useState(false);

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleRemoveExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || selectedTags.length === 0) {
            return;
        }
        onSubmit({
            title,
            content,
            tags: selectedTags,
            existingImages,
            newImages: selectedImages
        });
    };

    const isDisabled = !title.trim() || !content.trim() || selectedTags.length === 0 || isSubmitting || (isEditing && !confirmUpdate);

    return (
        <form onSubmit={handleSubmit} className="w-full pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-medium text-navy-dark">
                        {isEditing ? 'Update Blog' : 'New Blog'}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                        Share your thoughts with the community
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="flex-1 md:flex-none px-5 py-3 border border-gray-200 bg-white rounded-xl font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                    >
                        <CrossIcon2 /> Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isDisabled} 
                        className="flex-1 md:flex-none px-8 py-3 bg-navy text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-navy/20 hover:bg-navy-dark disabled:opacity-50 transition"
                    >
                        {isSubmitting ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <>
                                <PublishIcon /> {isEditing ? 'Update' : 'Post'}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="bg-white p-5 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                        Blog Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Community Garden Initiative"
                        maxLength={100}
                        required
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy/10 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500">{title.length}/100 characters</p>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                        Tags * <span className="text-gray-500 font-normal">(Select at least one)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {TAGS.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                                    selectedTags.includes(tag)
                                        ? 'bg-navy text-white border-navy shadow-md shadow-navy/20'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-navy/30 hover:bg-navy/5'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                        Blog Content *
                    </label>
                    <div className="min-h-[250px]">
                        <TextEditor
                            value={content}
                            onChange={(newContent) => setContent(newContent)}
                            placeholder="Write your blog content here..."
                        />
                    </div>
                </div>

                {/* Image Uploader */}
                <ImageUploader
                    selectedImages={selectedImages}
                    setSelectedImages={setSelectedImages}
                    existingImages={existingImages}
                    onRemoveExisting={handleRemoveExistingImage}
                />

                {/* Confirmation Checkbox for Editing */}
                {isEditing && (
                    <label className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={confirmUpdate} 
                            onChange={() => setConfirmUpdate(!confirmUpdate)} 
                            className="w-5 h-5 accent-navy" 
                        />
                        <span className="text-sm font-medium text-amber-900 text-left">
                            I am sure I want to modify this blog post.
                        </span>
                    </label>
                )}
            </div>
        </form>
    );
};

export default BlogForm;