/* eslint-disable react/prop-types */
import { LeftArrow } from '../../../assets/icons/ArrowIcons';
import ChangeStatus from '../Society/ChangeStatus';
import ImageUploader from '../../ImageUploader/ImageUploader';

const ComplaintDescription = ({
  complaint,
  onBack,
  newStatus,
  setNewStatus,
  dismissComment,
  setDismissComment,
  selectedImages,
  setSelectedImages,
  saveError,
  handleSaveStatus,
  updatingStatus,
  isReadOnly,
}) => {

  console.log(complaint)
  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-4 lg:px-6 py-4'>
        {/* Back button with better spacing */}
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 font-medium text-sm"
          aria-label="Go back to previous page"
        >
          <LeftArrow className="w-4 h-4" />
          Back
        </button>

        {/* Main Content Container */}
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='lg:w-2/3 w-full space-y-4'>
            <div className='p-6 bg-white rounded-xl shadow-xs border border-gray-100 space-y-3'>
              <h2 className='text-lg font-semibold text-gray-900 mb-3'>Complainer Information</h2>
              <div className='flex justify-between items-start'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-gray-900'>{complaint.residentName}</p>
                  <p className='text-sm text-gray-600'>Flat {complaint.residentFlat}</p>
                </div>
              </div>
              <div className='flex gap-2 text-sm text-gray-600 flex-wrap'>
                <a href={`tel:${complaint.residentPhone}`} className="hover:text-blue-600 transition-colors">
                  {complaint.residentPhone}
                </a>
                <span className="text-gray-300">|</span>
                <a href={`mailto:${complaint.residentEmail}`} className="hover:text-blue-600 transition-colors break-all">
                  {complaint.residentEmail}
                </a>
              </div>
            </div>

            {/* Complaint Details Card */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
              <div className='flex justify-between items-start mb-2'>
                <div>
                  <h2 className='text-xl font-semibold text-gray-900'>Complaint Details</h2>
                </div>
                <span className='text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full'>
                  {new Date(complaint.created_at).toLocaleString('en-IN', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>

              {complaint.title && (
                <div>
                  <span className='font-medium text-gray-500'>Title:</span>
                  <span className='ml-2 text-gray-700'>{complaint.title}</span>
                </div>
              )}

              {complaint.complaint_type && (
                <div>
                  <span className='font-medium text-gray-500'>Type:</span>
                  <span className='ml-2 text-gray-700'>{complaint.complaint_type}</span>
                </div>
              )}

              <div className='space-y-4 mt-4'>
                <div className='bg-gray-50 p-4 rounded-lg border border-gray-100'>
                  <h4 className='text-sm font-medium text-gray-500 mb-2'>Description</h4>
                  <div
                    className='prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed'
                    dangerouslySetInnerHTML={{ __html: complaint.content }}
                  />
                </div>
              </div>
            </div>

            {/* Conversation History Section */}
            {complaint.responses?.length > 0 && (
              <div className='bg-white p-6 rounded-xl shadow-xs border border-gray-100'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Additional Information</h3>
                <div className="space-y-4">
                  {complaint.responses.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 transition-colors hover:bg-gray-100"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-sm text-gray-900">
                          {res.author.name}
                          <span className="ml-2 text-xs text-gray-500 font-normal">
                            ({res.author.role})
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(res.created_at).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-snug">
                        {res.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments Section */}
            {complaint.attachments?.length > 0 && (
              <div className='bg-white p-6 rounded-xl shadow-xs border border-gray-100'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Attachments</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {complaint.attachments.map((url, idx) => (
                    <img
                      key={idx}
                      src={url.file_path}
                      className="rounded-lg shadow-sm object-cover h-48"
                    />
                  ))}

                </div>
              </div>
            )}
          </div>

          <div className='lg:w-1/3 w-full space-y-6'>
            <div className='bg-white p-6 rounded-xl shadow-xs border border-gray-100'>
              <div className='text-lg font-semibold text-gray-900 mb-4'>Update Status</div>
              <ChangeStatus
                newStatus={newStatus}
                setNewStatus={setNewStatus}
                dismissComment={dismissComment}
                setDismissComment={setDismissComment}
                saveError={saveError}
                handleSaveStatus={handleSaveStatus}
                updatingStatus={updatingStatus}
                isReadOnly={isReadOnly}
                complaint={complaint}
              />
            </div>

            {!isReadOnly && (
              <div className='bg-white p-6 rounded-xl shadow-xs border border-gray-100'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Add Attachments</h3>

                {newStatus === 'Resolved' ? (
                  <>
                    <ImageUploader
                      selectedImages={selectedImages}
                      setSelectedImages={setSelectedImages}
                    />
                    {selectedImages.length > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        {selectedImages.length} image(s) selected for resolution proof
                      </p>
                    )}
                    {saveError && newStatus === 'Resolved' && selectedImages.length === 0 && (
                      <p className="text-sm text-red-500 mt-2">
                        {saveError}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    {newStatus === 'Dismissed'
                      ? "No attachments needed for dismissed complaints"
                      : "Attachments can only be added when status is set to 'Resolved'"
                    }
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
};

export default ComplaintDescription;