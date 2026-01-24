// /* eslint-disable react/prop-types */
// import ImageUploader from '../../ImageUploader/ImageUploader';
// import CircularProgress from '@mui/material/CircularProgress';
// import { COMPLAINT_TYPES } from '../../../utils/complaint';
// import { CrossIcon2 } from '../../../assets/icons/CrossIcon';
// import { PublishIcon } from '../../../assets/icons/PublishIcon';
// import TextEditor from '../../TextEditor/TextEditor';

// export const ResidentComplaintForm = ({
//     formData,
//     handleChange,
//     handleSubmit,
//     setShowForm,
//     submitting,
//     selectedImages,
//     setSelectedImages
// }) => {
    
//     const isDisabled =
//         !formData.title.trim() ||
//         !formData.content.trim() ||
//         !formData.complaint_type;

//     return (
//         <div className="font-montserrat">
//             {/* Header */}
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-900">
//                         {formData.id ? 'Update Complaint' : 'Write New Complaint'}
//                     </h2>
//                     <p className="text-sm text-gray-500 font-medium">
//                         Report issues to your society committee
//                     </p>
//                 </div>

//                 <button
//                     type="button"
//                     onClick={() => setShowForm(false)}
//                     className="bg-white border border-gray100 p-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-transparent"
//                 >
//                     <CrossIcon2 />
//                     <span className="text-gray700 font-medium">Cancel</span>
//                 </button>
//             </div>

//             {/* Form Content */}
//             <form onSubmit={handleSubmit} className="space-y-6 m-6 bg-white p-8 rounded-lg shadow-lg">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Title */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Complaint Title <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             name="title"
//                             value={formData.title}
//                             onChange={handleChange}
//                             placeholder="Brief description of the issue"
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             required
//                         />
//                     </div>

//                     {/* Type */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Issue Type <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                             name="complaint_type"
//                             value={formData.complaint_type}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             required
//                         >
//                             <option value="">Select issue type</option>
//                             {COMPLAINT_TYPES.map(type => (
//                                 <option key={type} value={type}>{type}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 {/* Description */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Detailed Description <span className="text-red-500">*</span>
//                     </label>
//                     <TextEditor
//                         value={formData.content}
//                         onChange={(value) => handleChange({ target: { name: 'content', value } })}
//                         placeholder="Describe the issue in detail..."
//                         className="min-h-[200px]"
//                     />
//                 </div>

//                 {/* Image Upload */}

//                 <ImageUploader
//                     selectedImages={selectedImages}
//                     setSelectedImages={setSelectedImages}
//                 />


//                 {/* Anonymous Checkbox */}
//                 <div className="flex items-center">
//                     <input
//                         type="checkbox"
//                         name="is_anonymous"
//                         checked={formData.is_anonymous}
//                         onChange={handleChange}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label className="ml-2 block text-sm text-gray-700">
//                         Submit anonymously
//                     </label>
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end gap-4 pt-4">
//                     <button
//                         type="button"
//                         onClick={() => setShowForm(false)}
//                         className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         disabled={isDisabled || submitting}
//                         className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 transition ${isDisabled
//                             ? 'bg-navy/60 cursor-not-allowed'
//                             : 'bg-navy hover:bg-navy/80'
//                             }`}
//                     >
//                         {submitting ? (
//                             <>
//                                 <CircularProgress size={16} color="inherit" />
//                             </>
//                         ) : (
//                             <>
//                                 <PublishIcon className="w-4 h-4" />
//                                 {formData.id ? 'Update Complaint' : 'Submit'}
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };


/* eslint-disable react/prop-types */
import ImageUploader from '../../ImageUploader/ImageUploader';
import CircularProgress from '@mui/material/CircularProgress';
import { COMPLAINT_TYPES } from '../../../utils/complaint';
import { CrossIcon2 } from '../../../assets/icons/CrossIcon';
import { PublishIcon } from '../../../assets/icons/PublishIcon';
import TextEditor from '../../TextEditor/TextEditor';

export const ResidentComplaintForm = ({
    formData, handleChange, handleSubmit, setShowForm, submitting, selectedImages, setSelectedImages
}) => {
    const isDisabled = !formData.title.trim() || !formData.content.trim() || !formData.complaint_type;

    return (
        <div className="animate-in zoom-in-95 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-medium text-navy-dark">
                        {formData.id ? 'Update Complaint' : 'Submit Issue'}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium font-montserrat">
                        Direct communication with your society committee
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full md:w-auto bg-white border border-gray-200 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                    <CrossIcon2 />
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-5 md:p-10 rounded-2xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                        <input
                            type="text" name="title" value={formData.title} onChange={handleChange}
                            placeholder="Briefly state the problem"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy/10 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                        <select
                            name="complaint_type" value={formData.complaint_type} onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy/10 outline-none appearance-none"
                            required
                        >
                            <option value="">Select type</option>
                            {COMPLAINT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                    <TextEditor
                        value={formData.content}
                        onChange={(value) => handleChange({ target: { name: 'content', value } })}
                    />
                </div>

                <ImageUploader selectedImages={selectedImages} setSelectedImages={setSelectedImages} />

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                    <input
                        type="checkbox" name="is_anonymous" checked={formData.is_anonymous} onChange={handleChange}
                        className="h-5 w-5 accent-navy rounded border-gray-300"
                    />
                    <span className="text-sm font-bold text-gray-700">Submit this complaint anonymously</span>
                </label>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-50">
                    <button
                        type="submit"
                        disabled={isDisabled || submitting}
                        className={`w-full sm:w-48 py-3.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-xl transition-all ${
                            isDisabled ? 'bg-navy/40 cursor-not-allowed' : 'bg-navy hover:bg-navy-dark shadow-navy/20 active:scale-95'
                        }`}
                    >
                        {submitting ? <CircularProgress size={20} color="inherit" /> : <><PublishIcon /> {formData.id ? 'Update' : 'Submit Now'}</>}
                    </button>
                </div>
            </form>
        </div>
    );
};