// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { ArrowLeftIcon, UserIcon, EnvelopeIcon, PhoneIcon, HomeIcon, KeyIcon, PencilIcon, LockClosedIcon } from '@heroicons/react/24/solid';
// import { useToast } from '../../context/ToastContext';
// import { HiEye, HiEyeOff } from "react-icons/hi";
// import CircularProgress from '@mui/material/CircularProgress';
// import Loading from '../Loading/Loading';
// import apiClient from '../../services/apiClient';

// const ResidentProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [passwordMode, setPasswordMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
//   const [errors, setErrors] = useState({});
//   const showToast = useToast();
//   const [saving, setSaving] = useState(false);
//   const [passwordSaving, setPasswordSaving] = useState(false);
//   const [isConfirmed, setIsConfirmed] = useState(false);
//   const [showOldPassword, setShowOldPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);


//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await apiClient.get(`/resident/profile/get`);
//         setProfile(response.data);
//         setFormData(response.data);
//       } catch (err) {
//         showToast('Failed to load profile', 'error');
//       }
//     };
//     fetchProfile();
//   }, [showToast]);

//   const handleUpdate = async () => {
//     setSaving(true);
//     try {
//       await apiClient.put(`/resident/profile/update`, formData);
//       setProfile({ ...profile, ...formData });
//       setEditMode(false);
//       showToast('Profile updated successfully!', 'success');
//     } catch (err) {
//       showToast('Error updating profile', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handlePasswordInputChange = (e) => {
//     const { name, value } = e.target;
//     setPasswords(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };
  

//   const handlePasswordChange = async () => {
//     const { oldPassword, newPassword, confirmPassword } = passwords;
//     const newErrors = {};
//     if (!oldPassword) newErrors.oldPassword = 'Current password is required.';
//     if (!newPassword) newErrors.newPassword = 'New password is required.';
//     else if (newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters.';
//     if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your new password.';
//     else if (newPassword && newPassword !== confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match.';
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setErrors({}); 
//     setPasswordSaving(true);
//     try {
//       await apiClient.put(`/resident/profile/password`, { oldPassword, newPassword });
//       setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
//       setPasswordMode(false);
//       showToast('Password changed successfully!', 'success');
//     } catch (err) {
//       const errorMessage = err?.response?.data?.error;
//       if (errorMessage.toLowerCase().includes('old')) {
//         setErrors({ oldPassword: errorMessage });
//       } else {
//         setErrors({ newPassword: errorMessage });
//       }
//       showToast('Error changing password', 'error');
//     } finally {
//       setPasswordSaving(false);
//     }
//   };

//   if (!profile) {
//     return (<Loading />);
//   }

//   const profileTiles = [
//     { icon: <UserIcon className="h-5 w-5 text-navy" />, title: "Name", value: profile.name, field: "name" },
//     { icon: <EnvelopeIcon className="h-5 w-5 text-navy" />, title: "Email", value: profile.email, field: "email" },
//     { icon: <PhoneIcon className="h-5 w-5 text-navy" />, title: "Phone", value: profile.phone, field: "phone" },
//     { icon: <HomeIcon className="h-5 w-5 text-navy" />, title: "Address", value: profile.address, field: "address" },
//     { icon: <KeyIcon className="h-5 w-5 text-navy" />, title: "Flat No", value: profile.flat_id, field: "flat_id" },
//     { icon: <KeyIcon className="h-5 w-5 text-navy" />, title: "Society Code", value: profile.society_code, field: "society_code" }
//   ];

//   return (
//     <div className="bg-gray-50 p-4 md:p-6 font-montserrat min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         {/* Header Section */}
//         <div className="flex items-center justify-between mb-6">
//           {(editMode || passwordMode) && (
//             <button
//               onClick={() => {
//                 setEditMode(false);
//                 setPasswordMode(false);
//               }}
//               className="flex items-center text-gray-600 hover:text-gray-800 transition"
//             >
//               <ArrowLeftIcon className="h-5 w-5 mr-1" />
//               Back
//             </button>
//           )}
//         </div>

//         {/* View Mode */}
//         {!editMode && !passwordMode && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {profileTiles.map((tile, index) => (
//                 <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                   <div className="flex items-center gap-3 mb-2">
//                     {tile.icon}
//                     <h3 className="font-medium text-gray-700">{tile.title}</h3>
//                   </div>
//                   <p className="text-gray-900 pl-8">{tile.value || 'Not provided'}</p>
//                 </div>
//               ))}
//             </div>

//             <div className="flex gap-3 pt-4">
//               <button
//                 onClick={() => {
//                     setPasswordMode(true);
//                     setErrors({}); // Clear errors when opening form
//                 }}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-300 border border-gray-200 transition rounded-lg text-sm font-medium cursor-pointer"
//               >
//                 <LockClosedIcon className="h-4 w-4" />
//                 Change Password
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Edit Mode (Omitted for brevity) */}
//         {editMode && ( <div /> )}

//         {/* Password Change Mode */}
//         {passwordMode && (
//           <div className="bg-white p-6 rounded-lg shadow border border-gray-200 max-w-md mx-auto">
//             <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
//               <LockClosedIcon className="h-5 w-5 text-blue-600" />
//               Change Password
//             </h2>

//             <div className="space-y-4 mb-6">
//               {/* CURRENT PASSWORD */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
//                 <div className="relative">
//                   <input
//                     type={showOldPassword ? 'text' : 'password'}
//                     name="oldPassword"
//                     value={passwords.oldPassword}
//                     onChange={handlePasswordInputChange}
//                     className={`w-full border rounded-lg px-3 py-2 pr-10 focus:ring-blue-500 focus:border-blue-500 ${errors.oldPassword ? 'border-red-500' : 'border-gray-300'}`}
//                   />
//                   <button type="button" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowOldPassword(!showOldPassword)}>
//                     {showOldPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
//                   </button>
//                 </div>
//                 {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
//                 <div className="relative">
//                   <input
//                     type={showNewPassword ? 'text' : 'password'}
//                     name="newPassword"
//                     value={passwords.newPassword}
//                     onChange={handlePasswordInputChange}
//                     className={`w-full border rounded-lg px-3 py-2 pr-10 focus:ring-blue-500 focus:border-blue-500 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
//                   />
//                   <button type="button" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowNewPassword(!showNewPassword)}>
//                     {showNewPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
//                   </button>
//                 </div>
//                 {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
//                 <div className="relative">
//                   <input
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     name="confirmPassword"
//                     value={passwords.confirmPassword}
//                     onChange={handlePasswordInputChange}
//                     className={`w-full border rounded-lg px-3 py-2 pr-10 focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
//                   />
//                   <button type="button" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                     {showConfirmPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
//               </div>
//             </div>

//             <div className="flex gap-3 pt-4 border-t border-gray-200">
//               <button
//                 onClick={handlePasswordChange}
//                 disabled={passwordSaving}
//                 className="w-36 flex justify-center items-center px-4 py-2 bg-navy text-white hover:bg-navy/90 rounded-lg text-sm font-medium transition-colors disabled:bg-navy/70 disabled:cursor-not-allowed"
//               >
//                 {passwordSaving ? <CircularProgress size={20} color="inherit" /> : 'Update'}
//               </button>
//               <button
//                 onClick={() => {
//                     setPasswordMode(false);
//                     setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Clear fields on cancel
//                 }}
//                 className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm font-medium"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResidentProfile;

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
      const errorMessage = err?.response?.data?.error || 'Error changing password';
      setErrors({ oldPassword: errorMessage });
      showToast(errorMessage, 'error');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!profile) return <Loading />;

  const profileTiles = [
    { icon: <UserIcon className="h-5 w-5 text-navy" />, title: "Name", value: profile.name },
    { icon: <EnvelopeIcon className="h-5 w-5 text-navy" />, title: "Email", value: profile.email },
    { icon: <PhoneIcon className="h-5 w-5 text-navy" />, title: "Phone", value: profile.phone },
    { icon: <HomeIcon className="h-5 w-5 text-navy" />, title: "Address", value: profile.address },
    { icon: <KeyIcon className="h-5 w-5 text-navy" />, title: "Flat No", value: profile.flat_id },
    { icon: <KeyIcon className="h-5 w-5 text-navy" />, title: "Society Code", value: profile.society_code }
  ];

  return (
    <div className="bg-gray-50 p-4 md:p-6 font-montserrat min-h-full">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Bar for Sub-modes */}
        {(editMode || passwordMode) && (
          <div className="mb-6">
            <button
              onClick={() => {
                setEditMode(false);
                setPasswordMode(false);
              }}
              className="flex items-center text-navy font-semibold hover:underline transition"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Profile
            </button>
          </div>
        )}

        {/* --- VIEW MODE --- */}
        {!editMode && !passwordMode && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-navy-dark mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileTiles.map((tile, index) => (
                <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      {tile.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{tile.title}</h3>
                  </div>
                  <p className="text-gray-900 font-medium text-lg truncate">
                    {tile.value || 'Not provided'}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                onClick={() => {
                    setPasswordMode(true);
                    setErrors({});
                }}
                className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition rounded-xl text-sm font-bold text-navy cursor-pointer"
              >
                <LockClosedIcon className="h-4 w-4" />
                Security Settings
              </button>
            </div>
          </div>
        )}

        {/* --- PASSWORD CHANGE MODE --- */}
        {passwordMode && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md mx-auto animate-in zoom-in-95 duration-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4">
                <LockClosedIcon className="h-8 w-8 text-navy" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
              <p className="text-sm text-gray-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
            </div>

            <div className="space-y-5 mb-8">
              {/* Common input pattern for responsive forms */}
              {[
                { label: 'Current Password', name: 'oldPassword', show: showOldPassword, setShow: setShowOldPassword, error: errors.oldPassword },
                { label: 'New Password', name: 'newPassword', show: showNewPassword, setShow: setShowNewPassword, error: errors.newPassword },
                { label: 'Confirm New Password', name: 'confirmPassword', show: showConfirmPassword, setShow: setShowConfirmPassword, error: errors.confirmPassword },
              ].map((input) => (
                <div key={input.name}>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">{input.label}</label>
                  <div className="relative">
                    <input
                      type={input.show ? 'text' : 'password'}
                      name={input.name}
                      value={passwords[input.name]}
                      onChange={handlePasswordInputChange}
                      className={`w-full border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-navy focus:border-transparent transition-all outline-none ${input.error ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}
                    />
                    <button 
                      type="button" 
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-navy transition-colors" 
                      onClick={() => input.setShow(!input.show)}
                    >
                      {input.show ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                    </button>
                  </div>
                  {input.error && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{input.error}</p>}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handlePasswordChange}
                disabled={passwordSaving}
                className="w-full flex justify-center items-center px-6 py-3 bg-navy text-white hover:bg-navy-dark rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {passwordSaving ? <CircularProgress size={20} color="inherit" /> : 'Update Password'}
              </button>
              <button
                onClick={() => {
                    setPasswordMode(false);
                    setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="w-full px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-bold transition-colors"
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