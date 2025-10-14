import { useState, useEffect } from 'react';
import axios from 'axios';
import apiClient from '../../services/apiClient';
// components
import SocietyList from '../SocietyDatabase/SocietyList';
import SocietyDetail from '../SocietyDatabase/SocietyDetailView';
import SocietyModal from '../SocietyDatabase/SocietyModal';
import DeleteDialog from '../DeleteDialog/DeleteDialog';
import Loading from '../../components/Loading/Loading'; // Import your Loading component

export default function FederationSocietySetup() {
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [selectedSocietyDetail, setSelectedSocietyDetail] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSocieties, setLoadingSocieties] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false); // New loading state for detail view
  const [serverError, setServerError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [societyToDelete, setSocietyToDelete] = useState(null);

  // Filter and pagination logic
  const filteredSocieties = societies.filter(society => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    if (society.society_code.toLowerCase().includes(term)) return true;
    if (society.name.toLowerCase().includes(term)) return true;
    if (society.society_type.toLowerCase().includes(term)) return true;
    return false;
  });

  const pageSize = 10;
  const pageCount = Math.ceil(filteredSocieties.length / pageSize);
  const start = page * pageSize;
  const end = Math.min(start + pageSize, filteredSocieties.length);
  const visibleSocieties = filteredSocieties.slice(start, end);

  useEffect(() => {
    const fetchSocieties = async () => {
      setLoadingSocieties(true);
      try {
        const response = await apiClient.get(`federation/get/society`);
        setSocieties(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching societies:', error);
        setSocieties([]);
      } finally {
        setLoadingSocieties(false);
      }
    };
    fetchSocieties();
  }, []);

  const validateSociety = (society) => {
    const errors = {};
    let isValid = true;
    if (!society.name?.trim()) {
      errors.name = "Society name is required";
      isValid = false;
    }
    if (!society.society_type?.trim()) {
      errors.society_type = "Society type is required";
      isValid = false;
    }
    setValidationErrors(errors);
    return isValid;
  };

  const handleAddClick = () => {
    setSelectedSociety({ 
      name: '', 
      society_type: 'Apartment',
      society_code: ''
    });
    setIsEditing(true);
    setIsConfirmed(false);
    setSelectedSocietyDetail(null);
    setValidationErrors({});
    setServerError("");
  };

  const handleEditClick = (society) => {
    setSelectedSociety(society);
    setIsEditing(true);
    setIsConfirmed(false);
    setSelectedSocietyDetail(null);
    setValidationErrors({});
    setServerError("");
  };

  const handleViewDetails = async (society) => {
    setLoadingDetail(true);
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setSelectedSocietyDetail(society);
    setIsEditing(false);
    setLoadingDetail(false);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setIsConfirmed(false);
    setSelectedSociety(null);
    setValidationErrors({});
    setServerError("");
  };

  const handleChange = (e) => {
    setSelectedSociety(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    }));
  };

  const handleConfirmChange = () => setIsConfirmed(prev => !prev);

  const handleSave = async () => {
    if (!validateSociety(selectedSociety)) return;
    if (!isConfirmed) return;
    setLoading(true);
    try {
      let response;
      if (selectedSociety.society_code) {
        // Update existing society
        const payload = {
          name: selectedSociety.name,
          society_type: selectedSociety.society_type,
        };
        response = await apiClient.put(`federation/update/society/${selectedSociety.society_code}`, payload);
        setSocieties(prev =>
          prev.map(soc =>
            soc.society_code === selectedSociety.society_code ? response.data : soc
          )
        );
      } else {
        // Create new society
        const payload = {
          name: selectedSociety.name,
          societyType: selectedSociety.society_type,
        };
        response = await apiClient.post(`federation/create/society`, payload);
        setSocieties(prev => [...prev, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving society:', error);
      setServerError(error.response?.data?.message || "An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSociety = async () => {
    if (!societyToDelete) return;
    
    setDeleteLoading(true);
    try {
      await apiClient.delete(`federation/delete/society/${selectedSociety.society_code}`);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/federation/deleteSociety`,
        { data: { societyCode: societyToDelete.society_code } }
      );
      setSocieties(prev => 
        prev.filter(soc => soc.society_code !== societyToDelete.society_code)
      );
      setSelectedSocietyDetail(null);
    } catch (error) {
      console.error('Error deleting society:', error);
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
      setSocietyToDelete(null);
    }
  };

  // Main loading state for initial data fetch
  if (loadingSocieties) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loading fullScreen={false} />
      </div>
    );
  }

  return (
    <div className="rounded-xl font-montserrat font-medium">
      {isEditing && (
        <SocietyModal
          isOpen={isEditing}
          selectedSociety={selectedSociety}
          isConfirmed={isConfirmed}
          loading={loading}
          validationErrors={validationErrors}
          serverError={serverError}
          onClose={handleCloseModal}
          onSave={handleSave}
          onInputChange={handleChange}
          onConfirmChange={handleConfirmChange}
        />
      )}

      {!isEditing && !selectedSocietyDetail && (
        <SocietyList
          societies={societies}
          visibleSocieties={visibleSocieties}
          loading={loading}
          loadingSocieties={loadingSocieties}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          page={page}
          setPage={setPage}
          pageCount={pageCount}
          start={start}
          end={end}
          onEditClick={handleEditClick}
          onViewClick={handleViewDetails}
          handleAddClick={handleAddClick}
        />
      )}

      {/* Loading state for detail view */}
      {loadingDetail && (
        <div className="flex justify-center items-center min-h-64">
          <Loading fullScreen={false} />
        </div>
      )}

      {!isEditing && selectedSocietyDetail && !loadingDetail && (
        <SocietyDetail
          society={selectedSocietyDetail}
          onBack={() => setSelectedSocietyDetail(null)}
          onEdit={() => handleEditClick(selectedSocietyDetail)}
          onDelete={() => {
            setSocietyToDelete(selectedSocietyDetail);
            setShowDeleteDialog(true);
          }}
        />
      )}

      {showDeleteDialog && (
        <DeleteDialog
          deleteLoading={deleteLoading}
          setShowDeleteDialog={setShowDeleteDialog}
          handleDeleteDoc={handleDeleteSociety}
          setDocToDelete={setSocietyToDelete}
        />
      )}
    </div>
  );
}