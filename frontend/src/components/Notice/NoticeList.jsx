// /* eslint-disable react/prop-types */
// import { EmptyNoticeIcon } from '../../assets/icons/EmptyNoticeIcon';
// import { PlusIcon } from '../../assets/icons/PlusIcon';
// import NoticeCard from './NoticeCard';
// import Loading from '../Loading/Loading'

// const NoticeList = ({
//   notices,
//   loading,
//   activeTab,
//   tabs,
//   onTabChange,
//   onNoticeClick,
//   onCreateNotice,
//   viewingNoticeId,
//   handleEdit,
//   handleDelete,
//   userRole
// }) => {

//   if(loading){
//     return <Loading/>
//   }

//   return (
//     <>
//       <div className="flex items-center justify-between font-medium font-inter">
//         <div className="flex p-1 rounded-lg bg-gray-100">
//           {Object.entries(tabs).map(([key, label]) => (
//             <button
//               key={key}
//               onClick={() => onTabChange(key)}
//               className={`px-4 py-2 rounded-lg transition ${
//                 activeTab === key
//                   ? 'bg-white text-navy shadow-sm'
//                   : 'text-navy/70 hover:text-navy'
//               }`}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={onCreateNotice}
//           className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg shadow hover:bg-navy/80 transition"
//         >
//           <PlusIcon />
//           Create Notice
//         </button>
//       </div>

//       {/* Notice List */}
//       <div className="space-y-4">
//         {notices.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-[60vh] text-center">
//             <EmptyNoticeIcon className="w-24 h-24 text-gray-300" />
//             <h3 className="mt-4 text-lg font-medium text-gray-700">No notices found</h3>
//             <p className="mt-1 text-gray-500">
//               {activeTab === 'all'
//                 ? "There are no approved notices in your society yet."
//                 : "You haven't created any notices yet."}
//             </p>
//             {activeTab === 'mine' && (
//               <button
//                 onClick={onCreateNotice}
//                 className="mt-6 flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg shadow hover:bg-navy/80 transition"
//               >
//                 <PlusIcon />
//                 Create your first notice
//               </button>
//             )}
//           </div>
//         ) : (
//           notices.map(notice => (
//             <NoticeCard
//               key={notice.id}
//               notice={notice}
//               isSelected={viewingNoticeId === notice.id}
//               onClick={() => onNoticeClick(notice)}
//               showActions={notice.author_type!='federation'}
//               onEdit={() => handleEdit(notice)}
//               onDelete={() => handleDelete(notice)}
//               userRole={userRole}
//             />
//           ))
//         )}
//       </div>
//     </>
//   );
// };

// export default NoticeList;

/* eslint-disable react/prop-types */
import { EmptyNoticeIcon } from '../../assets/icons/EmptyNoticeIcon';
import { PlusIcon } from '../../assets/icons/PlusIcon';
import NoticeCard from './NoticeCard';
import Loading from '../Loading/Loading';

const NoticeList = ({ notices, loading, activeTab, tabs, onTabChange, onNoticeClick, onCreateNotice, viewingNoticeId, handleEdit, handleDelete, userRole }) => {
  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Responsive Tabs - matches Resident Blogs tab design */}
        <div className="flex w-full sm:w-auto p-1 rounded-lg bg-gray-100">
          {Object.entries(tabs).map(([key, label]) => (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg ${
                activeTab === key ? 'bg-white shadow-sm' : ''
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Create Button */}
        <button
          onClick={onCreateNotice}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-xl shadow-lg shadow-navy/20 hover:bg-navy/90 transition-transform active:scale-95"
        >
          <PlusIcon />
          <span className="font-bold">Create Notice</span>
        </button>
      </div>

      {/* Notice Cards */}
      <div className="grid grid-cols-1 gap-4">
        {notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
            <EmptyNoticeIcon className="w-20 h-20 text-gray-300" />
            <h3 className="mt-4 text-lg font-bold text-gray-700">No notices found</h3>
            <p className="text-gray-500 text-sm px-4">There are no notices to display in this category.</p>
          </div>
        ) : (
          notices.map(notice => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              isSelected={viewingNoticeId === notice.id}
              onClick={() => onNoticeClick(notice)}
              showActions={notice.author_type !== 'federation'}
              onEdit={() => handleEdit(notice)}
              onDelete={() => handleDelete(notice.id)}
              userRole={userRole}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NoticeList;