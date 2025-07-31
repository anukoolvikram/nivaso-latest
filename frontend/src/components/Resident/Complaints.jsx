import { useEffect, useState } from 'react';
import { ResidentComplaintDescription } from '../Complaint/Resident/ComplaintDescription';
import { ResidentComplaintForm } from '../Complaint/Resident/ComplaintForm';
import { PlusIcon } from '../../assets/icons/PlusIcon'
import Loading from '../Loading/Loading';
import apiClient from '../../services/apiClient'
import { uploadImageToCloudinary } from '../../utils/uploadImages';
import ComplaintCard from '../Complaint/ComplaintCard'

const ResidentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    complaint_type: 'Other',
    content: '',
    is_anonymous: false,
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [responseError, setResponseError] = useState(null);

  const fetchComplaints = async () => {
    try {
      const response = await apiClient.get(`/complaint/resident`);
      setComplaints(response.data);
    } catch (err) {
      setError('Failed to fetch complaints.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const imageUrls = await Promise.all(
          selectedImages.map(imageFile => uploadImageToCloudinary(imageFile))
      );
      await apiClient.post(`/complaint/post`, {
        ...formData,
        attachments: imageUrls,
      });
      setShowForm(false);
      setFormData({ title: '', complaint_type: 'Other', content: '', is_anonymous: false });
      setSelectedImages([]);
      fetchComplaints();
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError('Failed to post complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      setResponseError('Please enter a response');
      return;
    }

    setSubmittingResponse(true);
    try {
      await apiClient.post(`/complaint/add-response`, {
        complaintId: selectedComplaint.id,
        response,
      });
      fetchComplaints();
      const updatedComplaint = complaints.find(c => c.id === selectedComplaint.id);
      setSelectedComplaint(updatedComplaint);
      setResponse('');
      setResponseError(null);
    } catch (err) {
      console.error('Error submitting response:', err);
      setResponseError('Failed to submit response');
    } finally {
      setSubmittingResponse(false);
    }
  };

  if (loading) return <Loading/>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="font-montserrat font-medium p-6 bg-gray-50 min-h-screen">

      {showForm ? (
        <ResidentComplaintForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setShowForm={setShowForm}
          submitting={submitting}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      ) : selectedComplaint ? (
        <ResidentComplaintDescription
          complaint={selectedComplaint}
          onBack={() => setSelectedComplaint(null)}
          onSubmitResponse={handleSubmitResponse}
          response={response}
          setResponse={setResponse}
          submittingResponse={submittingResponse}
          responseError={responseError}
        />
      ) : (
        <>
          <div>
            <div className='flex justify-end mb-4'>
              <button
                className="flex items-center gap-2 px-4 py-2 font-medium bg-navy text-white hover:bg-navy/80 rounded-lg"
                onClick={() => setShowForm(true)}
              >
                <PlusIcon />
                Add Complaint
              </button>
            </div>
            <div className="space-y-4">
              {complaints.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">No complaints found.</div>
              ) : (
                complaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    onClick={setSelectedComplaint}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResidentComplaints;