import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FlatSetup = ({ society_code: propSocietyCode }) => {
    const [societyCode, setSocietyCode] = useState(propSocietyCode || localStorage.getItem("society_code"));
    const [flats, setFlats] = useState([]);
    const [currentFlat, setCurrentFlat] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [ownerEntered, setOwnerEntered] = useState(false);
    const [residentEntered, setResidentEntered] = useState(false);
    const [isNewFlat, setIsNewFlat] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (societyCode) {
            fetchFlats();
        }
    }, [societyCode]);

    const fetchFlats = async () => {
        try {
            const response = await fetch(`/auth/society/getFlatsData/${societyCode}`);
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            
            const sortedFlats = data.sort((a, b) => {
                const numA = parseInt(a.flat_id.replace(/\D/g, ''), 10) || 0;
                const numB = parseInt(b.flat_id.replace(/\D/g, ''), 10) || 0;
                
                if (numA === numB) {
                    return a.flat_id.localeCompare(b.flat_id);
                }
                return numA - numB;
            });
            
            setFlats(sortedFlats);
        } catch (error) {
            console.error("Error fetching flats:", error);
        }
    };

    const handleEdit = (flat) => {
        setCurrentFlat(flat);
        setEditedData({
            ...flat,
            owner: flat.owner || { name: '', email: '', phone: '', address: '' },
            resident: flat.resident || { name: '', email: '', phone: '', address: '' }
        });
        setIsNewFlat(false);
        setShowModal(true);
        setValidationErrors({});
        setOwnerEntered(false);
        setResidentEntered(false);
    };

    const handleAddNew = () => {
        setCurrentFlat({
            id: null,
            flat_id: '',
            occupancy: '',
            owner_id: null,
            resident_id: null,
            owner: { name: '', email: '', phone: '', address: '' },
            resident: { name: '', email: '', phone: '', address: '' }
        });
        setEditedData({
            flat_id: '',
            occupancy: '',
            owner: { name: '', email: '', phone: '', address: '' },
            resident: { name: '', email: '', phone: '', address: '' }
        });
        setIsNewFlat(true);
        setShowModal(true);
        setValidationErrors({});
        setOwnerEntered(false);
        setResidentEntered(false);
    };

    const saveAllData = async () => {
        if (!validateDetails()) {
            return;
        }
        
        try {
            const { id, flat_id, occupancy, owner, resident } = editedData;
            
            const endpoint = isNewFlat ? '/auth/society/createFlat' : '/auth/society/saveFlatsData';
            
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: isNewFlat ? undefined : id,
                    society_code: societyCode,
                    flat_id,
                    occupancy,
                    owner_id: isNewFlat ? null : currentFlat.owner_id,
                    resident_id: isNewFlat ? null : currentFlat.resident_id,
                    owner_name: owner.name,
                    owner_email: owner.email,
                    owner_phone: owner.phone,
                    owner_address: owner.address,
                    resident_name: resident.name,
                    resident_email: resident.email,
                    resident_phone: resident.phone,
                    resident_address: resident.address
                }),
            });
            
            if (!response.ok) throw new Error("Failed to save data");
            
            await response.json();
            setShowModal(false);
            setIsNewFlat(false);
            fetchFlats();
        } catch (error) {
            console.error("Error saving flat data:", error);
        }
    };

    const validateDetails = () => {
        const errors = {};
        let isValid = true;

        // Basic flat validation
        if (!editedData.flat_id?.trim()) {
            errors.flat_id = "Flat ID is required";
            isValid = false;
        }
        
        if (!editedData.occupancy?.trim()) {
            errors.occupancy = "Occupancy is required";
            isValid = false;
        }

        // Owner validation
        if (ownerEntered || (editedData.owner && (editedData.owner.name || editedData.owner.email || editedData.owner.phone))) {
            if (!editedData.owner?.name?.trim()) {
                errors.ownerName = "Owner name is required";
                isValid = false;
            }
            if (!editedData.owner?.email?.trim()) {
                errors.ownerEmail = "Owner email is required";
                isValid = false;
            } else if (!/^\S+@\S+\.\S+$/.test(editedData.owner.email)) {
                errors.ownerEmail = "Invalid email format";
                isValid = false;
            }
            if (!editedData.owner?.phone?.trim()) {
                errors.ownerPhone = "Owner phone is required";
                isValid = false;
            }
        }

        // Resident validation
        if (editedData.occupancy === 'Rented' && 
            (residentEntered || (editedData.resident && (editedData.resident.name || editedData.resident.email || editedData.resident.phone)))) {
            if (!editedData.resident?.name?.trim()) {
                errors.residentName = "Resident name is required";
                isValid = false;
            }
            if (!editedData.resident?.email?.trim()) {
                errors.residentEmail = "Resident email is required";
                isValid = false;
            } else if (!/^\S+@\S+\.\S+$/.test(editedData.resident.email)) {
                errors.residentEmail = "Invalid email format";
                isValid = false;
            }
            if (!editedData.resident?.phone?.trim()) {
                errors.residentPhone = "Resident phone is required";
                isValid = false;
            }
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleOwnerChange = (field, value) => {
        setOwnerEntered(true);
        setEditedData(prev => ({
            ...prev,
            owner: {
                ...prev.owner,
                [field]: value,
            },
        }));
    };

    const handleResidentChange = (field, value) => {
        setResidentEntered(true);
        setEditedData(prev => ({
            ...prev,
            resident: {
                ...prev.resident,
                [field]: value,
            },
        }));
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Flat Details</h2>

               <div className="">
                    <button className="bg-green-400 p-2 rounded-2xl text-white mt-2" onClick={() => navigate("/society/dashboard")}>
                        Dashboard
                    </button>
                    <button
                        onClick={handleAddNew}
                        className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
                    >
                        Add New Flat
                    </button>
               </div>
            </div>

            {flats.length > 0 ? (
                <table className="mt-4 w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Sno</th>
                            <th className="border p-2">Flat ID</th>
                            <th className="border p-2">Occupancy</th>
                            <th className="border p-2">Owner</th>
                            <th className="border p-2">Resident</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flats.map((flat, index) => (
                            <tr key={flat.id} className="border">
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{flat.flat_id}</td>
                                <td className="border p-2">{flat.occupancy || "No Info"}</td>
                                <td className="border p-2">
                                    {flat.owner ? (
                                        <div>
                                            <p>Name: {flat.owner.name}</p>
                                            <p>Email: {flat.owner.email}</p>
                                            <p>Phone: {flat.owner.phone}</p>
                                        </div>
                                    ) : (
                                        "No Info"
                                    )}
                                </td>
                                <td className="border p-2">
                                    {flat.occupancy === 'Rented' && flat.resident ? (
                                        <div>
                                            <p>Name: {flat.resident.name}</p>
                                            <p>Email: {flat.resident.email}</p>
                                            <p>Phone: {flat.resident.phone}</p>
                                        </div>
                                    ) : (
                                        "No Info"
                                    )}
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => handleEdit(flat)}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No flats found for this society.</p>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">
                            {isNewFlat ? "Add New Flat" : "Edit Flat Details"}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block mb-2 font-medium">Flat ID*</label>
                                <input
                                    type="text"
                                    value={editedData.flat_id || ''}
                                    onChange={(e) => handleChange("flat_id", e.target.value)}
                                    className={`border p-2 w-full rounded ${validationErrors.flat_id ? 'border-red-500' : ''}`}
                                />
                                {validationErrors.flat_id && <p className="text-red-500 text-sm">{validationErrors.flat_id}</p>}
                            </div>
                            
                            <div>
                                <label className="block mb-2 font-medium">Occupancy*</label>
                                <select
                                    value={editedData.occupancy || ''}
                                    onChange={(e) => handleChange("occupancy", e.target.value)}
                                    className={`border p-2 w-full rounded ${validationErrors.occupancy ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Select Occupancy</option>
                                    <option value="Rented">Rented</option>
                                    <option value="Occupied">Occupied</option>
                                    <option value="Unoccupied">Unoccupied</option>
                                </select>
                                {validationErrors.occupancy && <p className="text-red-500 text-sm">{validationErrors.occupancy}</p>}
                            </div>
                        </div>
                        
                        <div className="mb-6 p-4 border rounded">
                            <h4 className="font-bold mb-3">Owner Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={editedData.owner?.name || ''}
                                        onChange={(e) => handleOwnerChange("name", e.target.value)}
                                        className={`border p-2 w-full rounded ${validationErrors.ownerName ? 'border-red-500' : ''}`}
                                    />
                                    {validationErrors.ownerName && <p className="text-red-500 text-sm">{validationErrors.ownerName}</p>}
                                </div>
                                <div>
                                    <label className="block mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={editedData.owner?.email || ''}
                                        onChange={(e) => handleOwnerChange("email", e.target.value)}
                                        className={`border p-2 w-full rounded ${validationErrors.ownerEmail ? 'border-red-500' : ''}`}
                                    />
                                    {validationErrors.ownerEmail && <p className="text-red-500 text-sm">{validationErrors.ownerEmail}</p>}
                                </div>
                                <div>
                                    <label className="block mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={editedData.owner?.phone || ''}
                                        onChange={(e) => handleOwnerChange("phone", e.target.value)}
                                        className={`border p-2 w-full rounded ${validationErrors.ownerPhone ? 'border-red-500' : ''}`}
                                    />
                                    {validationErrors.ownerPhone && <p className="text-red-500 text-sm">{validationErrors.ownerPhone}</p>}
                                </div>
                                <div>
                                    <label className="block mb-2">Address</label>
                                    <input
                                        type="text"
                                        value={editedData.owner?.address || ''}
                                        onChange={(e) => handleOwnerChange("address", e.target.value)}
                                        className="border p-2 w-full rounded"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {(editedData.occupancy === 'Rented' || (currentFlat && currentFlat.occupancy === 'Rented')) && (
                            <div className="mb-6 p-4 border rounded">
                                <h4 className="font-bold mb-3">Resident Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={editedData.resident?.name || ''}
                                            onChange={(e) => handleResidentChange("name", e.target.value)}
                                            className={`border p-2 w-full rounded ${validationErrors.residentName ? 'border-red-500' : ''}`}
                                        />
                                        {validationErrors.residentName && <p className="text-red-500 text-sm">{validationErrors.residentName}</p>}
                                    </div>
                                    <div>
                                        <label className="block mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={editedData.resident?.email || ''}
                                            onChange={(e) => handleResidentChange("email", e.target.value)}
                                            className={`border p-2 w-full rounded ${validationErrors.residentEmail ? 'border-red-500' : ''}`}
                                        />
                                        {validationErrors.residentEmail && <p className="text-red-500 text-sm">{validationErrors.residentEmail}</p>}
                                    </div>
                                    <div>
                                        <label className="block mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={editedData.resident?.phone || ''}
                                            onChange={(e) => handleResidentChange("phone", e.target.value)}
                                            className={`border p-2 w-full rounded ${validationErrors.residentPhone ? 'border-red-500' : ''}`}
                                        />
                                        {validationErrors.residentPhone && <p className="text-red-500 text-sm">{validationErrors.residentPhone}</p>}
                                    </div>
                                    <div>
                                        <label className="block mb-2">Address</label>
                                        <input
                                            type="text"
                                            value={editedData.resident?.address || ''}
                                            onChange={(e) => handleResidentChange("address", e.target.value)}
                                            className="border p-2 w-full rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setValidationErrors({});
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveAllData}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                {isNewFlat ? "Create Flat" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default FlatSetup;