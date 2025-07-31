import { useEffect, useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import { PlusIcon } from '../../assets/icons/PlusIcon';
import { EmptyNoticeIcon } from '../../assets/icons/EmptyNoticeIcon';
// Import services and utilities
import { createNotice, updateNotice } from '../../services/noticeService';
import { uploadImageToCloudinary } from '../../utils/uploadImages';
import apiClient from '../../services/apiClient';
import { getTimeAgo } from '../../utils/dateUtil';
// Components
import NoticeForm from '../Notice/NoticeForm';
import Loading from '../Loading/Loading';
import NoticeCard from '../Notice/NoticeCard';
import NoticeDescription from '../Notice/FederationNoticeDescription';
import DeleteDialog from '../DeleteDialog/DeleteDialog';


const federation_notice_types = ['Announcement', 'Notice', 'General']

export default function FederationNoticeboard() {
  const [notices, setNotices] = useState([]);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noticeToDeleteId, setNoticeToDeleteId] = useState(null);
  const showToast = useToast();

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/notice/get');
      setNotices(res.data || []);
    } catch (err) {
      console.error('Error fetching notices:', err);
      showToast('Failed to load notices', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);


  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const imageUrls = await Promise.all(
        formData.newImages.map(uploadImageToCloudinary)
      );
      const finalImages = [...(formData.images || []), ...imageUrls];
      const payload = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        poll_options: formData.type === 'poll' ? formData.options : [],
        images: finalImages,
      };
      const isEditing = Boolean(formData.id);

      if (isEditing) {
        await updateNotice(formData.id, payload);
        showToast('Notice updated successfully!', 'success');
      } else {
        await createNotice(payload);
        showToast('Notice published successfully!', 'success');
      }
      setShowForm(false);
      setEditingNotice(null);
      setViewingNotice(null);
      fetchNotices();

    } catch (err) {
      console.log(err)
      showToast('Submission failed.', 'error');
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
  }, [showToast, viewingNotice?.id, noticeToDeleteId]);


  const handleShowCreateForm = useCallback(() => {
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
      {/* Notice List Section */}
      <div className={`${viewingNotice ? 'w-2/3' : 'w-full'} px-6 py-4 bg-gray-100/50 flex flex-col gap-6 transition-all duration-200`}>
        {!showForm ? (
          <>
            <div className="flex items-center justify-between font-medium font-inter">
              <h2 className="text-xl font-semibold text-gray-800">Federation Notices</h2>
              <button onClick={handleShowCreateForm} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg shadow hover:bg-navy/80 transition">
                <PlusIcon />
                Create Notice
              </button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <Loading />
              ) : notices.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                  <EmptyNoticeIcon className="w-24 h-24 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-700">No notices found</h3>
                  <p className="mt-1 text-gray-500">You haven&apos;t created any federation notices yet.</p>
                </div>
              ) : (
                notices.map(notice => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    isSelected={viewingNotice?.id === notice.id}
                    onClick={() => setViewingNotice(notice)}
                    onEdit={() => handleEdit(notice)}
                    onDelete={() => setNoticeToDeleteId(notice.id)}
                    getTimeAgo={getTimeAgo}
                    showActions={true}
                    userRole='federation'
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
            isSubmitting={isSubmitting}
            noticeTypes={federation_notice_types}
            userRole='federation'
          />
        )}
      </div>

      {/* Notice Description Section */}
      {viewingNotice && !showForm && (
        <div className="w-1/3 bg-white border-l border-gray-200">
          <NoticeDescription
            notice={viewingNotice}
            onClose={() => setViewingNotice(null)}
            onEdit={() => handleEdit(viewingNotice)}
            onDelete={() => setNoticeToDeleteId(viewingNotice.id)}
            userRole='federation'
          />
        </div>
      )}

      <DeleteDialog
        isOpen={Boolean(noticeToDeleteId)}
        onCancel={() => setNoticeToDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}