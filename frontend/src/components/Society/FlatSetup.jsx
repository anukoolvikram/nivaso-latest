import { useState, useEffect, useRef } from "react";
import { uploadDocumentToCloudinary } from "../../utils/uploadDocuments";
// components
import FlatList from "../FlatDatabase/FlatList";
import FlatDetailView from "../FlatDatabase/FlatDetailView";
import FlatModal from "../FlatDatabase/FlatModal";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import apiClient from '../../services/apiClient';

const SocietyFlatSetup = () => {
  const [flats, setFlats] = useState([]);
  const [currentFlat, setCurrentFlat] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isNewFlat, setIsNewFlat] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoadingFlats, setIsLoadingFlats] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewingFlat, setViewingFlat] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    fetchFlats();
  }, []);

  useEffect(() => {
    if (viewingFlat) {
      fetchDocuments(viewingFlat.id);
    }
  }, [viewingFlat]);

  const fetchFlats = async () => {
    setIsLoadingFlats(true);
    try {
      const res = await apiClient.get(`/society/flats/get`);
      const sorted = res.data.sort((a, b) => {
        const [blockA, numA] = [a.flat_number[0], parseInt(a.flat_number.slice(1), 10)];
        const [blockB, numB] = [b.flat_number[0], parseInt(b.flat_number.slice(1), 10)];
        return blockA === blockB ? numA - numB : blockA.localeCompare(blockB);
      });
      setFlats(sorted);
      return sorted;
    } catch (error) {
      console.error("Error fetching flats:", error);
    } finally {
      setIsLoadingFlats(false);
    }
  };

  const fetchDocuments = async (flat_id) => {
    try {
      const res = await apiClient.get(`/society/flat/document/${flat_id}`);
      setDocuments(res.data.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleEdit = (flat) => {
    setCurrentFlat(flat);
    setEditedData({
      ...flat,
      owner: flat.owner || { name: "", email: "", phone: "", address: "", initial_password: null },
      resident: flat.resident || { name: "", email: "", phone: "", address: "" },
    });
    setIsNewFlat(false);
    setShowModal(true);
    setValidationErrors({});
    setIsConfirmed(false);
  };

  const handleAddNew = () => {
    const empty = {
      flat_id: "",
      occupancy: "",
      owner: { name: "", email: "", phone: "", address: "", initial_password: null },
      resident: { name: "", email: "", phone: "", address: "" },
    };
    setCurrentFlat({ id: null });
    setEditedData(empty);
    setIsNewFlat(true);
    setShowModal(true);
    setValidationErrors({});
    setIsConfirmed(false);
  };

  const validateDetails = () => {
    const errors = {};
    let valid = true;
    const { flat_number, occupancy, owner, resident } = editedData;

    if (!flat_number?.trim()) {
      errors.flat_number = "Flat number is required";
      valid = false;
    } else if (!/^[A-Za-z]\d+$/.test(flat_number.trim())) {
      errors.flat_number = "Flat number should be in format like A101, B202 etc.";
      valid = false;
    }

    if (!occupancy?.trim()) {
      errors.occupancy = "Occupancy is required";
      valid = false;
    }

    // Owner validation - required for all flats
    if (!owner?.name?.trim()) {
      errors.ownerName = "Owner name is required";
      valid = false;
    }
    if (!owner?.email?.trim()) {
      errors.ownerEmail = "Owner email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(owner.email)) {
      errors.ownerEmail = "Invalid email format";
      valid = false;
    }
    if (!owner?.phone?.trim()) {
      errors.ownerPhone = "Owner phone is required";
      valid = false;
    }
    else if(owner?.phone?.length!=10){
      errors.ownerPhone = "Please enter valid phone number";
      valid = false;
    }

    // Resident validation - only required if occupancy is "Rented"
    if (occupancy === "Rented") {
      if (!resident?.name?.trim()) {
        errors.residentName = "Resident name is required";
        valid = false;
      }
      if (!resident?.email?.trim()) {
        errors.residentEmail = "Resident email is required";
        valid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(resident.email)) {
        errors.residentEmail = "Invalid email format";
        valid = false;
      }
      if (!resident?.phone?.trim()) {
        errors.residentPhone = "Resident phone is required";
        valid = false;
      }else if(resident?.phone?.length!=10){
        errors.residentPhone = "Please enter valid phone number";
        valid = false;
      }
    }

    setValidationErrors(errors);
    return valid;
  };

  const saveAllData = async () => {
    if (!validateDetails()) return;
    setSaving(true);
    setServerError("");
    const { id, flat_number, occupancy, owner, resident } = editedData;

    try {
      const endpoint = isNewFlat
        ? `/society/flats/create`
        : `/society/flats/update/${id}`;

      const flatData = {
        flat_number: flat_number,
        occupancy_status: occupancy,
        owner_id: isNewFlat ? null : currentFlat?.owner_id,
        resident_id: isNewFlat ? null : currentFlat?.resident_id,
        owner_name: owner.name,
        owner_email: owner.email,
        owner_phone: owner.phone,
        owner_address: owner.address,
        resident_name: occupancy === 'Rented' ? resident.name : undefined,
        resident_email: occupancy === 'Rented' ? resident.email : undefined,
        resident_phone: occupancy === 'Rented' ? resident.phone : undefined,
      };

      await apiClient.post(endpoint, flatData);
      setShowModal(false);
      const updatedFlats = await fetchFlats();
      if (!isNewFlat) {
        const updatedFlatInList = updatedFlats.find((f) => f.id === id);
        if (updatedFlatInList) setViewingFlat(updatedFlatInList);
      }
    } catch (err) {
      console.error("Save error:", err.response.data.message);
      setServerError("An unexpected server error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOwnerChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      owner: { ...prev.owner, [field]: value },
    }));
  };

  const handleResidentChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      resident: { ...prev.resident, [field]: value },
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle.trim() || !viewingFlat?.id) return;
    abortControllerRef.current = new AbortController();

    setUploadLoading(true);
    try {
      const documentUrl = await uploadDocumentToCloudinary(uploadFile, {
        signal: abortControllerRef.current.signal
      });
      await apiClient.post(`/society/flat/document`, {
        title: uploadTitle,
        flat_id: viewingFlat.id,
        url: documentUrl,
      });
      await fetchDocuments(viewingFlat.id);
      setUploadTitle("");
      setUploadFile(null);
      setShowUploadForm(false);
    } catch (error) {
      console.error("Document upload failed:", error);
    } finally {
      setUploadLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setShowUploadForm(false);
    setUploadTitle('');
    setUploadFile(null);
    setUploadLoading(false);
  };

  const handleDeleteDoc = async () => {
    if (!docToDelete) return;
    setDeleteLoading(true);
    try {
      await apiClient.delete(`/society/flat/document/${docToDelete}`);
      await fetchDocuments(viewingFlat.id);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
      setDocToDelete(null);
    }
  };

  const filteredFlats = flats.filter((flat) => {
    const term = searchTerm.trim().toLowerCase();
    return (
      flat.flat_number.toLowerCase().includes(term) ||
      flat.owner?.name?.toLowerCase().includes(term) ||
      flat.owner?.phone?.includes(term) ||
      flat.resident?.name?.toLowerCase().includes(term) ||
      flat.resident?.phone?.includes(term)
    );
  });

  const pageSize = 10;
  const pageCount = Math.ceil(filteredFlats.length / pageSize);
  const start = page * pageSize;
  const visibleFlats = filteredFlats.slice(start, start + pageSize);

  return (
    <div className="bg-white rounded-xl font-montserrat font-medium">
      {!showModal && (
        !viewingFlat ? (
          <FlatList
            isLoadingFlats={isLoadingFlats}
            flats={flats}
            visibleFlats={visibleFlats}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            page={page}
            setPage={setPage}
            pageCount={pageCount}
            start={start}
            end={start + visibleFlats.length}
            handleAddNew={handleAddNew}
            handleEdit={handleEdit}
            setViewingFlat={setViewingFlat}
          />
        ) : (
          <FlatDetailView
            viewingFlat={viewingFlat}
            documents={documents}
            uploadTitle={uploadTitle}
            uploadFile={uploadFile}
            showUploadForm={showUploadForm}
            uploadLoading={uploadLoading}
            setViewingFlat={setViewingFlat}
            setUploadTitle={setUploadTitle}
            setUploadFile={setUploadFile}
            setShowUploadForm={setShowUploadForm}
            handleUpload={handleUpload}
            setDocToDelete={setDocToDelete}
            setShowDeleteDialog={setShowDeleteDialog}
            onCancelUpload={handleCancelUpload}
          />
        )
      )}


      {showModal && (
        <FlatModal
          isNewFlat={isNewFlat}
          editedData={editedData}
          validationErrors={validationErrors}
          isConfirmed={isConfirmed}
          serverError={serverError}
          saving={saving}
          handleChange={handleChange}
          handleOwnerChange={handleOwnerChange}
          handleResidentChange={handleResidentChange}
          setShowModal={setShowModal}
          setIsConfirmed={setIsConfirmed}
          saveAllData={saveAllData}
          setValidationErrors={setValidationErrors}
          onCancel={() => {
            setShowModal(false);
            setValidationErrors({});
          }}
        />
      )}

      {showDeleteDialog && (
        <DeleteDialog
          deleteLoading={deleteLoading}
          setShowDeleteDialog={setShowDeleteDialog}
          handleDeleteDoc={handleDeleteDoc}
          setDocToDelete={setDocToDelete}
        />
      )}
    </div>
  );
};

export default SocietyFlatSetup;
