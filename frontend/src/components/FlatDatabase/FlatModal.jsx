/* eslint-disable react/prop-types */
import CircularProgress from '@mui/material/CircularProgress';
import { UserCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const FlatModal = ({
  isNewFlat,
  editedData,
  validationErrors,
  isConfirmed,
  serverError,
  saving,
  handleChange,
  handleOwnerChange,
  handleResidentChange,
  setIsConfirmed,
  saveAllData,
  onCancel
}) => {
  const ownerFields = [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'address', label: 'Address', type: 'text', required: false },
  ];
  
  const residentFields = [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'address', label: 'Address', type: 'text', required: false },
  ];

  return (
    <div className="p-4 px-6 bg-gray-100">
      <div className="text-lg font-semibold text-gray-800 mb-4">
        {isNewFlat ? "New Flat Registration" : "Edit Flat Details"}
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8 bg-white rounded-lg shadow">
        <FormSection title="Flat Information" icon={<BuildingOfficeIcon className="h-5 w-5 text-gray-500" />}>
          <FormField 
            label="Flat Number*" 
            id="flat_number" 
            error={validationErrors.flat_number}
          >
            <input
              type="text"
              id="flat_number"
              value={editedData.flat_number || ''}
              onChange={(e) => handleChange("flat_number", e.target.value)}
              className={`py-1 px-2 text-sm border-2 rounded focus:outline-none focus:ring-0 ${
                validationErrors.flat_number ? 'border-red-500' : 'border-purplegray'
              }`}
              placeholder="A101, B202, etc."
            />
          </FormField>

          <FormField 
            label="Occupancy Status*" 
            id="occupancy" 
            error={validationErrors.occupancy}
          >
            <select
              id="occupancy"
              value={editedData.occupancy || ''}
              onChange={(e) => handleChange("occupancy", e.target.value)}
              className={`py-1 px-2 text-sm border-2 rounded focus:outline-none focus:ring-0 ${
                validationErrors.occupancy ? 'border-red-500' : 'border-purplegray'
              }`}
            >
              <option value="" disabled>Select occupancy</option>
              <option value="Rented">Rented</option>
              <option value="Occupied">Occupied by Owner</option>
            </select>
          </FormField>
        </FormSection>

        {/* Owner Details Section */}
        <FormSection
          title="Owner Details"
          icon={<UserCircleIcon className="h-5 w-5 text-gray-500" />}
        >
          {ownerFields.map(field => {
            const errorKey = `owner${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`;
            return (
              <FormField
                key={`owner-${field.name}`}
                label={field.label + (field.required ? '*' : '')}
                id={`owner-${field.name}`}
                error={validationErrors[errorKey]}
              >
                <input
                  type={field.type}
                  id={`owner-${field.name}`}
                  value={editedData.owner?.[field.name] || ''}
                  onChange={(e) => handleOwnerChange(field.name, e.target.value)}
                  className={`py-1 px-2 text-sm border-2 rounded focus:outline-none focus:ring-0 ${
                    validationErrors[errorKey] ? 'border-red-500' : 'border-purplegray'
                  }`}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </FormField>
            );
          })}
        </FormSection>

        {/* Resident Details (Conditional) */}
        {editedData.occupancy === 'Rented' && (
          <FormSection
            title="Resident Details"
            icon={<UserCircleIcon className="h-5 w-5 text-gray-500" />}
          >
            {residentFields.map(field => {
              const errorKey = `resident${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`;
              return (
                <FormField
                  key={`resident-${field.name}`}
                  label={field.label + (field.required ? '*' : '')}
                  id={`resident-${field.name}`}
                  error={validationErrors[errorKey]}
                >
                  <input
                    type={field.type}
                    id={`resident-${field.name}`}
                    value={editedData.resident?.[field.name] || ''}
                    onChange={(e) => handleResidentChange(field.name, e.target.value)}
                    className={`py-1 px-2 text-sm border-2 rounded focus:outline-none focus:ring-0 ${
                      validationErrors[errorKey] ? 'border-red-500' : 'border-purplegray'
                    }`}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </FormField>
              );
            })}
          </FormSection>
        )}

        {/* Confirmation Checkbox */}
        {!isNewFlat && (
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="confirm-edit"
                checked={isConfirmed}
                onChange={() => setIsConfirmed(!isConfirmed)}
                className="py-1 px-2 text-sm border-2 border-purplegray rounded focus:outline-none focus:ring-0"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="confirm-edit" className="font-medium text-gray-700">
                Confirm changes
              </label>
              <p className="text-gray-500">I verify that these changes are correct</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        {serverError && (
          <div className="text-sm text-red-600">
            <p>Error: {serverError}</p>
          </div>
        )}
        <div className="flex space-x-3 ml-auto">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveAllData}
            disabled={saving || (!isNewFlat && !isConfirmed)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-navy hover:bg-navy/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <CircularProgress size={16} color="inherit" className="mr-2" />
              </>
            ) : isNewFlat ? (
              'Register Flat'
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Form Section Component
const FormSection = ({ title, icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center space-x-2">
      {icon}
      <h3 className="text-base font-medium text-gray-700">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
      {children}
    </div>
  </div>
);

// Form Field Component
const FormField = ({ label, id, error, children }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    {children}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default FlatModal;