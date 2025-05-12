import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ResidentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Other',
    content: '',
    is_anonymous: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const societyCode = decoded?.society_code;

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/complaints/get-complaints/${decoded.id}`, {
        params: { society_code: societyCode },
      });
      console.log(response.data)
      setComplaints(response.data);
    } catch (err) {
      setError('Failed to fetch complaints.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (societyCode) {
      fetchComplaints();
    }
  }, [societyCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      await axios.post('http://localhost:5000/complaints/post-complaints', {
        ...formData,
        resident_id: decoded.id,
        society_code: societyCode,
      });
      setShowForm(false);
      setFormData({ title: '', type: 'Other', content: '', is_anonymous: false });
      fetchComplaints();
    } catch (err) {
      console.error('Error submitting complaint:', err);
      alert('Failed to post complaint');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading) return <div className="text-center text-gray-600 mt-8">Loading complaints...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">📋 Complaints</h2>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700"
        onClick={() => {
          setSelectedComplaint(null);
          setShowForm(true);
        }}
      >
        ✍️ Write a Complaint
      </button>

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md border space-y-4 mb-6">
          <input
            className="w-full p-2 border rounded"
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <select
            className="w-full p-2 border rounded"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Civil Works">Civil Works</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            className="w-full p-2 border rounded"
            name="content"
            rows="4"
            placeholder="Describe the issue..."
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_anonymous"
              checked={formData.is_anonymous}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-700">Submit anonymously</span>
          </label>
          <div className="flex space-x-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Submit
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {selectedComplaint ? (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-blue-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{selectedComplaint.title}</h3>
          <p className="text-gray-700 mb-2">{selectedComplaint.content}</p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Posted on:</strong> {new Date(selectedComplaint.created_at).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Resident Name:</strong> {selectedComplaint.resident_name}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Resident ID:</strong> {selectedComplaint.resident_id}
          </p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setSelectedComplaint(null)}
          >
            🔙 Back to List
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {complaints.map((complaint) => (
            <li
            key={complaint.id}
            className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:border-blue-400 transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedComplaint(complaint)}
          >
            <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
            <p className="text-gray-600 mt-1 line-clamp-2">{complaint.description || complaint.content}</p>
            <div className='flex justify-between'>
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
      )}
    </div>
  );
};

export default ResidentComplaints;
