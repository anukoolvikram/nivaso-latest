// /* eslint-disable react/prop-types */
// import { useMemo } from 'react';
// import { CrossIcon } from '../../assets/icons/CrossIcon';
// import { DeleteIcon } from '../../assets/icons/DeleteIcon';
// import { EditIcon } from '../../assets/icons/EditIcon';
// import { getTimeAgo } from '../../utils/dateUtil';
// import ImageGallery from '../Blog/ImageGallery';

// const TagList = ({ tags }) =>
//   Array.isArray(tags) && tags.length > 0 ? (
//     <div className="flex flex-wrap gap-2">
//       {tags.map(({ name }, i) => (
//         <span
//           key={i}
//           className="bg-navy text-my-gray text-xs rounded px-2 py-1"
//         >
//           {name}
//         </span>
//       ))}
//     </div>
//   ) : null;

// const ActionButtons = ({ onEdit, onDelete }) => (
//   <div className="flex flex-row gap-3 pt-4 mt-4 border-t border-gray-100 text-sm">
//     <button
//       onClick={onEdit}
//       className="flex-1 bg-purple hover:bg-purple/80 transition py-2 text-white flex items-center justify-center gap-2 rounded-lg"
//     >
//       <EditIcon /> <span className="whitespace-nowrap">Edit</span>
//     </button>
//     <button
//       onClick={onDelete}
//       className="flex-1 bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition py-2 flex items-center justify-center gap-2 rounded-lg"
//     >
//       <DeleteIcon /> <span className="whitespace-nowrap">Delete</span>
//     </button>
//   </div>
// );

// const BlogDescription = ({ blog, onClose, onEdit, onDelete, user }) => {
//   const {
//     title,
//     tags,
//     content,
//     attachments,
//     id,
//     author_type: authorType,
//     author_id: authorId,
//     created_at: createdAt,
//   } = blog;

//   const formattedDate = useMemo(
//     () =>
//       new Date(createdAt).toLocaleString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       }),
//     [createdAt]
//   );

//   const canModify = useMemo(
//     () =>
//       (user.role === 'society' && authorType === 'society') ||
//       (user.role === 'resident' &&
//         authorType === 'resident' &&
//         authorId === user.userId),
//     [user, authorType, authorId]
//   );

//   return (
//     <div className="flex flex-col h-full bg-white px-6 py-4 font-montserrat font-medium">
//       {/* Header */}
//       <header className="flex items-center justify-between pb-4 border-b border-gray-200">
//         <h2 className="text-sm font-bold text-navy-dark">Blog Details</h2>
//         <button aria-label="Close" onClick={onClose}>
//           <CrossIcon />
//         </button>
//       </header>

//       {/* Title & Meta */}
//       <section className="mt-4 space-y-2">
//         <h3 className="text-md font-bold text-navy-dark">{title}</h3>
//         <TagList tags={tags} />
//         <div className="flex flex-wrap text-xs text-dark-gray gap-4">
//           <span>
//             Posted by:{' '}
//             <strong className="text-[#4B5563]">
//               {authorType === 'society' ? 'Committee Member' : 'Society Member'}
//             </strong>
//           </span>
//           <span>
//             Posted: {formattedDate} ({getTimeAgo(createdAt)})
//           </span>
//         </div>
//       </section>

//       {/* Content */}
//       <section className="mt-6 border-b border-gray-200 pb-6">
//         <h4 className="text-sm font-semibold text-navy-dark mb-2">Content</h4>
//         <div
//           className="prose max-w-none text-[12px] text-dark-gray leading-6 whitespace-pre-line"
//           dangerouslySetInnerHTML={{ __html: content }}
//         />
//       </section>

//       {/* Images */}
//       {attachments?.length > 0 && (
//         <section className="mt-6">
//           <ImageGallery images={attachments} blogId={id} />
//         </section>
//       )}

//       {/* Edit/Delete */}
//       {canModify && (
//         <ActionButtons onEdit={onEdit} onDelete={onDelete} />
//       )}
//     </div>
//   );
// };


// export default BlogDescription;


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
  <div className="flex flex-row gap-3 mt-6 pt-6 border-t border-gray-200 text-sm">
    <button
      onClick={onEdit}
      className="flex-1 bg-purple hover:bg-purple/80 transition py-2.5 text-white flex items-center justify-center gap-2 rounded-lg font-medium"
    >
      <EditIcon /> <span className="whitespace-nowrap">Edit</span>
    </button>
    <button
      onClick={onDelete}
      className="flex-1 bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition py-2.5 flex items-center justify-center gap-2 rounded-lg font-medium"
    >
      <DeleteIcon /> <span className="whitespace-nowrap">Delete</span>
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
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Header - Sticky */}
      <header className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-navy-dark">Blog Details</h2>
        <button 
          aria-label="Close" 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <CrossIcon />
        </button>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Title & Meta */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-navy-dark leading-tight">{title}</h3>
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
        <section className="space-y-3">
          <h4 className="text-sm font-semibold text-navy-dark">Content</h4>
          <div
            className="prose max-w-none text-sm text-dark-gray leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </section>

        {/* Images */}
        {attachments?.length > 0 && (
          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-navy-dark">Attachments</h4>
            <ImageGallery images={attachments} blogId={id} />
          </section>
        )}

        {/* Edit/Delete Buttons */}
        {canModify && (
          <ActionButtons onEdit={onEdit} onDelete={onDelete} />
        )}
      </div>
    </div>
  );
};

export default BlogDescription;