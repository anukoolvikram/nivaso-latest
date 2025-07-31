// import { useState, useEffect, useCallback } from 'react';
// import { useToast } from '../../context/ToastContext';
// import { blogService } from '../../services/blogService';
// import { fetchUserInfo } from '../../services/authService';
// // Components
// import BlogList from '../Blog/BlogList';
// import BlogForm from '../Blog/BlogForm';
// import BlogDescription from '../Blog/BlogDescription';
// import Loading from '../Loading/Loading';
// import DeleteDialog from '../DeleteDialog/DeleteDialog';

// const SocietyCommunityBlogs = () => {
//     const [status, setStatus] = useState('idle');
//     const [blogs, setBlogs] = useState([]);
//     const [selectedBlogId, setSelectedBlogId] = useState(null);
//     const [user, setUser] = useState(null);
//     const [activeTab, setActiveTab] = useState('community');
//     // Loading States
//     const [isInitializing, setIsInitializing] = useState(true);
//     const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const showToast = useToast();

//     useEffect(() => {
//         const initialize = async () => {
//             try {
//                 const userData = await fetchUserInfo();
//                 setUser(userData);
//             } catch (error) {
//                 console.error("Invalid token or error fetching user data:", error);
//                 showToast("User authentication failed", "error");
//             } finally {
//                 setIsInitializing(false);
//             }
//         };
//         initialize();
//     }, [showToast]);


//     const fetchBlogsForTab = useCallback(async (tab, currentUser) => {
//         setIsLoadingBlogs(true);
//         setBlogs([]);
//         try {
//             let response;
//             if (tab === 'community') {
//                 response = await blogService.getBlogs();
//             } else if (currentUser) {
//                 response = await blogService.getUserBlogs(currentUser.id);
//             }
//             setBlogs(response?.data || []);
//         } catch (err) {
//             console.error(err);
//             showToast('Failed to load blogs. Please try again.', 'error');
//         } finally {
//             setIsLoadingBlogs(false);
//         }
//     }, [showToast]);

//     useEffect(() => {
//         if (!isInitializing) {
//             fetchBlogsForTab(activeTab, user);
//         }
//     }, [isInitializing, activeTab, user, fetchBlogsForTab]);

//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//         setSelectedBlogId(null);
//     };

//     const handleSave = async (blogData) => {
//         setIsSubmitting(true);
//         const isEditing = status === 'editing';
//         try {
//             const payload = {
//                 title: blogData.title,
//                 content: blogData.content,
//                 tags: blogData.tags,
//                 existingImages: blogData.existingImages || [],
//                 newImages: blogData.newImages || []
//             };

//             if (isEditing && selectedBlogId) {
//                 await blogService.updateBlog(selectedBlogId, payload);
//             } else {
//                 await blogService.createBlog(payload);
//             }

//             showToast(isEditing ? 'Blog updated successfully!' : 'Blog posted!', 'success');
//             setSelectedBlogId(null);
//             setStatus('idle');
//             fetchBlogsForTab(activeTab, user);
//         } catch (err) {
//             console.error(err);
//             showToast(err.response?.data?.message || 'Failed to save blog.', 'error');
//             setStatus('idle');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleDelete = async () => {
//         if (!selectedBlogId) return;
//         try {
//             await blogService.deleteBlog(selectedBlogId);
//             showToast('Blog deleted successfully!', 'success');
//             setSelectedBlogId(null);
//             setStatus('idle');
//             fetchBlogsForTab(activeTab, user);
//         } catch (err) {
//             console.error(err);
//             const msg = err.response?.data?.error || 'Failed to delete blog.';
//             showToast(msg, 'error');
//             setStatus('idle');
//         }
//     };

//     const handleSelectBlog = (id) => {
//         setSelectedBlogId(id);
//         setStatus('viewing');
//     };

//     const handleStartCreate = () => {
//         setSelectedBlogId(null);
//         setStatus('creating');
//     };

//     const handleStartEdit = (id) => {
//         setSelectedBlogId(id);
//         setStatus('editing');
//     };

//     const handlePromptDelete = (id) => {
//         setSelectedBlogId(id);
//         setStatus('deleting');
//     };

//     const handleCancel = () => {
//         setStatus('idle');
//         if (status !== 'deleting') {
//             setSelectedBlogId(null);
//         }
//     };

//     const selectedBlog = blogs.find(b => b.id === selectedBlogId) || null;
//     const editingBlog = status === 'editing' ? selectedBlog : null;

//     const isFormVisible = ['creating', 'editing'].includes(status);
//     const isDetailVisible = status === 'viewing' && selectedBlog;

//     if (isInitializing) {
//         return <Loading />;
//     }

//     return (
//         <div className="flex min-h-screen font-medium font-montserrat">
//             <div className={`${isDetailVisible ? 'w-2/3' : 'w-full'} px-6 py-4 bg-gray-100/50 flex flex-col gap-6 transition-all duration-200`}>
//                 {isFormVisible ? (
//                     <BlogForm
//                         blog={editingBlog}
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
//                         onClose={handleCancel}
//                         onEdit={() => handleStartEdit(selectedBlog.id)}
//                         onDelete={() => handlePromptDelete(selectedBlog.id)}
//                         user={user}
//                     />
//                 </div>
//             )}

//             <DeleteDialog
//                 isOpen={status === 'deleting'}
//                 onCancel={handleCancel}
//                 onConfirm={handleDelete}
//             />
//         </div>
//     );
// };

// export default SocietyCommunityBlogs;


import BlogManager from '../Blog/BlogManager'
const SocietyCommunityBlogs=()=>{
    return (
        <BlogManager variant="society" />
    )
}

export default SocietyCommunityBlogs;