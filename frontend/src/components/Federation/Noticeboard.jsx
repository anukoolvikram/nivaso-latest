import { useEffect, useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import { PlusIcon } from '../../assets/icons/PlusIcon';
import { EmptyNoticeIcon } from '../../assets/icons/EmptyNoticeIcon';
import { createNotice, updateNotice, saveDraftNotice } from '../../services/noticeService';
import { uploadImageToCloudinary } from '../../utils/uploadImages';
import apiClient from '../../services/apiClient';
import { getTimeAgo } from '../../utils/dateUtil';
import NoticeForm from '../Notice/NoticeForm';
import Loading from '../Loading/Loading';
import NoticeCard from '../Notice/NoticeCard';
import NoticeDescription from '../Notice/FederationNoticeDescription';
import DeleteDialog from '../DeleteDialog/DeleteDialog';

const federation_notice_types = ['Announcement', 'Notice', 'General'];

export default function FederationNoticeboard() {
  // NEW: State to hold ALL notices (both drafts and published)
  const [allNotices, setAllNotices] = useState([]);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noticeToDeleteId, setNoticeToDeleteId] = useState(null);
  const showToast = useToast();
  const [showDrafts, setShowDrafts] = useState(false);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/notice/get'); 
      setAllNotices(res.data || []);
    } catch (err) {
      console.error('Error fetching all notices:', err);
      showToast('Failed to load notices', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]); 

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);


  const displayedNotices = allNotices.filter(notice => {
    return showDrafts ? notice.status === 'draft' : notice.status !== 'draft';
  });

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let finalImages = [...(formData.images || [])];
      if (formData.newImages && formData.newImages.length > 0) {
        const imageUrls = await Promise.all(formData.newImages.map(uploadImageToCloudinary));
        finalImages = [...finalImages, ...imageUrls];
      }
      const payload = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        poll_options: formData.type === 'poll' ? formData.options : [],
        images: finalImages,
        is_draft: false, 
      };
      
      if (formData.id) {
        await updateNotice(formData.id, payload);
        showToast('Notice updated successfully!', 'success');
      } else {
        await createNotice(payload);
        showToast('Notice published successfully!', 'success');
      }

      setShowForm(false);
      setEditingNotice(null);
      setViewingNotice(null);
      setShowDrafts(false); 
      fetchNotices(); 
    } catch (err) {
      console.error(err);
      showToast('Submission failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDraftSave = async (draftData) => {
    try {
      const savedDraft = await saveDraftNotice(draftData);
      setAllNotices(prevNotices => {
          const existingIndex = prevNotices.findIndex(n => n.id === savedDraft.id);
          if (existingIndex > -1) {
              const updatedNotices = [...prevNotices];
              updatedNotices[existingIndex] = savedDraft;
              return updatedNotices;
          }
          return [...prevNotices, savedDraft];
      });
      showToast('Draft saved automatically', 'info');
    } catch (err) {
      console.error('Draft save failed', err);
    }
  };

  const handleDelete = useCallback(async () => {
    if (!noticeToDeleteId) return;
    try {
      await apiClient.delete(`/notice/delete/${noticeToDeleteId}`);
      setAllNotices((prev) => prev.filter((n) => n.id !== noticeToDeleteId));
      showToast('Notice deleted', 'success');
      if (viewingNotice?.id === noticeToDeleteId) setViewingNotice(null);
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete notice', 'error');
    } finally {
      setNoticeToDeleteId(null);
    }
  }, [showToast, viewingNotice?.id, noticeToDeleteId]);
  
  const handleViewToggle = (isDraftView) => { setShowDrafts(isDraftView); setViewingNotice(null); };
  const handleShowCreateForm = useCallback(() => { setEditingNotice(null); setViewingNotice(null); setShowForm(true); }, []);
  const handleEdit = useCallback((noticeToEdit) => { setEditingNotice(noticeToEdit); setViewingNotice(null); setShowForm(true); }, []);
  const handleCancelForm = useCallback(() => { setShowForm(false); setEditingNotice(null); }, []);

  return (
    <div className="flex min-h-screen font-montserrat">
      <div className={`${viewingNotice ? 'w-2/3' : 'w-full'} px-6 py-4 bg-gray-100/50 flex flex-col gap-6 transition-all duration-200`}>
        {!showForm ? (
          <>
            <div className="flex items-center justify-between font-medium font-inter">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Federation Notices</h2>
                <div className="flex items-center p-1 bg-gray-200 rounded-lg">
                  <button onClick={() => handleViewToggle(false)} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${!showDrafts ? 'bg-white text-navy shadow' : 'text-gray-600'}`}>
                    Published
                  </button>
                  <button onClick={() => handleViewToggle(true)} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${showDrafts ? 'bg-white text-navy shadow' : 'text-gray-600'}`}>
                    Drafts
                  </button>
                </div>
              </div>
              <button onClick={handleShowCreateForm} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg shadow hover:bg-navy/80 transition">
                <PlusIcon />
                Create Notice
              </button>
            </div>

            <div className="space-y-4">
              {loading ? ( <Loading /> ) 
              : displayedNotices.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                  <EmptyNoticeIcon className="w-24 h-24 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-700">{showDrafts ? 'No drafts found' : 'No notices found'}</h3>
                  <p className="mt-1 text-gray-500">{showDrafts ? "You don't have any saved drafts." : "You haven't created any federation notices yet."}</p>
                </div>
              ) : (
                displayedNotices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    isSelected={viewingNotice?.id === notice.id}
                    onClick={() => setViewingNotice(notice)}
                    onEdit={() => handleEdit(notice)}
                    onDelete={() => setNoticeToDeleteId(notice.id)}
                    getTimeAgo={getTimeAgo}
                    showActions={true}
                    userRole="federation"
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <NoticeForm
            notice={editingNotice}
            onCancel={handleCancelForm}
            onSubmit={handleFormSubmit}
            onAutoSave={handleDraftSave}
            isSubmitting={isSubmitting}
            noticeTypes={federation_notice_types}
            userRole="federation"
          />
        )}
      </div>

      {viewingNotice && !showForm && (
        <div className="w-1/3 bg-white border-l border-gray-200">
          <NoticeDescription
            notice={viewingNotice}
            onClose={() => setViewingNotice(null)}
            onEdit={() => handleEdit(viewingNotice)}
            onDelete={() => setNoticeToDeleteId(viewingNotice.id)}
            userRole="federation"
          />
        </div>
      )}

      <DeleteDialog isOpen={Boolean(noticeToDeleteId)} onCancel={() => setNoticeToDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}