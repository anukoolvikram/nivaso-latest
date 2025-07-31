import { useEffect, useState, useMemo, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../services/apiClient';
import { fetchUserInfo } from '../../services/authService';
import { createNotice, updateNotice } from '../../services/noticeService'; // Assumed service
import NoticeList from '../Notice/NoticeList';
import NoticeDescription from '../Notice/NoticeDescription';
import NoticeForm from '../Notice/NoticeForm';
import DeleteDialog from '../DeleteDialog/DeleteDialog';
import { uploadImageToCloudinary } from '../../utils/uploadImages';

const TABS = {
  all: 'All Notices',
  mine: 'My Notices',
};

const ResidentNoticeboard = () => {
  const showToast = useToast();
  const [notices, setNotices] = useState([]);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const [noticeToDeleteId, setNoticeToDeleteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNoticesAndUser = useCallback(async () => {
    setLoading(true);
    try {
      const [userData, noticeResponse] = await Promise.all([
        fetchUserInfo(),
        apiClient.get(`/notice/get`),
      ]);
      setCurrentUser(userData);
      setNotices(noticeResponse.data);
    } catch (error) {
      console.error("Invalid token or error fetching data:", error);
      showToast("User authentication failed or could not load data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchNoticesAndUser();
  }, [fetchNoticesAndUser]);

  const filteredNotices = useMemo(() => {
    if (activeTab === 'mine') {
      return notices.filter((notice) => notice.author_type=='resident' && notice.author_id === currentUser.userId);
    }
    else{
      return notices;
    }
  }, [notices, activeTab, currentUser]); 


  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let finalImages = [...(formData.images || [])];
      if (formData.newImages && formData.newImages.length > 0) {
        const imageUrls = await Promise.all(
          formData.newImages.map(uploadImageToCloudinary)
        );
        finalImages = [...finalImages, ...imageUrls];
      }
      const payload = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        images: finalImages,
      };
      const isEditing = Boolean(editingNotice?.id);
      if (isEditing) {
        await updateNotice(editingNotice.id, payload);
        showToast('Notice updated successfully!', 'success');
      } else {
        await createNotice(payload);
        showToast('Notice submitted for approval!', 'success');
      }
      setShowForm(false);
      setEditingNotice(null);
      setViewingNotice(null);
      setActiveTab('all'); 
      fetchNoticesAndUser(); 
    } catch (err) {
      console.log(err)
      showToast('Submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = useCallback(async () => {
    if (!noticeToDeleteId) return;
    try {
      await apiClient.delete(`/notice/delete/${noticeToDeleteId}`);
      setNotices((prev) => prev.filter((n) => n.id !== noticeToDeleteId));
      showToast('Notice deleted', 'success');
      if (viewingNotice?.id === noticeToDeleteId) {
        setViewingNotice(null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete notice', 'error');
    } finally {
      setNoticeToDeleteId(null);
    }
  }, [showToast, viewingNotice, noticeToDeleteId]);


  const handleNoticeUpdate = async (noticeId) => {
    try {
      const response = await apiClient.get(`/notice/get/${noticeId}`);
      const updatedNotice = response.data[0];
      setNotices(prev => prev.map(n => n.id === noticeId ? updatedNotice : n));
      setViewingNotice(updatedNotice);
    } catch (error) {
      console.error("Error updating notice:", error);
    }
  };
  
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setViewingNotice(null);
  }, []);

  const handleNoticeClick = useCallback((notice) => {
    setViewingNotice(notice);
  }, []);

  const handleCreateNotice = useCallback(() => {
    setEditingNotice(null);
    setViewingNotice(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((noticeToEdit) => {
    setEditingNotice(noticeToEdit);
    setViewingNotice(null);
    setShowForm(true);
  }, []);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingNotice(null);
  }, []);

  return (
    <div className="flex min-h-screen font-montserrat">
      <div className={`${viewingNotice ? 'w-2/3' : 'w-full'} px-6 py-4 bg-gray-100/50 flex flex-col gap-6 transition-all duration-200`}>
        {/* List View */}
        {!showForm && (
          <NoticeList
            notices={filteredNotices}
            loading={loading}
            activeTab={activeTab}
            tabs={TABS}
            onTabChange={handleTabChange}
            onNoticeClick={handleNoticeClick}
            onCreateNotice={handleCreateNotice}
            viewingNoticeId={viewingNotice?.id}
            handleEdit={handleEdit}
            handleDelete={(id) => setNoticeToDeleteId(id)}
            userRole='resident'
          />
        )}

        {/* Form View */}
        {showForm && (
          <NoticeForm
            notice={editingNotice}
            onCancel={handleCancelForm}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            noticeTypes={['Lost & Found']}
            userRole='resident'
          />
        )}
      </div>

      {/* Detail View (Slide Panel) */}
      {viewingNotice && !showForm && (
        <div className="w-1/3 bg-white border-l border-gray-200">
          <NoticeDescription
            user={currentUser}
            notice={viewingNotice}
            onClose={() => setViewingNotice(null)}
            onEdit={() => handleEdit(viewingNotice)}
            onDelete={() => setNoticeToDeleteId(viewingNotice.id)}
            onNoticeUpdate={handleNoticeUpdate}
            userRole='resident'
          />
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={Boolean(noticeToDeleteId)}
        onCancel={() => setNoticeToDeleteId(null)}
        onConfirm={handleDelete}
        itemType="Notice"
      />
    </div>
  );
};

export default ResidentNoticeboard;