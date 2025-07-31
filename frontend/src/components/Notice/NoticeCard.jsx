/* eslint-disable react/prop-types */
import React, { useMemo, useCallback, memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { EditIcon } from '../../assets/icons/EditIcon';
import { DeleteIcon } from '../../assets/icons/DeleteIcon';
import { getTimeAgo } from '../../utils/dateUtil';
import { noticeTypes } from '../../utils/noticeTypes';
import { fetchUserInfo } from '../../services/authService';

const NoticeCard = ({
  notice,
  onClick,
  isSelected = false,
  showStatusBadge = false,
  showPostedByPrefix = false,
  onEdit,
  onDelete,
  timestampField = 'created_at',
  userRole
}) => {
  const [userId, setUserId] = useState();

  useEffect(() => {
    let isMounted = true; 
    fetchUserInfo().then((userInfo) => {
      if (isMounted) setUserId(userInfo?.userId);
    });
    return () => { isMounted = false; };
  }, []);

  const showActions = useMemo(() => {
    const isAuthor = notice.author_type === userRole && notice.author_id === userId;
    const isSocietyAdminViewingResidentPost = notice.author_type === 'resident' && userRole === 'society';
    return isAuthor || isSocietyAdminViewingResidentPost;
  }, [notice.author_id, notice.author_type, userId, userRole]);

  const timeAgo = useMemo(() => {
    let tsValue;
    if (Array.isArray(timestampField)) {
      tsValue = timestampField.map(f => notice[f]).find(val => val != null);
    } else {
      tsValue = notice[timestampField];
    }
    return getTimeAgo(tsValue ?? notice.created_at);
  }, [notice, timestampField]);

  const authorLabel = useMemo(() => (
    notice.author_name === 'Committee Member' ? 'All Residents' : notice.author_name
  ), [notice.author_name]);

  const statusBadge = useMemo(() => {
    if (!showStatusBadge) return null;
    return notice.approved ? (
      <span className="text-xs text-navy bg-purplegray rounded-full px-2 py-1">
        Published
      </span>
    ) : (
      <span className="text-xs text-amber-700 bg-amber-100 rounded-full px-2 py-1">
        Pending
      </span>
    );
  }, [showStatusBadge, notice.approved]);



  const handleEdit = useCallback(() => {
    if (onEdit) onEdit(notice);
  }, [onEdit, notice]);

  const handleDelete = useCallback(() => {
    const idToDelete = notice.id ?? notice.notice_id;
    if (onDelete) onDelete(idToDelete);
  }, [onDelete, notice]);

  const stopPropagation = useCallback(e => e.stopPropagation(), []);


  return (
    <div
      onClick={onClick}
      className={`flex flex-col gap-4 p-4 font-montserrat font-medium bg-white border border-purplegray rounded-lg cursor-pointer hover:shadow-md transition ${
        isSelected ? 'ring-2 ring-navy' : ''
      }`}
    >
      {/* Header */}
      <div>
        <div className="flex justify-between items-center">
          <div className="font-bold text-navy-dark">{notice.title}</div>
          {statusBadge}
        </div>
        <div className="text-xs text-[#4B5563]">
          {showPostedByPrefix && 'Posted by: '}
          {authorLabel}
          {notice.flat_id && ` (${notice.flat_id})`}
        </div>
      </div>

      {/* Type & Time */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <div className="flex items-center justify-center bg-navy rounded p-1 px-2 text-xs text-my-gray">
            {noticeTypes[notice.type] || notice.type}
          </div>
          <div className="text-sm text-light-gray">{timeAgo}</div>
        </div>
        {showActions && (
          <div className="flex gap-2" onClick={stopPropagation}>
            <button
              onClick={handleEdit}
              className="p-1 text-navy hover:text-blue-700"
              title="Edit"
            >
              <EditIcon />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-red-600 hover:text-red-800"
              title="Delete"
            >
              <DeleteIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Best Practice: Add PropTypes for type checking and component documentation ---
NoticeCard.propTypes = {
  notice: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    notice_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    author_name: PropTypes.string,
    author_type: PropTypes.string,
    author_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    flat_id: PropTypes.string,
    type: PropTypes.string,
    approved: PropTypes.bool,
    created_at: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  showStatusBadge: PropTypes.bool,
  showPostedByPrefix: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  timestampField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  userRole: PropTypes.string,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// --- Optimization: Wrap component in React.memo to prevent re-rendering if props are unchanged ---
export default memo(NoticeCard);