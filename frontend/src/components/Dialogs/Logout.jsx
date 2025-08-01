/* eslint-disable react/prop-types */
import { Fragment } from 'react';

const LogoutConfirmationDialog = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <Fragment>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity" aria-hidden="true"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900">
                            Confirm Logout
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to log out?
                        </p>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onConfirm}
                        >
                            Logout
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default LogoutConfirmationDialog;