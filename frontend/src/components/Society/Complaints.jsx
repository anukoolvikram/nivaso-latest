import { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { uploadImageToCloudinary } from '../../utils/uploadImages';
// components
import Loading from '../Loading/Loading';
import ComplaintCard from '../Complaint/ComplaintCard'
import ComplaintDescription from '../Complaint/Society/ComplaintDescription';
import Dropdown from '../Dropdown/Dropdown';

const SocietyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [dismissComment, setDismissComment] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [allTypes, setAllTypes] = useState([]);

  const statusOptions = [
    'Received',
    'Under Review',
    'Taking Action',
    'Dismissed',
    'Resolved',
  ];

  const isReadOnly = !!selectedComplaint &&
    ['Resolved', 'Dismissed'].includes(selectedComplaint.status);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await apiClient.get(`/complaint/society/get`);
        setComplaints(response.data);
        const types = [...new Set(response.data.map(c => c.complaint_type).filter(Boolean))];
        setAllTypes(types);
      } catch (err) {
        setError('Failed to fetch complaints.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getFilteredComplaints = () => {
    let filtered = complaints;
    if (statusFilter) filtered = filtered.filter(c => c.status === statusFilter);
    if (typeFilter) filtered = filtered.filter(c => c.complaint_type === typeFilter);
    return filtered;
  };

  const clearAllFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
  };

  const handleComplaintClick = async (complaint) => {
    if (complaint.status === 'Received') {
      try {
        const updatedStatus = 'Under Review';
        await apiClient.put(`/complaint/status/${complaint.id}`,
          { status: updatedStatus }
        );
        const updatedComplaint = {
          ...complaint,
          status: updatedStatus,
          comment: complaint.comment || '',
        };
        setComplaints(prev => prev.map(c => c.id === complaint.id ? updatedComplaint : c));
        setSelectedComplaint(updatedComplaint);
        setNewStatus(updatedStatus);
      } catch (err) {
        console.error('Auto-update to Under Review failed:', err);
      }
    } else {
      setSelectedComplaint(complaint);
      setNewStatus(complaint.status);
      setDismissComment(complaint.comment || '');
    }
    setSaveError(null);
  };

  useEffect(() => {
    if (newStatus !== 'Resolved') {
      setSelectedImages([]);
    }
  }, [newStatus]);

  const handleSaveStatus = async () => {
    if (newStatus === 'Dismissed' && dismissComment.trim() === '') {
      setSaveError('Please enter a dismissal comment.');
      return;
    }
    setSaveError(null);
    setUpdatingStatus(true);

    try {
      let imageUrls = [];
      if (newStatus === 'Resolved' && selectedImages.length > 0) {
        imageUrls = await Promise.all(
          selectedImages.map(uploadImageToCloudinary)
        );
      }
      console.log('images',imageUrls)
      await apiClient.put(`/complaint/status/${selectedComplaint.id}`,
        {
          status: newStatus,
          comment: newStatus === 'Dismissed' ? dismissComment : undefined,
          attachments: imageUrls
        }
      );
      const updatedComplaint = {
        ...selectedComplaint,
        status: newStatus,
        comment: newStatus === 'Dismissed' ? dismissComment : selectedComplaint.comment,
        images: newStatus === 'Resolved' ? [...(selectedComplaint.images || []), ...imageUrls] : selectedComplaint.images
      };
      setComplaints(prev => prev.map(c => c.id === selectedComplaint.id ? updatedComplaint : c));
      setSelectedComplaint(updatedComplaint);
    } catch (err) {
      console.error('Error saving status:', err);
      setSaveError('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
  if (complaints.length === 0) return <div className="text-center text-gray-500 mt-8">No complaints found.</div>;

  return (
    <div className="font-montserrat font-medium">
      {selectedComplaint ? (
        <ComplaintDescription
          complaint={selectedComplaint}
          onBack={() => {
            setSelectedComplaint(null);
            setNewStatus('');
            setDismissComment('');
            setSelectedImages([]);
          }}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          dismissComment={dismissComment}
          setDismissComment={setDismissComment}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          saveError={saveError}
          handleSaveStatus={handleSaveStatus}
          updatingStatus={updatingStatus}
          isReadOnly={isReadOnly}
        />
      ) : (
        <>
          {/* Tabs */}
          <div className='flex p-4 gap-4 items-center text-sm'>
            <Dropdown
              label="Status:"
              placeholder="Select status"
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              name="status-filter"
              style='flex items-center gap-4'
            />

            {allTypes.length > 0 && (
              <Dropdown
                label="Type:"
                placeholder="Select type"
                options={allTypes}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                name="type-filter"
                style='flex items-center gap-4'
              />
            )}
            <button
              onClick={clearAllFilters}
              className="text-sm border bg-navy text-white border-purplegray p-2 px-8 rounded-lg hover:bg-navy/80"
            >
              Clear
            </button>

          </div>

          {/* Complaints List */}
          <div className='px-4 py-6 border bg-gray-50 border-purplegray min-h-screen'>
            <div className="space-y-4 p-0">
              {getFilteredComplaints().map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onClick={handleComplaintClick}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocietyComplaints;