/* eslint-disable react/prop-types */
import { LeftArrow } from '../../../assets/icons/ArrowIcons';
import CircularProgress from '@mui/material/CircularProgress';
import ImageGallery from '../../ImageGallery/ImageGallery'


export const ResidentComplaintDescription = ({
    complaint,
    onBack,
    onSubmitResponse,
    response,
    setResponse,
    submittingResponse,
    responseError
}) => {
    console.log(complaint)
    return (
        <div className='bg-gray-100 space-y-6'>
            <button onClick={onBack} className="mb-4 text-gray-700 cursor-pointer hover:text-black flex items-center gap-2">
                <LeftArrow />
                Back
            </button>

            <div className='flex justify-between gap-6'>
                <div className='w-full bg-white p-4 rounded-lg shadow space-y-4'>
                    <div className='flex justify-between items-center'>
                        <div className='text-xl font-bold text-gray-900'>{complaint.title}</div>
                        <div className='bg-gray-100 px-2 py-1 rounded text-sm text-navy font-medium'>{complaint.complaint_type}</div>
                    </div>

                    <div className='flex justify-between items-center text-sm gap-1 text-gray-500'>
                        <div>Submitted on: {new Date(complaint.created_at).toLocaleString('en-IN', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        })}
                        </div>
                        <div className={`rounded-lg px-2 py-1 text-gray-800 text-center ${complaint.status === 'Resolved' ? 'bg-green-200' : complaint.status === 'Dismissed' ? 'bg-red-200' :'bg-blue-200'}`}>
                            {complaint.status || 'Not specified'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Details */}

            <div className='bg-white p-4 rounded-lg shadow'>
                <h2 className='text-lg font-semibold text-gray-900 mb-3'>Complaint Details</h2>
                <div className='prose max-w-none text-gray700 whitespace-pre-line' dangerouslySetInnerHTML={{ __html: complaint.content }} />
            </div>

            {complaint.responses?.length > 0 && (
                <div className='bg-white p-4 rounded-lg shadow'>
                    <h2 className='font-semibold text-gray-900 mb-4'>Additional Information</h2>
                    <div className="space-y-4">
                        {complaint.responses.map((res) => (
                            <div key={res.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs text-gray-500">
                                        {new Date(res.created_at).toLocaleString('en-IN', {
                                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <p className="text-gray-700 whitespace-pre-line">{res.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/* Attached Images */}
            {complaint.attachments?.length > 0 &&
                <div className=' bg-white p-4 rounded-lg shadow'>
                    <div className='font-semibold text-gray-900 mb-3'>
                        Attachments
                    </div>
                    <ImageGallery images={complaint.attachments} />
                </div>
            }

            {/* Society Response */}
            {complaint.comment && (
                <div className='bg-white p-4 rounded-lg shadow'>
                    <div className='text-lg font-semibold text-gray-900'>Comment</div>
                    <div className='text-gray-700 whitespace-pre-line'>
                        {complaint.comment}
                    </div>
                    {complaint.updated_at && (
                        <div className='text-sm text-gray-500 mt-2'>
                            Last updated: {new Date(complaint.updated_at).toLocaleString('en-IN')}
                        </div>
                    )}
                </div>
            )}


            {complaint.status === 'Under Review' && (
                <div className='bg-white p-4 rounded-lg shadow'>
                    <div className=' font-semibold text-gray-900 mb-3'>Provide any additional details or clarifications that might help resolve your complaint...</div>
                    <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="w-full bg-white p-4 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                        rows={4}
                        placeholder="Your Response..."
                    />
                    {responseError && (
                        <p className="text-red-500 text-sm mb-2">{responseError}</p>
                    )}
                    <div className='flex justify-end'>
                        <button
                            onClick={onSubmitResponse}
                            disabled={submittingResponse}
                            className=" bg-navy hover:bg-navy/80 cursor-pointer text-white px-4 py-2 rounded-md gap-2 transition-colors"
                        >
                            {submittingResponse ? (
                                <>
                                    <CircularProgress size={16} color="inherit" />
                                </>
                            ) : 'Submit'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};