/* eslint-disable react/prop-types */
import CircularProgress from '@mui/material/CircularProgress';
import { UserIcon, DocumentTextIcon, TrashIcon, DocumentArrowUpIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { LeftArrow } from '../../assets/icons/ArrowIcons';

const FlatDetailView = ({
  viewingFlat,
  documents,
  uploadTitle,
  uploadFile,
  showUploadForm,
  uploadLoading,
  setViewingFlat,
  setUploadTitle,
  setUploadFile,
  setShowUploadForm,
  handleUpload,
  setDocToDelete,
  setShowDeleteDialog,
  onCancelUpload,
}) => {
  const ownerData = viewingFlat.owner ? {
    Name: viewingFlat.owner.name,
    Email: viewingFlat.owner.email,
    Phone: viewingFlat.owner.phone,
    Address: viewingFlat.owner.address,
    'Initial Password': viewingFlat.owner.initial_password,
  } : null;

  const residentData = (viewingFlat.occupancy_status === "Rented" && viewingFlat.resident) ? {
    Name: viewingFlat.resident.name,
    Email: viewingFlat.resident.email,
    Phone: viewingFlat.resident.phone,
    Address: viewingFlat.resident.address,
  } : null;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Flat Details</h1>
          <p className="text-slate-500">Details for Flat <span className="font-semibold text-slate-700">{viewingFlat.flat_number}</span></p>
        </div>
        <button
          onClick={() => setViewingFlat(null)}
          className="flex items-center gap-2 text-lg font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <LeftArrow/>
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
         <div className="bg-white rounded-lg border border-slate-200 p-4">
             <p className="text-sm">
                <span className="font-medium text-slate-500">Occupancy Status: </span>
                <span className="font-semibold text-slate-800">{viewingFlat.occupancy_status || 'Vacant'}</span>
            </p>
         </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoSection title="Owner Information" data={ownerData} icon={UserIcon} />
          {residentData && <InfoSection title="Resident Information" data={residentData} icon={UserIcon} />}
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <DocumentTextIcon className="h-6 w-6 text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-800">Documents</h3>
          </div>
          {documents.length > 0 ? (
            <ul className="divide-y divide-slate-200">
              {documents.map(doc => (
                <DocumentItem key={doc.id} doc={doc} onDeleteClick={() => {
                  setDocToDelete(doc.id);
                  setShowDeleteDialog(true);
                }} />
              ))}
            </ul>
          ) : (
            !showUploadForm && <p className="text-sm text-slate-500 text-center py-4">No documents have been uploaded yet.</p>
          )}

          {/* Upload Form Area */}
          <div className="">
            {showUploadForm ? (
              <form onSubmit={handleUpload} className="p-4 bg-slate-50/80 border border-dashed rounded-lg space-y-4">
                <h4 className="font-semibold text-slate-700">Upload New Document</h4>
                <input
                  type="text"
                  placeholder="Document Title (e.g., Rent Agreement)"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="block p-2 w-full text-sm rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  required
                />
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={uploadLoading}
                  >
                    {uploadLoading ? <CircularProgress size={20} color="inherit" /> : 'Submit Document'}
                  </button>
                  <button type="button" 
                  onClick={() => {
                    setShowUploadForm(false);
                    onCancelUpload();
                    }} 
                    className="text-sm font-medium text-slate-600 hover:underline">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowUploadForm(true)}
                className="flex items-center gap-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md transition-colors"
              >
                <DocumentArrowUpIcon className="h-5 w-5" />
                Upload Document
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlatDetailView;


const InfoSection = ({ title, data, icon: Icon }) => (
  <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
    <div className="flex items-center gap-3 mb-3">
      <Icon className="h-6 w-6 text-slate-500" />
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
    </div>
    {data ? (
      <dl className="space-y-2 text-sm">
        {Object.entries(data).map(([key, value]) =>
          value ? (
            <div key={key} className="grid grid-cols-3 gap-2">
              <dt className="font-medium text-slate-500 capitalize">{key.replace('_', ' ')}</dt>
              <dd className="col-span-2 text-slate-700 font-medium">{value}</dd>
            </div>
          ) : null
        )}
      </dl>
    ) : (
      <p className="text-sm text-slate-500">No information available.</p>
    )}
  </div>
);

const DocumentItem = ({ doc, onDeleteClick }) => (
  <li className="flex items-center justify-between py-2 transition-colors hover:bg-slate-50 -mx-3 px-3 rounded-md">
    <a
      href={doc.file_path}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 text-sm font-medium text-indigo-600 hover:underline truncate"
    >
      <PaperClipIcon className="h-5 w-5 flex-shrink-0" />
      <span className="truncate">{doc.original_name}</span>
    </a>
    <button
      onClick={() => onDeleteClick(doc.id)}
      className="p-1 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors"
      aria-label="Delete document"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  </li>
);


