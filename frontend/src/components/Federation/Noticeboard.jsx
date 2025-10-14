/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback, useRef } from 'react';
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
  const [allNotices, setAllNotices] = useState([]);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noticeToDeleteId, setNoticeToDeleteId] = useState(null);
  const showToast = useToast();
  const [showDrafts, setShowDrafts] = useState(false);
  const [unsavedFormData, setUnsavedFormData] = useState(null);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const autoSaveTimeoutRef = useRef(null);

  const formStateRef = useRef({ showForm, unsavedFormData });
  useEffect(() => {
    formStateRef.current = { showForm, unsavedFormData };
  }, [showForm, unsavedFormData]);

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

  // Auto-save function
  const handleAutoSave = useCallback(async (formData) => {
    if (!formData || (!formData.title?.trim() && !formData.content?.trim())) {
      return;
    }
    try {
      const draftPayload = {
        id: formData.id || currentDraftId,
        title: formData.title || '',
        content: formData.content || '',
        type: formData.type || '',
        poll_options: formData.type === 'poll' ? formData.options : [],
        images: formData.images || [],
        status: 'draft',
      };
      const savedDraft = await saveDraftNotice(draftPayload);
      if (!currentDraftId) {
        setCurrentDraftId(savedDraft.id);
      }
      setAllNotices(prevNotices => {
        const existingIndex = prevNotices.findIndex(n => n.id === savedDraft.id);
        if (existingIndex > -1) {
          const updatedNotices = [...prevNotices];
          updatedNotices[existingIndex] = savedDraft;
          return updatedNotices;
        }
        return [savedDraft, ...prevNotices];
      });
      if (formData.title?.trim() || formData.content?.trim()) {
        showToast('Draft saved automatically', 'info');
      }
    } catch (err) {
      console.error('Auto-save failed', err);
    }
  }, [currentDraftId, showToast]);


  const handleImmediateSave = useCallback(async () => {
    if (!unsavedFormData || (!unsavedFormData.title?.trim() && !unsavedFormData.content?.trim())) {
      return;
    }
    try {
      const draftPayload = {
        id: unsavedFormData.id || currentDraftId,
        title: unsavedFormData.title || '',
        content: unsavedFormData.content || '',
        type: unsavedFormData.type || '',
        poll_options: unsavedFormData.type === 'poll' ? unsavedFormData.options : [],
        images: unsavedFormData.images || [],
        status: 'draft',
      };
      const savedDraft = await saveDraftNotice(draftPayload);
      if (!currentDraftId) {
        setCurrentDraftId(savedDraft.id);
      }
      setAllNotices(prevNotices => {
        const existingIndex = prevNotices.findIndex(n => n.id === savedDraft.id);
        if (existingIndex > -1) {
          const updatedNotices = [...prevNotices];
          updatedNotices[existingIndex] = savedDraft;
          return updatedNotices;
        }
        return [savedDraft, ...prevNotices];
      });
    } catch (err) {
      console.error('Auto-save on tab switch failed', err);
    }
  }, [unsavedFormData, currentDraftId]);


  const handleFormDataChange = useCallback((formData) => {
    setUnsavedFormData(formData);
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleAutoSave(formData);
    }, 2000);
  }, [handleAutoSave]);

  
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedFormData && (unsavedFormData.title?.trim() || unsavedFormData.content?.trim())) {
        handleAutoSave(unsavedFormData);
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [unsavedFormData, handleAutoSave]);


  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      const { showForm: isFormVisible, unsavedFormData: dataToSave } = formStateRef.current;
      if (isFormVisible && dataToSave && (dataToSave.title?.trim() || dataToSave.content?.trim())) {
        console.log('Component is unmounting, saving draft...');
        handleAutoSave(dataToSave);
      }
    };
  }, [handleAutoSave]); 


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
        status: 'published'
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
      setUnsavedFormData(null);
      setCurrentDraftId(null);
      setShowDrafts(false);
      fetchNotices();
    } catch (err) {
      console.error(err);
      showToast('Submission failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleDelete = useCallback(async () => {
    if (!noticeToDeleteId) return;
    try {
      await apiClient.delete(`/notice/delete/${noticeToDeleteId}`);
      setAllNotices((prev) => prev.filter((n) => n.id !== noticeToDeleteId));
      showToast('Notice deleted', 'success');
      if (viewingNotice?.id === noticeToDeleteId) setViewingNotice(null);
      if (currentDraftId === noticeToDeleteId) {
        setCurrentDraftId(null);
        setUnsavedFormData(null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete notice', 'error');
    } finally {
      setNoticeToDeleteId(null);
    }
  }, [showToast, viewingNotice?.id, noticeToDeleteId, currentDraftId]);

  const handleViewToggle = (isDraftView) => {
    if (showForm && unsavedFormData && (unsavedFormData.title || unsavedFormData.content)) {
      handleImmediateSave();
    }
    setShowDrafts(isDraftView);
    setViewingNotice(null);
  };

  
  const handleShowCreateForm = useCallback(() => {
    setEditingNotice(null);
    setViewingNotice(null);
    setShowForm(true);
    setUnsavedFormData(null);
    setCurrentDraftId(null);
  }, []);

  const handleEdit = useCallback((noticeToEdit) => {
    setEditingNotice(noticeToEdit);
    setViewingNotice(null);
    setShowForm(true);
    setUnsavedFormData(null);
    setCurrentDraftId(noticeToEdit.id);
  }, []);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingNotice(null);
    setUnsavedFormData(null);
    setCurrentDraftId(null);
  }, []);

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
              {loading ? (
                <div className="flex justify-center items-center min-h-28">
                  <Loading fullScreen={false} />
                </div>
              ) : displayedNotices.length === 0 ? (
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
            onFormDataChange={handleFormDataChange}
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