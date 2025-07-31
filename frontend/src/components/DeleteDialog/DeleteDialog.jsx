// components/DeleteDialog.jsx
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';

const DeleteDialog = forwardRef(({
  isOpen,
  onCancel,
  onConfirm,
  isLoading = false,
}, ref) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50`}>
      <div ref={ref} className='bg-white rounded-md p-6 shadow-xl w-full max-w-sm'>
        <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
        <p className="text-gray-600 mt-2">Are you sure you want to delete this item?</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading
              ? <CircularProgress size={20} color="inherit" />
              : 'Delete'
            }
          </button>
        </div>
      </div>
    </div>
  );
});

DeleteDialog.displayName = 'DeleteDialog';

DeleteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  overlayClassName: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default DeleteDialog;
