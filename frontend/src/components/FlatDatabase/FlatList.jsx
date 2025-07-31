/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { PlusIcon } from "../../assets/icons/PlusIcon";
import { EyeIcon } from "../../assets/icons/EyeIcon";
import { EditIcon } from "../../assets/icons/EditIcon";
import { LeftArrow, RightArrow } from "../../assets/icons/ArrowIcons";
import Loading from "../Loading/Loading";

const FlatList = ({
  isLoadingFlats,
  flats,
  visibleFlats,
  searchTerm,
  setSearchTerm,
  page,
  setPage,
  pageCount,
  start,
  end,
  handleAddNew,
  handleEdit,
  setViewingFlat
}) => {
  return (
    <div>
      <div className="flex justify-between items-center px-4 pt-4 text-sm">
        <div className="w-2/3 flex items-center gap-4">
          <input 
            type="text" 
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setPage(0);                
            }}
            placeholder="Search by Flat No. / Name / Contact..."
            className="w-2/3 border border-purplegray p-2 focus:outline-none focus:ring-0 rounded-lg" 
          />
        </div>
        <div onClick={handleAddNew} className="w-1/8 flex justify-center bg-purple text-white rounded-lg border-purplegray hover:opacity-80 cursor-pointer p-2 gap-2 items-center">
          <PlusIcon/>
          <div>Add Flat</div>
        </div>
      </div>

      {isLoadingFlats ? ( <Loading />) 
      : flats.length > 0 ? (
        <div className="p-4">
          <div className="bg-my-gray p-4 rounded-t-lg flex justify-between">
            <div className="text-purple font-bold">Flat Records</div>
            <div className="text-dark-gray text-sm font-medium">Total: {flats.length} Flats</div>
          </div>
          
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-xs bg-[#F9FAFB] text-gray900 font-bold border border-purplegray">
                <th className="p-2 text-center">Flat No.</th>
                <th className="p-2 text-center">Owner Name</th>
                <th className="p-2 text-center">Resident Name</th>
                <th className="p-2 text-center">Mobile</th>
                <th className="p-2 text-center">Status</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-inter text-gray700">
              {visibleFlats.map((flat) => (
                <tr key={flat.id} className="border border-purplegray">
                  <td className="p-2 text-center">{flat.flat_number}</td>
                  <td className="p-2 text-center">{flat.owner?.name || '-'}</td>
                  <td className="p-2 text-center">
                    {flat.occupancy_status === "Occupied"
                      ? flat.owner?.name || "-"
                      : flat.occupancy_status === "Rented"
                      ? flat.resident?.name || "-"
                      : "-"}
                  </td>
                  <td className="p-2 text-center">
                    {flat.occupancy_status === "Occupied"
                      ? flat.owner?.phone || "-"
                      : flat.occupancy_status === "Rented"
                      ? flat.resident?.phone || "-"
                      : "-"}
                  </td>
                  <td className="p-2 text-center">
                    {flat.occupancy_status === "Occupied" ? 
                      <span className="bg-[#DCFCE7] text-[#166534] rounded-xl p-1 px-2">Occupied</span> :
                      flat.occupancy_status === "Rented" ? 
                      <span className="bg-[#DBEAFE] text-[#1E40AF] rounded-xl p-1 px-2">Rented</span> :
                      <span className="bg-[#F3F4F6] text-[#1F2937] rounded-xl p-1 px-2">Vacant</span>
                    }
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2 justify-center">
                      <button className="hover:cursor-pointer" onClick={() => setViewingFlat(flat)}>
                        <EyeIcon/>
                      </button>
                      <button className="hover:cursor-pointer" onClick={() => handleEdit(flat)}>
                        <EditIcon/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex justify-between bg-gray200 text-sm font-medium text-dark-gray p-4 rounded-b-lg">
            <div>Showing {start+1} - {start+10 > flats.length ? flats.length : start+10} of {flats.length} flats</div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 0))}
                disabled={page === 0}
                className="flex items-center bg-white border border-gray-100 rounded-lg px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LeftArrow />
                <span className="ml-1">Previous</span>
              </button>

              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`px-2 py-1 text-xs rounded-lg border border-purplegray hover:cursor-pointer ${
                    page === i
                      ? 'bg-purple text-white'
                      : 'bg-white border border-gray100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(p + 1, pageCount - 1))}
                disabled={page === pageCount - 1}
                className="flex items-center bg-white border border-gray-100 rounded-lg px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="mr-1">Next</span>
                <RightArrow />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 mt-4">No flats found for this society.</p>
      )}
    </div>
  );
};

export default FlatList;