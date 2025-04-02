import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SocietySetup = ({ federation_code: propFederationCode }) => {
  const [federationCode, setFederationCode] = useState(propFederationCode || localStorage.getItem('federation_code'));
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log('federationCode:', federationCode);
    const fetchSocieties = async () => {
        try {
          const response = await axios.get('/auth/federation/getSociety', {
            params: { federationCode }
          });
          console.log("API Response:", response.data);
          setSocieties(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error('Error fetching societies:', error);
          setSocieties([]); // Ensure societies is always an array
        }
    };

    fetchSocieties();

    return () => {
      // Cleanup if necessary
    };
  }, [federationCode]);

  const handleEditClick = (society) => {
    setSelectedSociety(society);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setSelectedSociety((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        societyCode: selectedSociety.society_code, // Ensure sending correct field
        societyName: selectedSociety.society_name,
        societyType: selectedSociety.society_type,
      };
  
      const response = await axios.put('/auth/federation/updateSociety', payload); // Correct endpoint
  
      setSocieties((prev) =>
        prev.map((soc) =>
          soc.society_code === selectedSociety.society_code ? response.data : soc
        )
      );
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving society:', error);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <div className='justify-between flex'>
        <h2 className="text-2xl font-bold mb-4">Society Setup</h2>
        <button className="bg-green-400 p-1 rounded-2xl text-white mt-2" onClick={() => navigate("/federation/dashboard")}>
            Dashboard
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
            <tr>
            <th className="py-2">S. No.</th>
            <th className="py-2">Society Code</th>
            <th className="py-2">Society Name</th>
            <th className="py-2">Society Type</th>
            <th className="py-2">Actions</th>
            </tr>
        </thead>
        <tbody>
            {societies.map((society, index) => (
            <tr key={society.id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{society.society_code}</td>
                <td className="border px-4 py-2">{society.society_name}</td>
                <td className="border px-4 py-2">{society.society_type}</td>
                <td className="border px-4 py-2">
                <button
                    onClick={() => handleEditClick(society)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Edit
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>


        {isEditing && selectedSociety && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Society</h2>

            <div className="mb-4">
            <label className="block text-gray-700">Society Name</label>
            <input
                type="text"
                name="society_name"
                value={selectedSociety?.society_name || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
            />
            </div>


            {/* Dropdown for Society Type */}
            <div className="mb-4">
            <label className="block text-gray-700">Society Type</label>
            <select
                name="society_type"
                value={selectedSociety?.society_type || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
            >
                <option value="">Select Society Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Tenement">Tenement</option>
            </select>
            </div>

            <div className="flex justify-end">
            <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Save
            </button>
            </div>
        </div>
        </div>
        )}

    </div>
  );
};

export default SocietySetup;
