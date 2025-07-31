/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { CrossIcon } from '../../assets/icons/CrossIcon';
import { DeleteIcon } from '../../assets/icons/DeleteIcon';
import { EditIcon } from '../../assets/icons/EditIcon';
import { getTimeAgo } from '../../utils/dateUtil';
import ImageGallery from '../Blog/ImageGallery';

const TagList = ({ tags }) =>
  Array.isArray(tags) && tags.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {tags.map(({ name }, i) => (
        <span
          key={i}
          className="bg-navy text-my-gray text-xs rounded px-2 py-1"
        >
          {name}
        </span>
      ))}
    </div>
  ) : null;

const ActionButtons = ({ onEdit, onDelete }) => (
  <div className="flex flex-col gap-2 mt-4 text-sm">
    <button
      onClick={onEdit}
      className="bg-purple hover:bg-purple/80 transition py-2 text-white flex items-center justify-center gap-2 rounded-lg"
    >
      <EditIcon /> Edit Notice
    </button>
    <button
      onClick={onDelete}
      className="bg-red-500 hover:bg-red-500/80 transition py-2 text-white flex items-center justify-center gap-2 rounded-lg"
    >
      <DeleteIcon /> Delete Notice
    </button>
  </div>
);

const BlogDescription = ({ blog, onClose, onEdit, onDelete, user }) => {
  const {
    title,
    tags,
    content,
    attachments,
    id,
    author_type: authorType,
    author_id: authorId,
    created_at: createdAt,
  } = blog;

  const formattedDate = useMemo(
    () =>
      new Date(createdAt).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    [createdAt]
  );

  const canModify = useMemo(
    () =>
      (user.role === 'society' && authorType === 'society') ||
      (user.role === 'resident' &&
        authorType === 'resident' &&
        authorId === user.userId),
    [user, authorType, authorId]
  );

  return (
    <div className="flex flex-col h-full bg-white px-6 py-4 font-montserrat font-medium">
      {/* Header */}
      <header className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-sm font-bold text-navy-dark">Blog Details</h2>
        <button aria-label="Close" onClick={onClose}>
          <CrossIcon />
        </button>
      </header>

      {/* Title & Meta */}
      <section className="mt-4 space-y-2">
        <h3 className="text-md font-bold text-navy-dark">{title}</h3>
        <TagList tags={tags} />
        <div className="flex flex-wrap text-xs text-dark-gray gap-4">
          <span>
            Posted by:{' '}
            <strong className="text-[#4B5563]">
              {authorType === 'society' ? 'Committee Member' : 'Society Member'}
            </strong>
          </span>
          <span>
            Posted: {formattedDate} ({getTimeAgo(createdAt)})
          </span>
        </div>
      </section>

      {/* Content */}
      <section className="mt-6 border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-navy-dark mb-2">Content</h4>
        <div
          className="prose max-w-none text-[12px] text-dark-gray leading-6 whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>

      {/* Images */}
      {attachments?.length > 0 && (
        <section className="mt-6">
          <ImageGallery images={attachments} blogId={id} />
        </section>
      )}

      {/* Edit/Delete */}
      {canModify && (
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  );
};


export default BlogDescription;
