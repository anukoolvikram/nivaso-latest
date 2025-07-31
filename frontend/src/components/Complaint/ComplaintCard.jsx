/* eslint-disable react/prop-types */
import { getTimeAgo } from '../../utils/dateUtil';
import {Calendor} from '../../assets/icons/Calendor'
import { Profile } from '../../assets/icons/Profile';

const ComplaintCard = ({ complaint, onClick }) => {
    return (
    
  <div className="text-sm bg-white font-montserrat font-medium p-4 border border-purplegray shadow-md rounded-lg space-y-4">
    <div className='flex justify-between text-xs'>
        {complaint.residentName && 
        <div className='flex items-center gap-2'>
            <div>
                <Profile/>
            </div>
            <div>
                <div className='font-semibold'>{complaint.residentName}</div>
                <div>Flat {complaint.residentFlat.charAt(0)}-{complaint.residentFlat.slice(1)}</div>
            </div>
        </div>
        }
         {/* ${complaint.status === 'Resolved' ? 'bg-green-200' : complaint.status === 'Dismissed' ? 'bg-red-200' :'bg-blue-200'} */}
        <div className='flex items-center space-x-4'>
            <span className={`text-navy text-xs px-2 py-1 rounded-full ${complaint.status === 'Resolved' ? 'bg-green-200' : complaint.status === 'Dismissed' ? 'bg-red-200' :'bg-blue-200'}`}>{complaint.status}</span>
            <span className='text-light-gray'>{getTimeAgo(complaint.created_at)}</span>
        </div>
    </div>

    <div className='text-gray700 font-semibold mt-2 text-lg'>
        {complaint.title}
    </div>

    <div className='flex justify-between items-center text-xs'>
        <div className='flex gap-4'>
            <span className='bg-[#ECE4F1] px-2 py-1 text-purple rounded'>
                {complaint.complaint_type}
            </span>
            <div className='flex gap-2 items-center'>
                <Calendor/>
                <div>
                    {new Date(complaint.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day:   'numeric',
                        year:  'numeric',
                    })}
                </div>
            </div>
        </div>
        <div onClick={() => onClick(complaint)} className='bg-navy text-white px-4 py-2 rounded-lg cursor-pointer'>View Details</div>
    </div>
  </div>
)};

export default ComplaintCard;