/* eslint-disable react/prop-types */
import CircularProgress from '@mui/material/CircularProgress';
import Dropdown from '../../Dropdown/Dropdown';

const ChangeStatus = ({
  newStatus,
  setNewStatus,
  dismissComment,
  setDismissComment,
  saveError,
  handleSaveStatus,
  updatingStatus,
  isReadOnly,
  complaint
}) => {
  const statusOptions = [
    'Under Review',
    'Taking Action',
    'Dismissed',
    'Resolved'
  ];

  return (
    <div className='space-y-4'>
      <div className='text-sm font-medium space-y-2'>
        <div className='text-gray700'>Current</div>
        <div className='border border-gray100 rounded-lg px-4 py-2.5'>{complaint.status}</div>
      </div>

      {!isReadOnly ? (
        <div>
          <div className='text-sm'>
            <Dropdown
              label="Update"
              placeholder="Select status"
              options={statusOptions}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              name="status"
            />

          </div>

          {newStatus === 'Dismissed' && (
            <div className="mb-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Comment:
              </label>
              <textarea
                className="w-full text-sm px-3 py-2 border rounded border-gray-300 focus:outline-none"
                placeholder="Enter reason for dismissal"
                value={dismissComment}
                onChange={e => setDismissComment(e.target.value)}
              />
            </div>
          )}

          {saveError && (
            <div className="mb-4 text-sm text-red-500 font-medium">{saveError}</div>
          )}

          <div className='mt-6'>
            <button
              onClick={handleSaveStatus}
              disabled={updatingStatus}
              className="w-full bg-navy text-white text-sm cursor-pointer px-4 py-2 hover:bg-navy/80 rounded-lg"
            >
              {updatingStatus ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Update'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-100 text-sm text-gray-600 rounded mb-4">
          This complaint is <strong>{complaint.status}</strong>—no further changes allowed.
        </div>
      )}
    </div>
  );
};

export default ChangeStatus;