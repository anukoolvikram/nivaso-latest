// /* eslint-disable react/prop-types */
// import { LeftArrow } from '../../../assets/icons/ArrowIcons';
// import CircularProgress from '@mui/material/CircularProgress';
// import ImageGallery from '../../ImageGallery/ImageGallery'


// export const ResidentComplaintDescription = ({
//     complaint,
//     onBack,
//     onSubmitResponse,
//     response,
//     setResponse,
//     submittingResponse,
//     responseError
// }) => {
//     console.log(complaint)
//     return (
//         <div className='bg-gray-100 space-y-6'>
//             <button onClick={onBack} className="mb-4 text-gray-700 cursor-pointer hover:text-black flex items-center gap-2">
//                 <LeftArrow />
//                 Back
//             </button>

//             <div className='flex justify-between gap-6'>
//                 <div className='w-full bg-white p-4 rounded-lg shadow space-y-4'>
//                     <div className='flex justify-between items-center'>
//                         <div className='text-xl font-bold text-gray-900'>{complaint.title}</div>
//                         <div className='bg-gray-100 px-2 py-1 rounded text-sm text-navy font-medium'>{complaint.complaint_type}</div>
//                     </div>

//                     <div className='flex justify-between items-center text-sm gap-1 text-gray-500'>
//                         <div>Submitted on: {new Date(complaint.created_at).toLocaleString('en-IN', {
//                             weekday: 'short',
//                             year: 'numeric',
//                             month: 'short',
//                             day: 'numeric',
//                             hour: '2-digit',
//                             minute: '2-digit',
//                             hour12: true,
//                         })}
//                         </div>
//                         <div className={`rounded-lg px-2 py-1 text-gray-800 text-center ${complaint.status === 'Resolved' ? 'bg-green-200' : complaint.status === 'Dismissed' ? 'bg-red-200' :'bg-blue-200'}`}>
//                             {complaint.status || 'Not specified'}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Content Details */}

//             <div className='bg-white p-4 rounded-lg shadow'>
//                 <h2 className='text-lg font-semibold text-gray-900 mb-3'>Complaint Details</h2>
//                 <div className='prose max-w-none text-gray700 whitespace-pre-line' dangerouslySetInnerHTML={{ __html: complaint.content }} />
//             </div>

//             {complaint.responses?.length > 0 && (
//                 <div className='bg-white p-4 rounded-lg shadow'>
//                     <h2 className='font-semibold text-gray-900 mb-4'>Additional Information</h2>
//                     <div className="space-y-4">
//                         {complaint.responses.map((res) => (
//                             <div key={res.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                                 <div className="flex justify-between items-center mb-1">
//                                     <p className="text-xs text-gray-500">
//                                         {new Date(res.created_at).toLocaleString('en-IN', {
//                                             day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
//                                         })}
//                                     </p>
//                                 </div>
//                                 <p className="text-gray-700 whitespace-pre-line">{res.text}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}


//             {/* Attached Images */}
//             {complaint.attachments?.length > 0 &&
//                 <div className=' bg-white p-4 rounded-lg shadow'>
//                     <div className='font-semibold text-gray-900 mb-3'>
//                         Attachments
//                     </div>
//                     <ImageGallery images={complaint.attachments} />
//                 </div>
//             }

//             {/* Society Response */}
//             {complaint.comment && (
//                 <div className='bg-white p-4 rounded-lg shadow'>
//                     <div className='text-lg font-semibold text-gray-900'>Comment</div>
//                     <div className='text-gray-700 whitespace-pre-line'>
//                         {complaint.comment}
//                     </div>
//                     {complaint.updated_at && (
//                         <div className='text-sm text-gray-500 mt-2'>
//                             Last updated: {new Date(complaint.updated_at).toLocaleString('en-IN')}
//                         </div>
//                     )}
//                 </div>
//             )}


//             {complaint.status === 'Under Review' && (
//                 <div className='bg-white p-4 rounded-lg shadow'>
//                     <div className=' font-semibold text-gray-900 mb-3'>Provide any additional details or clarifications that might help resolve your complaint...</div>
//                     <textarea
//                         value={response}
//                         onChange={(e) => setResponse(e.target.value)}
//                         className="w-full bg-white p-4 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
//                         rows={4}
//                         placeholder="Your Response..."
//                     />
//                     {responseError && (
//                         <p className="text-red-500 text-sm mb-2">{responseError}</p>
//                     )}
//                     <div className='flex justify-end'>
//                         <button
//                             onClick={onSubmitResponse}
//                             disabled={submittingResponse}
//                             className=" bg-navy hover:bg-navy/80 cursor-pointer text-white px-4 py-2 rounded-md gap-2 transition-colors"
//                         >
//                             {submittingResponse ? (
//                                 <>
//                                     <CircularProgress size={16} color="inherit" />
//                                 </>
//                             ) : 'Submit'}
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };


/* eslint-disable react/prop-types */
import { LeftArrow } from '../../../assets/icons/ArrowIcons';
import CircularProgress from '@mui/material/CircularProgress';
import ImageGallery from '../../ImageGallery/ImageGallery'

export const ResidentComplaintDescription = ({
    complaint, onBack, onSubmitResponse, response, setResponse, submittingResponse, responseError
}) => {
    const getStatusStyles = (status) => {
        switch(status) {
            case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Dismissed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <div className='space-y-6 animate-in slide-in-from-right-4 duration-300'>
            <button onClick={onBack} className="group flex items-center gap-2 text-navy font-medium text-sm uppercase tracking-widest hover:underline transition-all">
                <LeftArrow className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </button>

            {/* Header Area */}
            <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                <div className='flex flex-col md:flex-row justify-between items-start gap-4'>
                    <div className="space-y-1">
                        <span className='text-[10px] font-medium text-gray-400 uppercase tracking-tighter'>Complaint Title</span>
                        <h2 className='text-2xl font-medium text-navy-dark leading-tight'>{complaint.title}</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className='px-3 py-1 bg-purple/10 text-purple text-[10px] font-bold rounded-full border border-purple/20 uppercase tracking-widest'>
                            {complaint.complaint_type}
                        </span>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-medium border uppercase tracking-widest shadow-sm ${getStatusStyles(complaint.status)}`}>
                            {complaint.status || 'Under Review'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content & History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className='bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100'>
                        <h3 className='text-xs font-medium text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2'>Detailed Report</h3>
                        <div className='prose prose-navy max-w-none text-gray-800 leading-relaxed' dangerouslySetInnerHTML={{ __html: complaint.content }} />
                    </div>

                    {complaint.responses?.length > 0 && (
                        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                            <h3 className='text-xs font-medium text-gray-400 uppercase tracking-widest mb-6'>Additional Clarifications</h3>
                            <div className="space-y-4">
                                {complaint.responses.map((res) => (
                                    <div key={res.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-navy/20"></div>
                                        <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-tighter">
                                            {new Date(res.created_at).toLocaleString()}
                                        </p>
                                        <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{res.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {complaint.attachments?.length > 0 && (
                        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                            <h3 className='text-xs font-medium text-gray-400 uppercase tracking-widest mb-4'>Evidence/Photos</h3>
                            <ImageGallery images={complaint.attachments} />
                        </div>
                    )}

                    {complaint.comment && (
                        <div className='bg-navy text-white p-6 rounded-2xl shadow-xl shadow-navy/20'>
                            <h3 className='text-xs font-medium text-white/60 uppercase tracking-widest mb-3'>Committee Action</h3>
                            <p className='text-sm leading-relaxed italic'>"{complaint.comment}"</p>
                            <div className='text-[10px] font-bold text-white/40 mt-4 uppercase'>
                                Updated: {new Date(complaint.updated_at).toLocaleDateString()}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Response Form */}
            {complaint.status === 'Under Review' && (
                <div className='bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-navy/5'>
                    <h3 className='text-sm font-medium text-navy-dark uppercase tracking-widest mb-4'>Provide more information</h3>
                    <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="w-full bg-gray-50 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy/20 outline-none transition-all mb-4"
                        rows={4}
                        placeholder="Add details that might help the committee..."
                    />
                    {responseError && <p className="text-red-500 text-xs font-bold mb-3">{responseError}</p>}
                    <div className='flex justify-end'>
                        <button
                            onClick={onSubmitResponse}
                            disabled={submittingResponse}
                            className="w-full md:w-auto bg-navy text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-navy/20 transition-all hover:bg-navy-dark active:scale-95"
                        >
                            {submittingResponse ? <CircularProgress size={18} color="inherit" /> : 'Send to Committee'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};