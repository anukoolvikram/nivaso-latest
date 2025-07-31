/* eslint-disable react/prop-types */
import { DeleteIcon } from '../../assets/icons/DeleteIcon';
import { EditIcon } from '../../assets/icons/EditIcon';
import { getTimeAgo } from '../../utils/dateUtil';

const BlogCard = ({ blog, isSelected, onClick, onEdit, onDelete, user }) => {
  return (
    <div onClick={onClick}
      className={`border border-gray-200 p-4 space-y-4 font-montserrat font-medium rounded-lg bg-white hover:shadow-md transition cursor-pointer ${isSelected ? 'ring-2 ring-navy' : ''
        }`}
    >
      <div className='space-y-2'>
        <div className="font-bold text-navy-dark">{blog.title}</div>
        <div className="flex text-xs gap-2 text-[#4B5563]">
          {blog.authorName}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {Array.isArray(blog.tags) &&
            blog.tags.map((tag, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center bg-navy rounded p-1 px-2 text-xs text-my-gray"
              >
                {tag.name}
              </div>
            ))}
          <div className="text-sm text-light-gray">
            {getTimeAgo(blog.created_at || blog.post_date)}
          </div>
        </div>

        {user?.role=='society' && blog.author_type == 'society' && (
          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={e => { e.stopPropagation(); onEdit(blog.id); }}
              className="p-1 text-navy hover:text-blue-700"
              title="Edit"
            >
              <EditIcon />
            </button>
            <button
              onClick={e => { e.stopPropagation(); onDelete(blog.id); }}
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

export default BlogCard;