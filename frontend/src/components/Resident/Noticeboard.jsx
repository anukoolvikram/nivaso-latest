import { useEffect, useState, useMemo, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../services/apiClient';
import { fetchUserInfo } from '../../services/authService';
import { createNotice, updateNotice } from '../../services/noticeService';
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
      showToast("Could not load data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchNoticesAndUser();
  }, [fetchNoticesAndUser]);

  const filteredNotices = useMemo(() => {
    if (activeTab === 'mine') {
      return notices.filter((n) => n.author_type === 'resident' && n.author_id === currentUser?.userId);
    }
    return notices;
  }, [notices, activeTab, currentUser]);

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let finalImages = [...(formData.images || [])];
      if (formData.newImages?.length > 0) {
        const imageUrls = await Promise.all(formData.newImages.map(uploadImageToCloudinary));
        finalImages = [...finalImages, ...imageUrls];
      }
      const payload = { ...formData, images: finalImages };
      
      if (editingNotice?.id) {
        await updateNotice(editingNotice.id, payload);
        showToast('Notice updated!', 'success');
      } else {
        await createNotice(payload);
        showToast('Submitted for approval!', 'success');
      }
      setShowForm(false);
      setEditingNotice(null);
      fetchNoticesAndUser();
    } catch (err) {
      showToast('Submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen font-montserrat bg-gray-50">
      {/* List Section: Hidden when form is shown */}
      {!showForm && (
        <div className={`
          flex-1 min-w-0 overflow-y-auto px-4 py-6 md:px-8
          ${viewingNotice ? 'hidden lg:block lg:w-2/3' : 'w-full'}
        `}>
          <NoticeList
            notices={filteredNotices}
            loading={loading}
            activeTab={activeTab}
            tabs={TABS}
            onTabChange={(tab) => { setActiveTab(tab); setViewingNotice(null); }}
            onNoticeClick={setViewingNotice}
            onCreateNotice={() => { setEditingNotice(null); setShowForm(true); setViewingNotice(null); }}
            viewingNoticeId={viewingNotice?.id}
            handleEdit={(n) => { setEditingNotice(n); setShowForm(true); setViewingNotice(null); }}
            handleDelete={setNoticeToDeleteId}
            userRole='resident'
          />
        </div>
      )}

      {/* Form Section: Full width when shown */}
      {showForm && (
        <div className="w-full overflow-y-auto bg-gray-50 px-4 py-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <NoticeForm
              notice={editingNotice}
              onCancel={() => { setShowForm(false); setEditingNotice(null); }}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
              noticeTypes={['Lost & Found', 'General', 'Maintenance']}
              userRole='resident'
            />
          </div>
        </div>
      )}

      {/* Detail Section: Overlay on mobile, side-panel on desktop */}
      {viewingNotice && !showForm && (
        <div className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-0 lg:w-1/3 bg-white border-l border-gray-200 shadow-2xl lg:shadow-none overflow-y-auto">
          <NoticeDescription
            user={currentUser}
            notice={viewingNotice}
            onClose={() => setViewingNotice(null)}
            onEdit={() => { setEditingNotice(viewingNotice); setShowForm(true); }}
            onDelete={() => setNoticeToDeleteId(viewingNotice.id)}
            onNoticeUpdate={fetchNoticesAndUser}
            userRole='resident'
          />
        </div>
      )}

      <DeleteDialog
        isOpen={Boolean(noticeToDeleteId)}
        onCancel={() => setNoticeToDeleteId(null)}
        onConfirm={async () => {
            await apiClient.delete(`/notice/delete/${noticeToDeleteId}`);
            setNotices(prev => prev.filter(n => n.id !== noticeToDeleteId));
            setNoticeToDeleteId(null);
            setViewingNotice(null);
            showToast('Deleted successfully', 'success');
        }}
      />
    </div>
  );
};

export default ResidentNoticeboard;