/* eslint-disable react/prop-types */
import { PlusIcon } from '../../assets/icons/PlusIcon';
import { EmptyNoticeIcon } from '../../assets/icons/EmptyNoticeIcon';
import BlogCard from './BlogCard';

const BlogList = ({
  blogs,
  loading,
  activeTab,
  onTabChange,
  onBlogClick,
  onCreateBlog,
  selectedBlogId,
  user,
  onEdit,
  onDelete
}) => {
  return (
    <>
      {/* Tab Buttons */}
      {user?.role==='resident' ?
        <div className="flex items-center justify-between font-medium font-inter">
          <div className="flex p-1 rounded-lg bg-gray-100">
            <button
              onClick={() => onTabChange('all')}
              className={`px-4 py-2 rounded-lg transition ${activeTab === 'all'
                ? 'bg-white text-navy shadow-sm'
                : 'text-navy/70 hover:text-navy'
                }`}
            >
              All Blogs
            </button>
            <button
              onClick={() => onTabChange('user')}
              className={`px-4 py-2 rounded-lg transition ${activeTab === 'user'
                ? 'bg-white text-navy shadow-sm'
                : 'text-navy/70 hover:text-navy'
                }`}
            >
              My Blogs
            </button>
          </div>
          <button onClick={onCreateBlog} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg shadow hover:bg-navy/80 transition">
            <PlusIcon />
            Write Blog
          </button>
        </div>
        :
        <div className='flex justify-end'>
          <button onClick={onCreateBlog} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg shadow hover:bg-navy/80 transition">
            <PlusIcon />
            Write Blog
          </button>
        </div>
      }

      {/* Blog List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-navy"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <EmptyNoticeIcon className="w-24 h-24 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-700">No blogs found</h3>
            <p className="mt-1 text-gray-500">
              {activeTab === 'community'
                ? "There are no blogs available."
                : "You haven't created any blogs yet."}
            </p>
            {activeTab === 'community' && (
              <button
                onClick={onCreateBlog}
                className="mt-6 flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg shadow hover:bg-navy/80 transition"
              >
                <PlusIcon />
                Create your first blog
              </button>
            )}
          </div>
        ) : (
          blogs?.map((blog, index) => (
            <BlogCard
              key={index}
              blog={blog}
              isSelected={selectedBlogId === blog.id}
              onClick={() => onBlogClick(blog)}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </>
  );
};

export default BlogList;