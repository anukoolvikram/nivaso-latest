// import { useState, useEffect, useCallback, useMemo } from 'react';
// import { useToast } from '../../context/ToastContext';
// import { uploadImageToCloudinary } from '../../utils/uploadImages';
// import { fetchUserInfo } from '../../services/authService';
// import apiClient from '../../services/apiClient';

// // Components
// import BlogList from '../Blog/BlogList';
// import BlogForm from '../Blog/BlogForm';
// import BlogDescription from '../Blog/BlogDescription';
// import Loading from '../Loading/Loading';
// import DeleteDialog from '../DeleteDialog/DeleteDialog';
// import { blogService } from '../../services/blogService';

// const ResidentCommunityBlogs = () => {
//     // --- State Management using a single 'status' string for clarity ---
//     const [status, setStatus] = useState('idle'); // idle, viewing, creating, editing, deleting
//     const [blogs, setBlogs] = useState([]);
//     const [selectedBlogId, setSelectedBlogId] = useState(null);
//     const [user, setUser] = useState(null);
//     const [activeTab, setActiveTab] = useState('community');
    
//     // Loading states
//     const [isInitializing, setIsInitializing] = useState(true);
//     const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const showToast = useToast();

//     // --- Data Fetching ---
//     useEffect(() => {
//         const initialize = async () => {
//             setIsInitializing(true);
//             try {
//                 const userData = await fetchUserInfo();
//                 setUser(userData);
//             } catch (error) {
//                 console.error("User authentication failed:", error);
//                 showToast("User authentication failed", "error");
//             } finally {
//                 setIsInitializing(false);
//             }
//         };
//         initialize();
//     }, [showToast]);

//     const fetchBlogsForTab = useCallback(async (tab, currentUser) => {
//         if (!currentUser) return; // Don't fetch if user isn't loaded
        
//         setIsLoadingBlogs(true);
//         const url = tab === 'community' ? '/blog/society/get' : '/blog/resident';
        
//         try {
//             const response = await apiClient.get(url);
//             setBlogs(response?.data || []);
//         } catch (err) {
//             console.error(err);
//             showToast('Failed to load blogs.', 'error');
//             setBlogs([]); // Clear blogs on error
//         } finally {
//             setIsLoadingBlogs(false);
//         }
//     }, [showToast]);

//     useEffect(() => {
//         // Fetch blogs when the component is initialized and the user is available, or when the tab changes.
//         if (!isInitializing) {
//             fetchBlogsForTab(activeTab, user);
//         }
//     }, [isInitializing, activeTab, user, fetchBlogsForTab]);

//     // --- Handlers ---
//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//         setSelectedBlogId(null); // Close any open blog
//         setStatus('idle');
//     };

//     // Unified save handler for create and update
//     const handleSave = async (formData) => {
//         setIsSubmitting(true);
//         const isEditing = status === 'editing';

//         try {
//             // Create a unified payload. The backend can distinguish create/update by the presence of 'id'.
//             const payload = {
//                 title: formData.title,
//                 content: formData.content,
//                 tags: formData.tags,
//                 existingImages: formData.existingImages || [],
//                 newImages: formData.newImages || []
//             };
            
//             console.log(payload)
//             if (isEditing && selectedBlogId) {
//                 await blogService.updateBlog(selectedBlogId, payload);
//             } else {
//                 await blogService.createBlog(payload);
//             }

//             showToast(isEditing ? 'Blog updated successfully!' : 'Blog posted!', 'success');
//             setStatus('idle');
//             setSelectedBlogId(null);
//             fetchBlogsForTab(activeTab, user);

//         } catch (err) {
//             console.error('Error saving blog:', err);
//             showToast(err.response?.data?.message || "Failed to save blog", "error");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
    
//     const handleDelete = async () => {
//         if (!selectedBlogId) return;
        
//         try {
//             await apiClient.delete(`/blog/delete/${selectedBlogId}`);
//             showToast('Blog deleted!', 'success');
//             setStatus('idle');
//             setSelectedBlogId(null);
//             fetchBlogsForTab(activeTab, user); // Refetch blogs after deleting
//         } catch (err) {
//             console.error('Delete failed:', err);
//             showToast(err.response?.data?.message || 'Failed to delete blog.', 'error');
//         } finally {
//             // The DeleteDialog will close because the status is no longer 'deleting'
//         }
//     };

//     const handleCancel = () => {
//         // If we were deleting, keep the ID to show the detail view again. Otherwise, clear it.
//         if (status !== 'deleting') {
//             setSelectedBlogId(null);
//         }
//         setStatus('idle');
//     };
    
//     // --- State-driven UI Actions ---
//     const handleSelectBlog = (id) => { setStatus('viewing'); setSelectedBlogId(id); };
//     const handleStartCreate = () => { setStatus('creating'); setSelectedBlogId(null); };
//     const handleStartEdit = (id) => { setStatus('editing'); setSelectedBlogId(id); };
//     const handlePromptDelete = (id) => { setStatus('deleting'); setSelectedBlogId(id); };

//     // --- Computed values for rendering ---
//     const selectedBlog = useMemo(() => blogs.find(b => b.id === selectedBlogId) || null, [blogs, selectedBlogId]);
//     const isDetailVisible = status === 'viewing' && selectedBlog;
//     const isFormVisible = status === 'creating' || status === 'editing';

//     if (isInitializing) {
//         return <Loading />;
//     }

//     return (
//         <div className="flex min-h-screen font-montserrat">
//             <div className={`${isDetailVisible ? 'w-2/3' : 'w-full'} px-6 py-4 bg-gray-100/50 flex flex-col gap-6 transition-all duration-200`}>
//                 {isFormVisible ? (
//                     <BlogForm
//                         blog={status === 'editing' ? selectedBlog : null}
//                         onSubmit={handleSave}
//                         onCancel={handleCancel}
//                         isSubmitting={isSubmitting}
//                     />
//                 ) : (
//                     <BlogList
//                         blogs={blogs}
//                         loading={isLoadingBlogs}
//                         activeTab={activeTab}
//                         onTabChange={handleTabChange}
//                         selectedBlogId={selectedBlogId}
//                         onCreateBlog={handleStartCreate}
//                         onBlogClick={(blog) => handleSelectBlog(blog.id)}
//                         user={user}
//                         onEdit={handleStartEdit}
//                         onDelete={handlePromptDelete}
//                     />
//                 )}
//             </div>

//             {isDetailVisible && (
//                 <div className="w-1/3 bg-white border-l border-gray-200">
//                     <BlogDescription
//                         blog={selectedBlog}
//                         user={user}
//                         onClose={() => { setStatus('idle'); setSelectedBlogId(null); }}
//                         onEdit={() => handleStartEdit(selectedBlog.id)}
//                         onDelete={() => handlePromptDelete(selectedBlog.id)}
//                     />
//                 </div>
//             )}
            
//             <DeleteDialog
//                 isOpen={status === 'deleting'}
//                 onCancel={() => setStatus('viewing')} // Go back to viewing the blog on cancel
//                 onConfirm={handleDelete}
//                 itemType="Blog"
//             />
//         </div>
//     );
// };

// export default ResidentCommunityBlogs;


import BlogManager from '../Blog/BlogManager'
const SocietyCommunityBlogs=()=>{
    return (
        <BlogManager variant="resident" />
    )
}

export default SocietyCommunityBlogs;