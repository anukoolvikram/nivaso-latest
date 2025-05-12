import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TAGS = ['Event', 'Buy & Sell', 'Awareness', 'Advertisement'];

const ResidentCommunity = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // decode token
  let decoded = null;
  const token = localStorage.getItem('token');
  if (token) {
    decoded = jwtDecode(token);
  }

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/blogs/get-blogs', {
          params: {
            society_id: decoded?.society_code 
          }
        });

        // console.log('heyy')
        // console.log(response.data);

        // Add editable flag to each blog
        const blogsWithEditable = response.data.map(blog => ({
          ...blog,
          editable: blog.author_id === decoded?.id
        }));
        // console.log('hiii')
        // console.log(blogsWithEditable);

        setBlogs(blogsWithEditable || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs. Please try again.');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (decoded?.society_code) {
      fetchBlogs();
    }
  }, [decoded?.society_code]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleEditClick = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setSelectedTags(blog.tags || []);
    setSelectedBlog(blog);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleBlogSubmit = async () => {
    if (!title.trim() || !content.trim() || selectedTags.length === 0) {
      alert('Please enter title, content, and select at least one tag.');
      return;
    }
  
    try {
      let response;
      
      if (isEditing && selectedBlog) {

        console.log('selected blog', selectedBlog);
        // Update existing blog
        response = await axios.put(`http://localhost:5000/blogs/update-blog/${selectedBlog.post_id || selectedBlog.id}`, {
          title,
          content,
          tags: selectedTags,
        });
      } else {
        // Create new blog
        const newBlog = {
          title,
          content,
          tags: selectedTags,
          author: decoded?.id || 'Anonymous',
          society_id: decoded?.society_code
        };
        
        response = await axios.post('http://localhost:5000/blogs/add-blog', {
          blog: newBlog  
        });
      }
      
      if (response.data.success) {
        const updatedBlog = response.data.blog || response.data;
        
        // Update the blogs list
        if (isEditing) {
          setBlogs(blogs.map(blog => 
            blog.post_id === updatedBlog.post_id ? { ...updatedBlog, editable: true } : blog
          ));
        } else {
          setBlogs([{ ...updatedBlog, editable: true }, ...blogs]);
        }
        
        // Reset form
        resetForm();
        
        // Optional: Fetch the latest blogs from server to ensure consistency
        const refreshResponse = await axios.get('http://localhost:5000/blogs/get-blogs', {
          params: { society_id: decoded?.society_code }
        });
        
        const refreshedBlogs = refreshResponse.data.map(blog => ({
          ...blog,
          editable: blog.author_id === decoded?.id
        }));
        
        setBlogs(refreshedBlogs || []);
        
      } else {
        setError(response.data.error || 'Failed to submit blog');
      }
    } catch (error) {
      console.error('Error submitting blog:', error);
      setError(error.response?.data?.message || 
               error.response?.data?.error || 
               'Failed to submit blog. Please try again.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedTags([]);
    setSelectedBlog(null);
    setIsEditing(false);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="p-4 max-w-xl mx-auto flex justify-center items-center h-64">
        <div className="text-lg">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {!showForm && !selectedBlog && (
        <div>
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => setShowForm(true)}
          >
            Write Blog
          </button>
          
          {blogs.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No blogs yet. Be the first to write one!
            </div>
          ) : (
            <ul className="space-y-4">
              {blogs.map((blog) => (
                <li
                  key={blog.post_id || blog.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <div 
                    className="cursor-pointer"
                    onClick={() => setSelectedBlog(blog)}
                  >
                    <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {blog.tags?.map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {blog.editable && (
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(blog);
                        }}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {(showForm || isEditing) && (
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              placeholder="Write your blog content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tags (select at least one)
            </label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full border transition-colors text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBlogSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              disabled={!title.trim() || !content.trim() || selectedTags.length === 0}
            >
              {isEditing ? 'Update' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {selectedBlog && !isEditing && (
        <div className="mt-4 border p-6 rounded-lg bg-white shadow-sm">
          <button
            onClick={() => setSelectedBlog(null)}
            className="mb-4 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
          >
            ← Back to Blogs
          </button>
          
          <h2 className="text-2xl font-bold mb-4">{selectedBlog.title}</h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedBlog.tags?.map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="prose max-w-none">
            {selectedBlog.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t text-sm text-gray-500">
            Posted by: {selectedBlog.author_name || 'Anonymous'}
          </div>

          {selectedBlog.editable && (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleEditClick(selectedBlog)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                Edit Post
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResidentCommunity;