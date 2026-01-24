// import { useEffect, useState } from 'react';
// import { ResidentComplaintDescription } from '../Complaint/Resident/ComplaintDescription';
// import { ResidentComplaintForm } from '../Complaint/Resident/ComplaintForm';
// import { PlusIcon } from '../../assets/icons/PlusIcon'
// import Loading from '../Loading/Loading';
// import apiClient from '../../services/apiClient'
// import { uploadImageToCloudinary } from '../../utils/uploadImages';
// import ComplaintCard from '../Complaint/ComplaintCard'

// const ResidentComplaints = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     complaint_type: 'Other',
//     content: '',
//     is_anonymous: false,
//   });
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [response, setResponse] = useState('');
//   const [submittingResponse, setSubmittingResponse] = useState(false);
//   const [responseError, setResponseError] = useState(null);

//   const fetchComplaints = async () => {
//     try {
//       const response = await apiClient.get(`/complaint/resident`);
//       setComplaints(response.data);
//     } catch (err) {
//       setError('Failed to fetch complaints.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const imageUrls = await Promise.all(
//           selectedImages.map(imageFile => uploadImageToCloudinary(imageFile))
//       );
//       await apiClient.post(`/complaint/post`, {
//         ...formData,
//         attachments: imageUrls,
//       });
//       setShowForm(false);
//       setFormData({ title: '', complaint_type: 'Other', content: '', is_anonymous: false });
//       setSelectedImages([]);
//       fetchComplaints();
//     } catch (err) {
//       console.error('Error submitting complaint:', err);
//       setError('Failed to post complaint');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmitResponse = async () => {
//     if (!response.trim()) {
//       setResponseError('Please enter a response');
//       return;
//     }

//     setSubmittingResponse(true);
//     try {
//       await apiClient.post(`/complaint/add-response`, {
//         complaintId: selectedComplaint.id,
//         response,
//       });
//       fetchComplaints();
//       const updatedComplaint = complaints.find(c => c.id === selectedComplaint.id);
//       setSelectedComplaint(updatedComplaint);
//       setResponse('');
//       setResponseError(null);
//     } catch (err) {
//       console.error('Error submitting response:', err);
//       setResponseError('Failed to submit response');
//     } finally {
//       setSubmittingResponse(false);
//     }
//   };

//   if (loading) return <Loading/>;
//   if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

//   return (
//     <div className="font-montserrat font-medium p-6 bg-gray-50 min-h-screen">

//       {showForm ? (
//         <ResidentComplaintForm
//           formData={formData}
//           handleChange={handleChange}
//           handleSubmit={handleSubmit}
//           setShowForm={setShowForm}
//           submitting={submitting}
//           selectedImages={selectedImages}
//           setSelectedImages={setSelectedImages}
//         />
//       ) : selectedComplaint ? (
//         <ResidentComplaintDescription
//           complaint={selectedComplaint}
//           onBack={() => setSelectedComplaint(null)}
//           onSubmitResponse={handleSubmitResponse}
//           response={response}
//           setResponse={setResponse}
//           submittingResponse={submittingResponse}
//           responseError={responseError}
//         />
//       ) : (
//         <>
//           <div>
//             <div className='flex justify-end mb-4'>
//               <button
//                 className="flex items-center gap-2 px-4 py-2 font-medium bg-navy text-white hover:bg-navy/80 rounded-lg"
//                 onClick={() => setShowForm(true)}
//               >
//                 <PlusIcon />
//                 Add Complaint
//               </button>
//             </div>
//             <div className="space-y-4">
//               {complaints.length === 0 ? (
//                 <div className="text-center text-gray-500 mt-8">No complaints found.</div>
//               ) : (
//                 complaints.map((complaint) => (
//                   <ComplaintCard
//                     key={complaint.id}
//                     complaint={complaint}
//                     onClick={setSelectedComplaint}
//                   />
//                 ))
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ResidentComplaints;


import { useEffect, useState } from 'react';
import { ResidentComplaintDescription } from '../Complaint/Resident/ComplaintDescription';
import { ResidentComplaintForm } from '../Complaint/Resident/ComplaintForm';
import { PlusIcon } from '../../assets/icons/PlusIcon'
import Loading from '../Loading/Loading';
import apiClient from '../../services/apiClient'
import { uploadImageToCloudinary } from '../../utils/uploadImages';
import ComplaintCard from '../Complaint/ComplaintCard'
import { useToast } from '../../context/ToastContext';

const ResidentComplaints = () => {
  const showToast = useToast();
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
      showToast('Error loading complaints', 'error');
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
      showToast('Complaint submitted successfully', 'success');
      fetchComplaints();
    } catch (err) {
      showToast('Failed to post complaint', 'error');
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
      setResponse('');
      setResponseError(null);
      showToast('Response added', 'success');
      await fetchComplaints();
      // Update the local selected complaint with the new response
      const updatedList = await apiClient.get(`/complaint/resident`);
      const updated = updatedList.data.find(c => c.id === selectedComplaint.id);
      setSelectedComplaint(updated);
    } catch (err) {
      showToast('Failed to submit response', 'error');
    } finally {
      setSubmittingResponse(false);
    }
  };

  if (loading) return <Loading/>;
  if (error) return <div className="text-center text-red-500 mt-8 font-bold">{error}</div>;

  return (
    <div className="font-montserrat min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
              {/* <div className="text-2xl md:text-3xl font-medium text-navy-dark tracking-tight">Complaints</div> */}
              <button
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-bold bg-navy text-white hover:bg-navy-dark rounded-xl shadow-lg shadow-navy/20 transition-all active:scale-95"
                onClick={() => setShowForm(true)}
              >
                <PlusIcon />
                New Complaint
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {complaints.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-bold">
                  No complaints found.
                </div>
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
        )}
      </div>
    </div>
  );
};

export default ResidentComplaints;