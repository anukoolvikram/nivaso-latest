/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, UserIcon, EnvelopeIcon, PhoneIcon, HomeIcon, KeyIcon, PencilIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useToast } from '../../context/ToastContext';
import { HiEye, HiEyeOff } from "react-icons/hi";
import CircularProgress from '@mui/material/CircularProgress';
import Loading from '../Loading/Loading';
import apiClient from '../../services/apiClient';

const ResidentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const showToast = useToast();
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get(`/resident/profile/get`);
        setProfile(response.data);
        setFormData(response.data);
      } catch (err) {
        showToast('Failed to load profile', 'error');
      }
    };
    fetchProfile();
  }, [showToast]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await apiClient.put(`/resident/profile/update`, formData);
      setProfile({ ...profile, ...formData });
      setEditMode(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Error updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  

  const handlePasswordChange = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;
    const newErrors = {};
    if (!oldPassword) newErrors.oldPassword = 'Current password is required.';
    if (!newPassword) newErrors.newPassword = 'New password is required.';
    else if (newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters.';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your new password.';
    else if (newPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); 
    setPasswordSaving(true);
    try {
      await apiClient.put(`/resident/profile/password`, { oldPassword, newPassword });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMode(false);
      showToast('Password changed successfully!', 'success');
    } catch (err) {
      const errorMessage = err?.response?.data?.error;
      if (errorMessage.toLowerCase().includes('old')) {
        setErrors({ oldPassword: errorMessage });
      } else {
        setErrors({ newPassword: errorMessage });
      }
      showToast('Error changing password', 'error');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!profile) {
    return (<Loading />);
  }

  const profileTiles = [
    { icon: <UserIcon className="h-5 w-5 text-navy" />, title: "Name", value: profile.name, field: "name" },
    { icon: <EnvelopeIcon className="h-5 w-5 text-navy" />, title: "Email", value: profile.email, field: "email" },
    { icon: <PhoneIcon className="h-5 w-5 text-navy" />, title: "Phone", value: profile.phone, field: "phone" },
    { icon: <HomeIcon className="h-5 w-5 text-navy" />, title: "Address", value: profile.address, field: "address" },
    { icon: <KeyIcon className="h-5 w-5 text-navy" />, title: "Flat No", value: profile.flat_id, field: "flat_id" },
    { icon: <KeyIcon className="h-5 w-5 text-navy" />, title: "Society Code", value: profile.society_code, field: "society_code" }
  ];

  return (
    <div className="bg-gray-50 p-4 md:p-6 font-montserrat min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          {(editMode || passwordMode) && (
            <button
              onClick={() => {
                setEditMode(false);
                setPasswordMode(false);
              }}
              className="flex items-center text-gray-600 hover:text-gray-800 transition"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Back
            </button>
          )}
        </div>

        {/* View Mode */}
        {!editMode && !passwordMode && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileTiles.map((tile, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    {tile.icon}
                    <h3 className="font-medium text-gray-700">{tile.title}</h3>
                  </div>
                  <p className="text-gray-900 pl-8">{tile.value || 'Not provided'}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                    setPasswordMode(true);
                    setErrors({}); // Clear errors when opening form
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-300 border border-gray-200 transition rounded-lg text-sm font-medium cursor-pointer"
              >
                <LockClosedIcon className="h-4 w-4" />
                Change Password
              </button>
            </div>
          </div>
        )}

        {/* Edit Mode (Omitted for brevity) */}
        {editMode && ( <div /> )}

        {/* Password Change Mode */}
        {passwordMode && (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <LockClosedIcon className="h-5 w-5 text-blue-600" />
              Change Password
            </h2>

            <div className="space-y-4 mb-6">
              {/* CURRENT PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    name="oldPassword"
                    value={passwords.oldPassword}
                    onChange={handlePasswordInputChange}
                    className={`w-full border rounded-lg px-3 py-2 pr-10 focus:ring-blue-500 focus:border-blue-500 ${errors.oldPassword ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button type="button" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowOldPassword(!showOldPassword)}>
                    {showOldPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordInputChange}
                    className={`w-full border rounded-lg px-3 py-2 pr-10 focus:ring-blue-500 focus:border-blue-500 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button type="button" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className={`w-full border rounded-lg px-3 py-2 pr-10 focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button type="button" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handlePasswordChange}
                disabled={passwordSaving}
                className="w-36 flex justify-center items-center px-4 py-2 bg-navy text-white hover:bg-navy/90 rounded-lg text-sm font-medium transition-colors disabled:bg-navy/70 disabled:cursor-not-allowed"
              >
                {passwordSaving ? <CircularProgress size={20} color="inherit" /> : 'Update'}
              </button>
              <button
                onClick={() => {
                    setPasswordMode(false);
                    setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Clear fields on cancel
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentProfile;