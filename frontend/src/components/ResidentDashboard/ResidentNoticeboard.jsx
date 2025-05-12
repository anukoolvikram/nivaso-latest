import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Helper: Time ago formatter
const getTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
};

const ResidentNoticeboard = () => {
  const [notices, setNotices] = useState([]);
  const [userNotices, setUserNotices] = useState([]);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [showingUserNotices, setShowingUserNotices] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    description: '',
    type: ''
  });

  const [userId, setUserId] = useState(null);
  const [societyCode, setSocietyCode] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      setSocietyCode(decoded.society_code);
      fetchNotices(decoded.society_code);
      fetchUserNotices(decoded.id);
    }
  }, []);

  const fetchNotices = async (society_code) => {
    try {
      const res = await axios.get('http://localhost:5000/notices/all-notices', {
        params: { society_code }
      });
  
      const approvedNotices = Array.isArray(res.data)
        ? res.data.filter(notice => notice.approved === true)
        : [];
  
      setNotices(approvedNotices);
    } catch (err) {
      console.error('Error fetching notices:', err);
      setNotices([]); // fallback to empty array
    }
  };
  
  const fetchUserNotices = async (user_id) => {
    try {
      const res = await axios.get('http://localhost:5000/notices/user-notices', {
        params: { user_id }
      });
      // console.log('heyy')
      // console.log(res.data)
  
      setUserNotices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching user notices:', err);
      setUserNotices([]); // fallback to empty array
    }
  };
  

  const handleWrite = () => setIsWriting(true);

  const handleSubmitNotice = async () => {
    try {
      const res = await axios.post("http://localhost:5000/notices/post-user-notice", {
        ...newNotice,
        user_id: userId,
        society_code: societyCode
      });

      if (res.status === 201) {
        setIsWriting(false);
        setNewNotice({ title: '', description: '', type: '' });
        fetchNotices(societyCode);
        fetchUserNotices(userId);
      } else {
        alert("Failed to post notice.");
      }
    } catch (error) {
      console.error("Error submitting notice:", error);
      alert("Something went wrong.");
    }
  };

  const displayUserNotices = () => {
    setShowingUserNotices(true);
  };

  const displayAllNotices = () => {
    setShowingUserNotices(false);
  };

  const displayedNotices = showingUserNotices ? userNotices : notices;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Noticeboard</h2>
        <div className="flex">
          {!showingUserNotices ? (
            <button
              onClick={displayUserNotices}
              className="px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-800"
            >
              Your Notices
            </button>
          ) : (
            <button
              onClick={displayAllNotices}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              Back to All Notices
            </button>
          )}
          <button
            onClick={handleWrite}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Write a Notice
          </button>
        </div>
      </div>

      {displayedNotices.length === 0 ? (
        <p>No notices available.</p>
      ) : (
        <div className="space-y-4">
          {displayedNotices.map((notice, index) => (
            <div
              key={notice.id || index}
              className="border border-gray-300 rounded-lg p-4 shadow-md bg-white"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">{notice.title}</h3>
                <div>
                  {showingUserNotices ?
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full capitalize">
                      {notice.approved?'Approved':'Pending'}
                    </span>
                  :<></>
                  }
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                    {notice.type}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 italic">
                {getTimeAgo(notice.date_posted)}
              </p>
              {/* <p className="mt-2 text-gray-700">{notice.description}</p> */}
              <button
                onClick={() => setViewingNotice(notice)}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* View Notice Modal */}
      {viewingNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md">
            <h2 className="text-xl font-bold">{viewingNotice.title}</h2>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize inline-block mt-1">
              {viewingNotice.type}
            </span>
            <p className="text-sm text-gray-500 mt-1 italic">
              {getTimeAgo(viewingNotice.date_posted)}
            </p>
            <p className="mt-4">{viewingNotice.description}</p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setViewingNotice(null)}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write Notice Modal */}
      {isWriting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Write a New Notice</h2>

            <input
              type="text"
              placeholder="Title"
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              className="w-full mb-3 px-3 py-2 border rounded"
            />

            <textarea
              placeholder="Description"
              value={newNotice.description}
              onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
              className="w-full mb-3 px-3 py-2 border rounded h-24"
            />

            <select
              value={newNotice.type}
              onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value })}
              className="w-full mb-4 px-3 py-2 border rounded"
            >
              <option value="">Select Type</option>
              <option value="announcement">Announcement</option>
              <option value="notice">Notice</option>
              <option value="lost_and_found">Lost and Found</option>
            </select>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsWriting(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNotice}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentNoticeboard;
