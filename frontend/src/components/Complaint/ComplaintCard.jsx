// /* eslint-disable react/prop-types */
// import { getTimeAgo } from '../../utils/dateUtil';
// import {Calendor} from '../../assets/icons/Calendor'
// import { Profile } from '../../assets/icons/Profile';

// const ComplaintCard = ({ complaint, onClick }) => {
//     return (
    
//   <div className="text-sm bg-white font-montserrat font-medium p-4 border border-purplegray shadow-md rounded-lg space-y-4">
//     <div className='flex justify-between text-xs'>
//         {complaint.residentName && 
//         <div className='flex items-center gap-2'>
//             <div>
//                 <Profile/>
//             </div>
//             <div>
//                 <div className='font-semibold'>{complaint.residentName}</div>
//                 <div>Flat {complaint.residentFlat.charAt(0)}-{complaint.residentFlat.slice(1)}</div>
//             </div>
//         </div>
//         }
//          {/* ${complaint.status === 'Resolved' ? 'bg-green-200' : complaint.status === 'Dismissed' ? 'bg-red-200' :'bg-blue-200'} */}
//         <div className='flex items-center space-x-4'>
//             <span className={`text-navy text-xs px-2 py-1 rounded-full ${complaint.status === 'Resolved' ? 'bg-green-200' : complaint.status === 'Dismissed' ? 'bg-red-200' :'bg-blue-200'}`}>{complaint.status}</span>
//             <span className='text-light-gray'>{getTimeAgo(complaint.created_at)}</span>
//         </div>
//     </div>

//     <div className='text-gray700 font-semibold mt-2 text-lg'>
//         {complaint.title}
//     </div>

//     <div className='flex justify-between items-center text-xs'>
//         <div className='flex gap-4'>
//             <span className='bg-[#ECE4F1] px-2 py-1 text-purple rounded'>
//                 {complaint.complaint_type}
//             </span>
//             <div className='flex gap-2 items-center'>
//                 <Calendor/>
//                 <div>
//                     {new Date(complaint.created_at).toLocaleDateString('en-US', {
//                         month: 'short',
//                         day:   'numeric',
//                         year:  'numeric',
//                     })}
//                 </div>
//             </div>
//         </div>
//         <div onClick={() => onClick(complaint)} className='bg-navy text-white px-4 py-2 rounded-lg cursor-pointer'>View Details</div>
//     </div>
//   </div>
// )};

// export default ComplaintCard;


/* eslint-disable react/prop-types */
import { getTimeAgo } from '../../utils/dateUtil';
import { Calendor } from '../../assets/icons/Calendor'
import { Profile } from '../../assets/icons/Profile';

const ComplaintCard = ({ complaint, onClick }) => {
    const getStatusColor = (status) => {
        switch(status) {
            case 'Resolved': return 'bg-green-100 text-green-700';
            case 'Dismissed': return 'bg-red-100 text-red-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <div className="group bg-white p-5 border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-all duration-300">
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4'>
                <div className='flex items-center gap-3'>
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-navy/5 transition-colors">
                        <Profile />
                    </div>
                    <div>
                        <div className='text-sm font-medium text-navy-dark'>{complaint.residentName || 'Resident'}</div>
                        <div className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Flat {complaint.residentFlat}</div>
                    </div>
                </div>
                
                <div className='flex items-center justify-between w-full sm:w-auto gap-4'>
                    <span className={`text-[10px] font-medium uppercase px-3 py-1 rounded-full tracking-widest ${getStatusColor(complaint.status)}`}>
                        {complaint.status || 'Pending'}
                    </span>
                    <span className='text-[10px] font-bold text-gray-400 uppercase'>{getTimeAgo(complaint.created_at)}</span>
                </div>
            </div>

            <h3 className='text-lg font-bold text-gray-900 mb-6 group-hover:text-navy transition-colors'>
                {complaint.title}
            </h3>

            <div className='flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-50'>
                <div className='flex items-center gap-4 w-full sm:w-auto'>
                    <span className='bg-purple/5 text-purple text-[10px] font-bold px-3 py-1 rounded-full border border-purple/10 uppercase tracking-widest'>
                        {complaint.complaint_type}
                    </span>
                    <div className='flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase'>
                        <Calendor className="w-4 h-4" />
                        {new Date(complaint.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                        })}
                    </div>
                </div>
                <button 
                    onClick={() => onClick(complaint)} 
                    className='w-full sm:w-auto px-6 py-2.5 bg-gray-50 hover:bg-navy text-navy hover:text-white rounded-xl text-xs font-medium uppercase tracking-widest transition-all'
                >
                    View File
                </button>
            </div>
        </div>
    );
};

export default ComplaintCard;