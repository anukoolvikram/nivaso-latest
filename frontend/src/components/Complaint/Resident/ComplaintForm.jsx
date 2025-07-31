/* eslint-disable react/prop-types */
import ImageUploader from '../../ImageUploader/ImageUploader';
import CircularProgress from '@mui/material/CircularProgress';
import { COMPLAINT_TYPES } from '../../../utils/complaint';
import { CrossIcon2 } from '../../../assets/icons/CrossIcon';
import { PublishIcon } from '../../../assets/icons/PublishIcon';
import TextEditor from '../../TextEditor/TextEditor';

export const ResidentComplaintForm = ({
    formData,
    handleChange,
    handleSubmit,
    setShowForm,
    submitting,
    selectedImages,
    setSelectedImages
}) => {
    
    const isDisabled =
        !formData.title.trim() ||
        !formData.content.trim() ||
        !formData.complaint_type;

    return (
        <div className="font-montserrat">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {formData.id ? 'Update Complaint' : 'Write New Complaint'}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                        Report issues to your society committee
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-white border border-gray100 p-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-transparent"
                >
                    <CrossIcon2 />
                    <span className="text-gray700 font-medium">Cancel</span>
                </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-6 m-6 bg-white p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Complaint Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Brief description of the issue"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issue Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="complaint_type"
                            value={formData.complaint_type}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select issue type</option>
                            {COMPLAINT_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Detailed Description <span className="text-red-500">*</span>
                    </label>
                    <TextEditor
                        value={formData.content}
                        onChange={(value) => handleChange({ target: { name: 'content', value } })}
                        placeholder="Describe the issue in detail..."
                        className="min-h-[200px]"
                    />
                </div>

                {/* Image Upload */}

                <ImageUploader
                    selectedImages={selectedImages}
                    setSelectedImages={setSelectedImages}
                />


                {/* Anonymous Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="is_anonymous"
                        checked={formData.is_anonymous}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                        Submit anonymously
                    </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isDisabled || submitting}
                        className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 transition ${isDisabled
                            ? 'bg-navy/60 cursor-not-allowed'
                            : 'bg-navy hover:bg-navy/80'
                            }`}
                    >
                        {submitting ? (
                            <>
                                <CircularProgress size={16} color="inherit" />
                            </>
                        ) : (
                            <>
                                <PublishIcon className="w-4 h-4" />
                                {formData.id ? 'Update Complaint' : 'Submit'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};