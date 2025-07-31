/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import apiClient from '../../services/apiClient';
import { getTimeAgo } from '../../utils/dateUtil';
import { noticeTypes } from '../../utils/noticeTypes';
import { useToast } from '../../context/ToastContext';
import ImageGallery from './ImageGallery';
import { CrossIcon } from '../../assets/icons/CrossIcon';
import { EditIcon } from '../../assets/icons/EditIcon';
import { DeleteIcon } from '../../assets/icons/DeleteIcon';

const NoticeDescription = ({ notice, onClose, onEdit, onDelete, onApprove, userRole, onNoticeUpdate }) => {
  const showActions = notice.author_type === userRole || (notice.author_type == 'resident' && userRole == 'society');
  const showToast = useToast();
  const [voting, setVoting] = useState(false);

  const handleVote = async (optionId, noticeId) => {
    setVoting(true);
    try {
      const response = await apiClient.post('/notice/vote', {
        optionId,
        noticeId
      });
      onNoticeUpdate(noticeId); 
      showToast("Vote recorded!", "success");
    } catch (err) {
      showToast(err.response?.data?.error || "Voting failed", "error");
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className='font-montserrat font-medium px-6 h-full py-4 bg-white flex flex-col'>
      <div className="flex-grow overflow-y-auto">
        {/* Top Section */}
        <div className='flex flex-col gap-2 pb-4 border-b border-gray-200'>
          <div className='flex justify-between items-center mb-2'>
            <div className='text-sm text-navy-dark'>Notice Details</div>
            <button onClick={onClose} aria-label="Close details">
              <CrossIcon />
            </button>
          </div>
          <div className='text-navy-dark font-bold text-md'>{notice.title}</div>
          <div className='flex gap-2 items-center'>
            <div className='w-fit bg-purplegray text-purple px-2 py-1 text-[10px] rounded-md'>
              {noticeTypes[notice.type] || notice.type}
            </div>
            {notice.author_type=='resident' && (
              <div className={`px-2 py-1 text-[10px] rounded-md ${notice.is_approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                {notice.is_approved ? 'Approved' : 'Pending Approval'}
              </div>
            )}
          </div>
          <div className='flex text-[12px] text-dark-gray gap-1'>
            <div>Posted by:</div>
            <div>{notice.author_name} {notice.flat_id && `(${notice.flat_id})`}</div>
          </div>
          <div className='flex text-[12px] text-dark-gray gap-1'>
            <div>Posted:</div>
            <div>{new Date(notice.created_at).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })} ({getTimeAgo(notice.created_at)})</div>
          </div>
        </div>

        {/* Content Section */}
        <div className='py-4 flex flex-col gap-2 border-b border-gray-200'>
          <div className='text-sm text-navy-dark'>Content</div>
          <div className='text-[12px] text-dark-gray leading-6 whitespace-pre-line'>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: notice.content }} />
          </div>
        </div>

        {/* Attachments Section */}
        <div className='py-4 flex flex-col gap-2 border-b border-gray-200'>
          <div className='text-sm text-navy-dark'>Attachments</div>
          {notice.attachments?.length > 0 ? (
            <ImageGallery images={notice.attachments} noticeId={notice.id} />
          ) : (
            <div className='text-[12px] text-dark-gray '>No attachments</div>
          )}
        </div>

        {/* Poll Section */}
        {(notice.type === 'poll' || notice.type === 'Poll') && notice.poll_options?.length > 0 && (
          <div className="py-4 space-y-3">
            <div className='text-sm text-navy-dark'>Cast your vote:</div>
            {notice.poll_options.sort((a, b) => a.id - b.id).map((opt) => (
              <div key={opt.id} className="flex items-center justify-between text-sm border rounded-lg p-2 hover:bg-gray-50">
                <span className="text-gray-700">{opt.option_text}</span>
                <button
                  onClick={() => { if (userRole === 'resident') handleVote(opt.id, notice.id) }}
                  disabled={voting || userRole !== 'resident'}
                  className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded ${voting || userRole !== 'resident' ? "bg-gray-300 cursor-not-allowed" : "bg-navy hover:bg-navy/90 text-white"}`}
                >
                  {voting ? (<CircularProgress size={16} color="inherit" />) : (`${opt._count.votes} Votes`)}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons Section */}

      <div className='flex flex-col gap-2 mt-4 text-sm'>
        {onApprove && (
          <button
            onClick={onApprove}
            className='bg-green-600 py-2 text-white flex items-center justify-center gap-2 rounded-lg hover:bg-green-700 transition'
          >
            Approve Notice
          </button>
        )}
        {showActions && (
          <>
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
          </>
        )}

      </div>

    </div>
  );
};

export default NoticeDescription;