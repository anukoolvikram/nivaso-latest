import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const SocietyNoticeboard = () => {
  const [notices, setNotices] = useState([]);
  const [pendingNotices, setPendingNotices] = useState([]);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showingPending, setShowingPending] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'announcement',
    society_id: '',
    approved: true
  });

  const noticeTypes = [
    { value: 'announcement', label: '📢 Announcement' },
    { value: 'notice', label: '📄 Notice' },
    { value: 'poll', label: '📊 Poll' },
    { value: 'lost_and_found', label: '🧩 Lost & Found' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setFormData((prev) => ({ ...prev, society_id: decoded.society_id }));
      fetchNotices(decoded.society_id);
      fetchPendingNotices(decoded.society_id);
    }
  }, []);

  const fetchNotices = async (society_id) => {
    try {
      const res = await axios.get('http://localhost:5000/notices/all-notices', {
        params: { society_id }
      });

      const approvedNotices = Array.isArray(res.data)
        ? res.data.filter((notice) => notice.approved === true)
        : [];

      setNotices(approvedNotices);
    } catch (err) {
      console.error('Error fetching notices:', err);
    }
  };

  const fetchPendingNotices = async (society_id) => {
    try {
      const res = await axios.get('http://localhost:5000/notices/all-notices', {
        params: { society_id }
      });

      const unapproved = Array.isArray(res.data)
        ? res.data.filter((notice) => notice.approved === false)
        : [];

      setPendingNotices(unapproved);
    } catch (err) {
      console.error('Error fetching pending notices:', err);
    }
  };

  const handleApprove = async (notice_id) => {
    try {
      await axios.put(`http://localhost:5000/notices/approve-notice/${notice_id}`);
      alert("Notice approved!");
      fetchNotices(formData.society_id);
      fetchPendingNotices(formData.society_id);
    } catch (err) {
      console.error("Error approving notice:", err);
      alert("Approval failed");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/notices/edit-notice/${formData.notice_id}`, formData);
        setViewingNotice({ ...formData });
        alert('Notice updated!');
      } else {
        await axios.post('http://localhost:5000/notices/post-notice', formData);
        alert('Notice posted!');
      }

      setShowForm(false);
      setEditing(false);
      setFormData((prev) => ({ ...prev, title: '', description: '' }));
      fetchNotices(formData.society_id);
      fetchPendingNotices(formData.society_id);
    } catch (err) {
      console.error('Error submitting notice:', err);
      alert('Failed to submit notice');
    }
  };

  const handleEdit = (notice) => {
    setFormData({ ...notice });
    setEditing(true);
    setShowForm(true);
  };

  const handleView = (notice) => {
    setViewingNotice(notice);
  };

  const handleBack = () => {
    setViewingNotice(null);
    setEditing(false);
    setShowForm(false);
  };

  const displayedNotices = showingPending ? pendingNotices : notices;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">🏡 Society Noticeboard</h2>

      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={() => {
            setViewingNotice(null);
            setShowForm(false);
            setShowingPending(!showingPending);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
        >
          {showingPending ? '🔙 Back to Approved' : '⏳ Pending Notices'}
        </button>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          ✍️ Write Notice
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow p-6 rounded mb-6 space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
          >
            {noticeTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="flex justify-between">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              {editing ? 'Update' : 'Post'}
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {viewingNotice ? (
        <div className="bg-white border border-gray-300 p-6 rounded shadow">
          <h3 className="text-2xl font-semibold">{viewingNotice.title}</h3>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Type:</strong>{' '}
            {noticeTypes.find((t) => t.value === viewingNotice.type)?.label || viewingNotice.type}
          </p>
          {viewingNotice.user_id && (
            <p className="text-sm text-gray-500 mb-2">
              <strong>Posted By (User ID):</strong> {viewingNotice.user_id}
            </p>
          )}
          <p className="text-gray-800 mb-4">{viewingNotice.description}</p>
          <div className="flex gap-4">
            <button
              onClick={() => handleEdit(viewingNotice)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleBack}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              🔙 Back
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedNotices.map((notice) => (
            <div
              key={notice.notice_id}
              className="bg-white border border-gray-200 p-4 rounded shadow hover:shadow-md transition"
            >
              <div className="text-sm text-gray-500">
                {noticeTypes.find((t) => t.value === notice.type)?.label || notice.type}
              </div>
              <h3
                onClick={() => handleView(notice)}
                className="text-lg font-bold text-blue-700 cursor-pointer hover:underline"
              >
                {notice.title}
              </h3>
              {notice.user_id && (
                <p className="text-xs text-gray-500">Posted by: <span className="font-mono">{notice.user_id}</span></p>
              )}
              {showingPending && (
                <div className="mt-2">
                  <button
                    onClick={() => handleApprove(notice.notice_id)}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    ✅ Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocietyNoticeboard;
