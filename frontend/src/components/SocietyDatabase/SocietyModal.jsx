/* eslint-disable react/prop-types */
import CircularProgress from '@mui/material/CircularProgress';
import { PublishIcon } from '../../assets/icons/PublishIcon';
import { CrossIcon2 } from '../../assets/icons/CrossIcon';
import Dropdown from '../Dropdown/Dropdown';

const SocietyModal = ({
  isOpen,
  selectedSociety,
  isConfirmed,
  loading,
  onClose,
  onSave,
  onInputChange,
  onConfirmChange
}) => {
  if (!isOpen) return null;

  const societyTypes = ['Apartment', 'Tenement'];

  return (
    <div className="font-montserrat bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold text-gray900">
            {selectedSociety.society_code ? 'Edit Society' : 'Create New Society'}
          </div>
          <div className="text-sm text-dark-gray font-medium">
            Please input the necessary details
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray100 p-2 rounded-lg flex items-center gap-2 hover:bg-white"
          >
            <CrossIcon2 />
            <span className="text-gray700 font-medium">Cancel</span>
          </button>
          <button
            type="submit"
            onClick={onSave}
            disabled={!isConfirmed || loading}
            className="border bg-navy text-white p-2 rounded-lg flex items-center gap-2 hover:bg-navy/80 disabled:opacity-50"
          >
            <PublishIcon />
            <span>{selectedSociety.society_code ? 'Update' : 'Create'}</span>
          </button>
        </div>
      </div>

      {/* Main form */}
      <div className="w-2/3 mx-12 my-6 p-8 bg-white font-medium text-sm border border-purplegray rounded-lg space-y-6">
        <div className="space-y-4">
          {selectedSociety.society_code && (
            <div className="space-y-2">
              <label htmlFor="society_code" className="block text-gray-700">Society Code <span className='bg-gray-100 px-2 py-1 text-xs'>Uneditable</span></label>
              <input
                type="text"
                name="society_code"
                readOnly
                value={selectedSociety.society_code}
                className="w-full p-2 px-4 text-gray700 border border-gray100 rounded-lg focus:ring-0 focus:outline-none"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="block text-gray-700">Society Name</label>
            <input
              type="text"
              name="name"
              value={selectedSociety.name}
              onChange={onInputChange}
              className="w-full p-2 px-4 text-gray700 border border-gray100 rounded-lg focus:ring-0 focus:outline-none"
            />
          </div>

          <div>
            <Dropdown
              label="Society Type"
              name="society_type"
              placeholder="Select society type"
              options={societyTypes}
              value={selectedSociety.society_type}
              onChange={onInputChange}
            />
          </div>


          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="confirm-edit"
              checked={isConfirmed}
              onChange={onConfirmChange}
              className="h-4 w-4 text-navy border-gray-300 rounded"
            />
            <label htmlFor="confirm-edit" className="text-sm text-gray-700">
              I confirm that the above details are correct
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!isConfirmed || loading}
            className={`px-4 py-2 rounded-md transition flex items-center justify-center ${isConfirmed
              ? 'bg-navy hover:bg-purple text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocietyModal;



