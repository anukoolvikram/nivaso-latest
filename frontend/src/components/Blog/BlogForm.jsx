/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import ImageUploader from '../ImageUploader/ImageUploader';
import { CrossIcon2 } from '../../assets/icons/CrossIcon';
import { PublishIcon } from '../../assets/icons/PublishIcon';
import TextEditor from '../TextEditor/TextEditor';
import { CircularProgress } from '@mui/material';

const TAGS = ['Event', 'Buy & Sell', 'Awareness', 'Advertisement'];

const BlogForm = ({ blog, onSubmit, onCancel, isSubmitting }) => {
    const [title, setTitle] = useState(blog?.title || '');
    const [content, setContent] = useState(blog?.content || '');
    const [selectedTags, setSelectedTags] = useState(blog?.tags ? blog.tags.map(tag => tag.name) : []);
    const [selectedImages, setSelectedImages] = useState([]);
    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };
    const [existingImages, setExistingImages] = useState(blog?.attachments?.map(a => a) || []);

    const handleRemoveExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title,
            content,
            tags: selectedTags,
            existingImages,
            newImages: selectedImages
        });
    };

    const isDisabled = !title.trim() || !content.trim() || selectedTags.length === 0 || isSubmitting;

    return (
        <div className="font-montserrat bg-black/0">
            <div className="flex justify-between items-center">
                {blog ?
                    <div>
                        <h2 className="text-2xl font-bold text-gray900">
                            Edit Blog Post
                        </h2>
                    </div>
                    :
                    <div>
                        <h2 className="text-2xl font-bold text-gray900">
                            Create New Blog Post
                        </h2>
                        <p className="text-sm text-dark-gray font-medium">
                            Share your thoughts with the community
                        </p>
                    </div>
                }
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="border border-gray100 p-2 rounded-lg flex items-center gap-2 hover:bg-white"
                    >
                        <CrossIcon2 />
                        <span className="text-gray700 font-medium">Cancel</span>
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isDisabled}
                        className="border bg-navy text-white p-2 rounded-lg flex items-center gap-2 hover:bg-navy/80 disabled:opacity-50"
                    >
                        <PublishIcon />
                        <span>{isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Publish'}</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mx-12 my-6 p-6 bg-white font-medium text-sm border border-purplegray rounded-lg space-y-6">
                <div>
                    <label htmlFor="blog-title" className="block text-gray-700">
                        Blog Title <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter blog title (max 100 chars)"
                        maxLength={100}
                        required
                        className="w-full p-2 px-4 text-gray700 border border-gray100 rounded-lg focus:ring-0 focus:outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="blog-content" className="block text-gray-700">
                        Content <span className="text-red-400">*</span>
                    </label>
                    <TextEditor
                        id="blog-content"
                        value={content}
                        onChange={(newContent) => setContent(newContent)}
                        placeholder="Write your blog content here..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-gray-700">
                        Tags <span className="text-red-400">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {TAGS.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1 rounded-xl border text-sm transition ${selectedTags.includes(tag)
                                    ? 'bg-navy text-white'
                                    : 'text-gray-800'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <ImageUploader
                    selectedImages={selectedImages}
                    setSelectedImages={setSelectedImages}
                    existingImages={existingImages}
                    onRemoveExisting={handleRemoveExistingImage}
                />

                <div className="w-full flex justify-center gap-4 mt-6">
                    <button
                        type="submit"
                        disabled={isDisabled}
                        className={`w-1/5 flex items-center justify-center py-2 rounded-lg text-white transition ${isDisabled
                            ? 'bg-purple opacity-50'
                            : 'bg-purple hover:bg-purple/80'
                            }`}
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
        </div>
    );
};

export default BlogForm;