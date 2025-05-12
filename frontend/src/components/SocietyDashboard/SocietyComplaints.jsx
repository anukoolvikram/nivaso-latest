import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const SocietyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [dismissComment, setDismissComment] = useState('');
  const [activeStatus, setActiveStatus] = useState('Received');

  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const societyCode = decoded?.society_code;
  const [showSaveButton, setShowSaveButton]=useState(false)

  const statusOptions = ['Received', 'Under Review', 'Taking Action', 'Dismissed/Resolved'];

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:5000/complaints/get-complaints', {
          params: { society_code: societyCode },
        });

        const complaintsWithNames = await Promise.all(
          response.data.map(async (complaint) => {
            try {
              const res = await axios.get('http://localhost:5000/complaints/get-resident', {
                params: { id: complaint.resident_id },
              });
              return { ...complaint, resident_name: res.data.name || 'Unknown' };
            } catch (err) {
              console.error(`Error fetching resident ${complaint.resident_id}:`, err);
              return { ...complaint, resident_name: 'Unknown' };
            }
          })
        );
        setComplaints(complaintsWithNames);
      } catch (err) {
        setError('Failed to fetch complaints.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (societyCode) {
      fetchComplaints();
    }
  }, [societyCode]);

  const getFilteredComplaints = () => {
    if (activeStatus === 'Dismissed/Resolved') {
      return complaints.filter(c => c.status === 'Dismissed' || c.status === 'Resolved');
    }
    return complaints.filter(c => c.status === activeStatus);
  };

  const handleComplaintClick = async (complaint) => {
    if (complaint.status === "Received") {
      try {
        const updatedStatus = "Under Review";
  
        await axios.put("http://localhost:5000/complaints/change-status", {
          id: complaint.id,
          status: updatedStatus,
        });
  
        const updatedComplaint = {
          ...complaint,
          status: updatedStatus,
          comment: complaint.comment || '',
        };
  
        setComplaints(prev =>
          prev.map(c =>
            c.id === complaint.id ? updatedComplaint : c
          )
        );
  
        setSelectedComplaint(updatedComplaint);
        setNewStatus(updatedStatus);
        setDismissComment(updatedComplaint.comment);
      } catch (err) {
        console.error("Auto-update to Under Review failed:", err);
      }
    } 
    else {
      setSelectedComplaint(complaint);
      // console.log('selected complaint', complaint);
      setNewStatus(complaint.status);
      setDismissComment(complaint.comment || '');

      // console.log('heey')
      // console.log(complaint.status, complaint.comment||'')
    }
  };
  

  const handleSaveStatus = async () => {
    if (newStatus === 'Dismissed' && dismissComment.trim() === '') {
      alert('Please enter a dismissal comment.');
      return;
    }

    try {
      await axios.put('http://localhost:5000/complaints/change-status', {
        id: selectedComplaint.id,
        status: newStatus,
        comment: newStatus === 'Dismissed' ? dismissComment : undefined,
      });

      setComplaints(prev =>
        prev.map(c =>
          c.id === selectedComplaint.id
            ? { ...c, status: newStatus, comment: newStatus === 'Dismissed' ? dismissComment : c.comment }
            : c
        )
      );

      setSelectedComplaint(prev => ({
        ...prev,
        status: newStatus,
        comment: newStatus === 'Dismissed' ? dismissComment : prev.comment,
      }));
    } catch (err) {
      console.error('Error saving status:', err);
    }
    setShowSaveButton(false)
  };

  const handleBack = () => {
    setSelectedComplaint(null);
    setNewStatus('');
    setDismissComment('');
  };

  if (loading) return <div className="text-center text-gray-600 mt-8">Loading complaints...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
  if (complaints.length === 0) return <div className="text-center text-gray-500 mt-8">No complaints found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">📋 Complaints List</h2>

      {selectedComplaint ? (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-blue-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{selectedComplaint.title}</h3>
          <p className="text-gray-700 mb-2">{selectedComplaint.content}</p>
          <p className="text-sm text-gray-600 mb-1"><strong>Posted on:</strong> {new Date(selectedComplaint.created_at).toLocaleString()}</p>
          <p className="text-sm text-gray-600 mb-1"><strong>Resident Name:</strong> {selectedComplaint.resident_name}</p>
          <p className="text-sm text-gray-600 mb-1"><strong>Resident ID:</strong> {selectedComplaint.resident_id}</p>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Change Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            >
              <option value="Under Review">Under Review</option>
              <option value="Taking Action">Taking Action</option>
              <option value="Dismissed">Dismissed</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {newStatus === 'Dismissed' && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Dismissal Comment</label>
              <textarea
                className="w-full px-3 py-2 border rounded border-gray-300"
                placeholder="Enter reason for dismissal"
                value={dismissComment}
                onChange={(e) => {
                  setDismissComment(e.target.value); 
                  setShowSaveButton(true)}}
              />
            </div>
          )}

          {(newStatus !== selectedComplaint.status || showSaveButton) && (
            <button
              onClick={handleSaveStatus}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
            >
              💾 Save Status
            </button>
          )}

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleBack}
          >
            🔙 Back to List
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 overflow-x-auto">
            <div className="flex space-x-3 border-b pb-2">
              {statusOptions.map(status => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    activeStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <ul className="space-y-4">
            {getFilteredComplaints().map((complaint) => (
              <li
                key={complaint.id}
                className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:border-blue-400 transition-all duration-200 cursor-pointer"
                onClick={() => handleComplaintClick(complaint)}
              >
                <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
                <p className="text-gray-600 mt-1 line-clamp-2">{complaint.description}</p>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 mt-1">
                    Posted on: {new Date(complaint.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Status: {complaint.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default SocietyComplaints;
