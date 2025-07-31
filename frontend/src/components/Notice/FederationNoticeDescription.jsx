/* eslint-disable react/prop-types */
import { CrossIcon } from '../../assets/icons/CrossIcon';
import { EditIcon } from '../../assets/icons/EditIcon';
import { DeleteIcon } from '../../assets/icons/DeleteIcon';
import { noticeTypes } from '../../utils/noticeTypes';
import { getTimeAgo } from '../../utils/dateUtil';
import ImageGallery from './ImageGallery';

export default function FederationNoticeDescription({ notice, onClose, onEdit, onDelete  }) {

  return (
    <div className='font-montserrat font-medium px-6 h-full py-4 bg-white'>
      {/* Top */}
      <div className='flex flex-col gap-2 pb-4 border-b border-gray-200'>
        <div className='flex justify-between items-center mb-2'>
          <div className='text-sm text-navy-dark'>Notice Details</div>
          <button onClick={onClose}>
            <CrossIcon />
          </button>
        </div>
        <div className='text-navy-dark font-bold text-md'>{notice.title}</div>
        <div className='flex text-purple gap-2'>
          <div className='bg-purplegray px-2 py-1 text-[10px] rounded-md'>
            {noticeTypes[notice.type] || notice.type}
          </div>
        </div>
        <div className='flex text-[12px] text-dark-gray gap-1'>
          <div>Posted by:</div>
          <div>{notice.author_name} {notice.flat_id && `(${notice.flat_id})`}</div>
        </div>
        <div className='flex text-[12px] text-dark-gray gap-1'>
          <div>Posted:</div>
          <div>{new Date(notice.created_at).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })} ({getTimeAgo(notice.created_at)})</div>
        </div>
      </div>

      {/* Content */}
      <div className='py-4 flex flex-col gap-2 border-b border-gray-200'>
        <div className='text-sm text-navy-dark'>Content</div>
        <div className='text-[12px] text-dark-gray leading-6 whitespace-pre-line'>
          <div className="prose max-w-none"  dangerouslySetInnerHTML={{ __html: notice.content }} />
        </div>
      </div>

      {/* Images if any */}
       <div className='py-4 flex flex-col gap-2 border-b border-gray-200'>
        <div className='text-sm text-navy-dark'>Attachments</div>
        {notice.attachments?.length > 0 ? (
            <ImageGallery images={notice.attachments} noticeId={notice.id} />
        ):
        <div className='text-[12px] text-dark-gray '>No attachments</div>}
      </div>

      {/* bottom buttons */}
      <div className='flex flex-col gap-2 mt-4 text-sm'>
          <button 
            onClick={onEdit}
            className='bg-purple py-2 text-white flex items-center justify-center gap-2 rounded-lg hover:bg-purple-dark transition hover:bg-purple/80'
          >
            <EditIcon /> Edit Notice
          </button>
          <button 
            onClick={onDelete}
            className='bg-[#EF4444] py-2 text-white flex items-center justify-center gap-2 rounded-lg hover:bg-[#EF4444]/80 transition'
          >
            <DeleteIcon /> Delete Notice
          </button>
      </div>
    </div>
  );
}


