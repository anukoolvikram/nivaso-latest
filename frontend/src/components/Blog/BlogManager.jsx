/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';
import { blogService } from '../../services/blogService';
import { fetchUserInfo } from '../../services/authService';
// Components
import BlogList from '../Blog/BlogList';
import BlogForm from '../Blog/BlogForm';
import BlogDescription from '../Blog/BlogDescription';
import Loading from '../Loading/Loading';
import DeleteDialog from '../DeleteDialog/DeleteDialog';

const BlogManager = ({ variant = 'society' }) => {
    const [status, setStatus] = useState('idle'); 
    const [blogs, setBlogs] = useState([]);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    // Loading states
    const [isInitializing, setIsInitializing] = useState(true);
    const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const showToast = useToast();

    // API endpoint configuration based on variant
    const apiConfig = useMemo(() => ({
        society: {
            all: () => blogService.getSocietyBlogs(),
            personal: () => blogService.getSocietyBlogs(),
        },
        resident: {
            all: () => blogService.getSocietyBlogs(),
            personal: () => blogService.getResidentBlogs(),
        }
    }), []);

    // Initialize user data
    useEffect(() => {
        const initialize = async () => {
            setIsInitializing(true);
            try {
                const userData = await fetchUserInfo();
                setUser(userData);
            } catch (error) {
                console.error("User authentication failed:", error);
                showToast("User authentication failed", "error");
            } finally {
                setIsInitializing(false);
            }
        };
        initialize();
    }, [showToast]);

    // Fetch blogs based on active tab
    const fetchBlogsForTab = useCallback(async (tab, currentUser) => {
        if (!currentUser && tab === 'personal') return;
        
        setIsLoadingBlogs(true);
        try {
            let response;
            if (tab === 'all') {
                response = await apiConfig[variant].all();
            } else {
                response = await apiConfig[variant].personal(currentUser.id);
            }
            setBlogs(response?.data || []);
        } catch (err) {
            console.error(err);
            showToast('Failed to load blogs.', 'error');
            setBlogs([]);
        } finally {
            setIsLoadingBlogs(false);
        }
    }, [showToast, variant, apiConfig]);

    // Trigger fetch when dependencies change
    useEffect(() => {
        if (!isInitializing) {
            fetchBlogsForTab(activeTab, user);
        }
    }, [isInitializing, activeTab, user, fetchBlogsForTab]);

    // Tab change handler
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedBlogId(null);
        setStatus('idle');
    };

    // Unified save handler for create and update
    const handleSave = async (formData) => {
        setIsSubmitting(true);
        const isEditing = status === 'editing';

        try {
            const payload = {
                title: formData.title,
                content: formData.content,
                tags: formData.tags,
                existingImages: formData.existingImages || [],
                newImages: formData.newImages || []
            };
            
            if (isEditing && selectedBlogId) {
                await blogService.updateBlog(selectedBlogId, payload);
            } else {
                await blogService.createBlog(payload);
            }

            showToast(isEditing ? 'Blog updated successfully!' : 'Blog posted!', 'success');
            setStatus('idle');
            setSelectedBlogId(null);
            fetchBlogsForTab(activeTab, user);

        } catch (err) {
            console.error('Error saving blog:', err);
            showToast(err.response?.data?.message || "Failed to save blog", "error");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Delete handler
    const handleDelete = async () => {
        if (!selectedBlogId) return;
        
        try {
            await blogService.deleteBlog(selectedBlogId);
            showToast('Blog deleted!', 'success');
            setStatus('idle');
            setSelectedBlogId(null);
            fetchBlogsForTab(activeTab, user);
        } catch (err) {
            console.error('Delete failed:', err);
            showToast(err.response?.data?.message || 'Failed to delete blog.', 'error');
        }
    };

    // Cancel/close handler
    const handleCancel = () => {
        if (status !== 'deleting') {
            setSelectedBlogId(null);
        }
        setStatus('idle');
    };
    
    // UI action handlers
    const handleSelectBlog = (id) => { setStatus('viewing'); setSelectedBlogId(id); };
    const handleStartCreate = () => { setStatus('creating'); setSelectedBlogId(null); };
    const handleStartEdit = (id) => { setStatus('editing'); setSelectedBlogId(id); };
    const handlePromptDelete = (id) => { setStatus('deleting'); setSelectedBlogId(id); };

    // Computed values
    const selectedBlog = useMemo(() => blogs.find(b => b.id === selectedBlogId) || null, [blogs, selectedBlogId]);
    const isDetailVisible = status === 'viewing' && selectedBlog;
    const isFormVisible = status === 'creating' || status === 'editing';

    if (isInitializing) {
        return <Loading />;
    }

    return (
        <div className="flex min-h-screen font-montserrat">
            <div className={`${isDetailVisible ? 'w-2/3' : 'w-full'} px-6 py-4 bg-gray-100/50 flex flex-col gap-6 transition-all duration-200`}>
                {isFormVisible ? (
                    <BlogForm
                        blog={status === 'editing' ? selectedBlog : null}
                        onSubmit={handleSave}
                        onCancel={handleCancel}
                        isSubmitting={isSubmitting}
                    />
                ) : (
                    <BlogList
                        blogs={blogs}
                        loading={isLoadingBlogs}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        selectedBlogId={selectedBlogId}
                        onCreateBlog={handleStartCreate}
                        onBlogClick={(blog) => handleSelectBlog(blog.id)}
                        user={user}
                        onEdit={handleStartEdit}
                        onDelete={handlePromptDelete}
                    />
                )}
            </div>

            {isDetailVisible && (
                <div className="w-1/3 bg-white border-l border-gray-200">
                    <BlogDescription
                        blog={selectedBlog}
                        user={user}
                        onClose={handleCancel}
                        onEdit={() => handleStartEdit(selectedBlog.id)}
                        onDelete={() => handlePromptDelete(selectedBlog.id)}
                    />
                </div>
            )}
            
            <DeleteDialog
                isOpen={status === 'deleting'}
                onCancel={() => setStatus('viewing')}
                onConfirm={handleDelete}
                itemType="Blog"
            />
        </div>
    );
};

export default BlogManager;