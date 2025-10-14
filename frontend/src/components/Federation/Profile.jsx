/* eslint-disable no-unused-vars */
import { IdentificationIcon, EnvelopeIcon, HomeModernIcon, UserGroupIcon, KeyIcon, BuildingOfficeIcon} from '@heroicons/react/24/outline';
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useEffect, useState, useCallback } from 'react';
import { CrossIcon } from '../../assets/icons/CrossIcon';
import CircularProgress from '@mui/material/CircularProgress';
import { useToast } from '../../context/ToastContext';
import { fetchUserInfo } from '../../services/authService';
import apiClient from '../../services/apiClient';
import Loading from '../Loading/Loading';

const initialPasswordState = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

const FederationProfile = () => {
  const showToast = useToast();
  const [federationData, setFederationData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState(initialPasswordState);
  const [passwordErrors, setPasswordErrors] = useState(initialPasswordState);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false});

  const loadFederationData = useCallback(async () => {
    setLoading(true);
    try {
      const userInfo = await fetchUserInfo();
      setUserInfo(userInfo);
      if (userInfo?.userId) {
        const response = await apiClient.get(`/federation/details/${userInfo.userId}`);
        setFederationData(response.data);
      } else {
        throw new Error("Could not retrieve user ID.");
      }
    } catch (err) {
      console.error('Failed to fetch federation details:', err);
      showToast('Could not load federation details.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadFederationData();
  }, [loadFederationData]);

  const validatePasswords = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required.';
    }
    if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long.';
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errors.confirmNewPassword = 'New passwords do not match.';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) {
      return;
    }
    setIsSaving(true);
    try {
      await apiClient.put(`/federation/change-password/${userInfo.userId}`, {
        ...passwordData
      });
      showToast('Password updated successfully!', 'success');
      handleCancelPasswordChange();
    } catch (err) {
      if (err.response && err.response.status === 401 && err.response.data?.error) {
        setPasswordErrors(prev => ({
          ...prev,
          currentPassword: err.response.data.error,
        }));
      } else {
        const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
        showToast(errorMessage, 'error');
      }
      console.error('Password change error:', err.response || err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordModal(false);
    setPasswordData(initialPasswordState);
    setPasswordErrors(initialPasswordState);
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loading fullScreen={false} />
      </div>
    );
  }

  if (!federationData) {
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-md shadow-sm">
        <p className="text-sm font-medium">No federation data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Main Content: Federation & Property Details... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BuildingOfficeIcon className="h-5 w-5 text-navy" />
              Federation Information
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <IdentificationIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Federation Code</p>
                  <p className="font-medium">{federationData.federation_code}</p>
                </div>
              </div>
              <div className="flex items-start">
                <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{federationData.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{federationData.email}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <HomeModernIcon className="h-5 w-5 text-navy" />
              Property Details
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <HomeModernIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Apartments</p>
                  <p className="font-medium">{federationData.apartment_count || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Tenements</p>
                  <p className="font-medium">{federationData.tenement_count || 'N/A'}</p>
                </div>
              </div>
              {/* <div className="pt-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-2 bg-navy hover:bg-navy/80 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
                >
                  <KeyIcon className="h-4 w-4" />
                  Change Password
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Password Change Modal with Loading */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <KeyIcon className="h-5 w-5 text-navy" />
                  Change Password
                </h3>
                <button
                  onClick={handleCancelPasswordChange} 
                  disabled={isSaving}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CrossIcon/>
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4" noValidate>
                {[
                  { field: 'currentPassword', key: 'current', label: 'Current Password', visible: showPassword.current },
                  { field: 'newPassword', key: 'new', label: 'New Password', visible: showPassword.new },
                  { field: 'confirmNewPassword', key: 'confirm', label: 'Confirm New Password', visible: showPassword.confirm }
                ].map(({ field, key, label, visible }) => (
                  <div key={field}>
                    <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <div className="relative rounded-md shadow-sm">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyIcon className="h-5 w-5 text-gray-400" />
                      </span>
                      <input
                        id={field}
                        type={visible ? 'text' : 'password'}
                        required
                        name={field}
                        value={passwordData[field]}
                        onChange={handlePasswordInputChange}
                        disabled={isSaving}
                        className={`block w-full pl-10 pr-10 border rounded-md py-2 focus:outline-none focus:ring-0 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          passwordErrors[field] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        tabIndex="-1"
                        onClick={() => togglePasswordVisibility(key)}
                        disabled={isSaving}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {visible ? <HiEye size={20} /> : <HiEyeOff size={20} />}
                      </button>
                    </div>
                    {passwordErrors[field] && (
                      <p className="text-red-600 text-sm mt-1">{passwordErrors[field]}</p>
                    )}
                  </div>
                ))}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelPasswordChange} 
                    disabled={isSaving}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`flex items-center justify-center gap-2 px-5 py-2 text-white font-medium bg-navy rounded-md shadow-sm transition-colors duration-200 ${
                      isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-navy/80'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <CircularProgress size={18} color="inherit" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>

              {/* Loading overlay for the modal */}
              {isSaving && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm">
                    <CircularProgress size={20} />
                    <span className="text-sm text-gray-700">Updating password...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FederationProfile;