import { useState, useEffect, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';
import { getTimeAgo } from '../../utils/dateUtil';
import apiClient from '../../services/apiClient';
import { noticeTypes } from '../../utils/noticeTypes';
import { createNotice, updateNotice } from '../../services/noticeService';
// Component
import NoticeList from '../Notice/NoticeList';
import NoticeDescription from '../Notice/NoticeDescription';
import NoticeForm from '../Notice/NoticeForm';
import Loading from '../Loading/Loading';
import DeleteDialog from '../DeleteDialog/DeleteDialog';
import { uploadImageToCloudinary } from '../../utils/uploadImages';

const TABS = {
  all: 'All',
  resident: 'Resident',
  federation: 'Federation',
  pending: 'Pending',
};


export default function Noticeboard() {
  const [status, setStatus] = useState('loading');
  const [allNotices, setAllNotices] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useToast();

  const fetchNotices = async () => {
    if (status !== 'loading') setStatus('loading');
    try {
      const res = await apiClient.get('/notice/get');
      setAllNotices(res.data);
    } catch (err) {
      console.error('Failed to fetch notices:', err);
      showToast('Failed to load notices', 'error');
    } finally {
      setStatus('idle');
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);


  const handleApprove = async (id) => {
    try {
      await apiClient.put(`/notice/approve/${id}`);
      showToast('Notice approved!', 'success');
      fetchNotices();
      setSelectedNoticeId(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Approval failed', 'error');
    }
  };

  const handleEdit = (notice) => {
    setSelectedNoticeId(notice.id);
    setStatus('editing');
  };

  const handleDelete = (notice) => {
    setSelectedNoticeId(notice.id);
    setStatus('deleting');
  };

  const handleConfirmDelete = async () => {
    if (!selectedNoticeId) return;
    try {
      await apiClient.delete(`/notice/delete/${selectedNoticeId}`);
      showToast('Notice deleted!', 'success');
      setSelectedNoticeId(null);
      fetchNotices();
    } catch (err) {
      showToast(err.response?.data?.message || 'Deletion failed', 'error');
    } finally {
      setStatus('idle');
    }
  };

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
        poll_options: formData.type === 'Poll' ? formData.options : [],
        images: finalImages,
      };
  
      const isEditing = status === 'editing';
      if (isEditing) {
        await updateNotice(formData.id, payload);
        showToast('Notice updated successfully!', 'success');
      } else {
        await createNotice(payload);
        showToast('Notice published successfully!', 'success');
      }
      
      setStatus('idle');
      setSelectedNoticeId(null);
      fetchNotices();
  
    } catch (err) {
      console.error('Submission error:', err);
      showToast('Submission failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedNoticeId(null);
    setStatus('idle');
  };

  const handleNoticeClick = (notice) => {
    setSelectedNoticeId(notice.id);
    setStatus('viewing');
  };

  const handleCreateNotice = () => {
    setSelectedNoticeId(null);
    setStatus('creating');
  };


  const all = useMemo(() => allNotices, [allNotices]);
  const resident = useMemo(() => allNotices.filter(n => n.author_type === 'resident'), [allNotices]);
  const federation = useMemo(() => allNotices.filter(n => n.author_type === 'federation'), [allNotices]);
  const pending = useMemo(() => allNotices.filter(n => !n.is_approved && n.author_type === 'resident'), [allNotices]);

  const noticesToShow = useMemo(() => ({ all, resident, federation, pending }[activeTab] || []), [all, resident, federation, pending, activeTab]);
  const selectedNotice = useMemo(() => allNotices.find(n => n.id === selectedNoticeId), [allNotices, selectedNoticeId]);

  const editingNotice = status === 'editing' ? selectedNotice : null;
  const isFormVisible = status === 'creating' || status === 'editing';
  const isDetailVisible = status === 'viewing' && selectedNotice;

  const isLoading = status === 'loading' && allNotices.length === 0;
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen font-montserrat">
      <div className={`${isDetailVisible ? 'w-2/3' : 'w-full'} px-6 py-4 bg-gray-100/50 flex flex-col gap-6 transition-all duration-200`}>
        {isFormVisible ? (
          <NoticeForm
            notice={editingNotice}
            onCancel={() => { setStatus('idle'); setSelectedNoticeId(null); }}
            onSubmit={handleFormSubmit}
            noticeTypes={['Announcement', 'Notice', 'Poll', 'Lost & Found']}
            isSubmitting={isSubmitting}
            userRole='society'
          />
        ) : (
          <NoticeList
            notices={noticesToShow}
            loading={status === 'loading'}
            activeTab={activeTab}
            tabs={TABS}
            onTabChange={handleTabChange}
            onNoticeClick={handleNoticeClick}
            onCreateNotice={handleCreateNotice}
            viewingNoticeId={selectedNoticeId}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            userRole='society'
          />
        )}
      </div>

      {isDetailVisible && (
        <div className="w-1/3 bg-white border-l border-gray-200">
          <NoticeDescription
            notice={selectedNotice}
            onClose={() => { setStatus('idle'); setSelectedNoticeId(null); }}
            onEdit={() => handleEdit(selectedNotice)}
            onDelete={() => handleDelete(selectedNotice)}
            onApprove={activeTab === 'pending' ? () => handleApprove(selectedNotice.id) : null}
            userRole='society'
          />
        </div>
      )}

      <DeleteDialog
        isOpen={status === 'deleting'}
        onCancel={() => setStatus('idle')}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}