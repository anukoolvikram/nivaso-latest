/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { PlusIcon } from "../../assets/icons/PlusIcon";
import { EyeIcon } from "../../assets/icons/EyeIcon";
import { EditIcon } from "../../assets/icons/EditIcon";
import { LeftArrow, RightArrow } from "../../assets/icons/ArrowIcons";
import Loading from '../Loading/Loading'

const SocietyList = ({
  isLoadingSocieties,
  societies,
  visibleSocieties,
  searchTerm,
  setSearchTerm,
  page,
  setPage, 
  pageCount,
  start,
  end,
  handleAddClick,
  onEditClick,
  onViewClick
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
            placeholder="Search by Society Code / Name / Type..."
            className="w-2/3 border border-purplegray p-2 px-4 focus:outline-none focus:ring-0 rounded-lg"
          />
        </div>
        <div onClick={handleAddClick} className="w-1/8 flex justify-center bg-purple text-white rounded-lg border-purplegray hover:cursor-pointer p-2 gap-2 items-center">
          <PlusIcon />
          <div>Add Society</div>
        </div>
      </div>

      {isLoadingSocieties ? (<Loading />)
        : societies.length > 0 ? (
          <div className="p-4">
            <div className="bg-my-gray p-4 rounded-t-lg flex justify-between">
              <div className="text-purple font-bold">Society Database</div>
              <div className="text-dark-gray text-sm font-medium">Total: {societies.length} Societies</div>
            </div>

            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-xs bg-[#F9FAFB] text-gray900 font-bold border border-purplegray">
                  <th className="p-2 text-center">S. No.</th>
                  <th className="p-2 text-center">Society Code</th>
                  <th className="p-2 text-center">Society Name</th>
                  <th className="p-2 text-center">Society Type</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-inter text-gray700">
                {visibleSocieties?.map((society, index) => (
                  <tr
                    key={society.society_code}
                    className="border border-gray-200"
                  >
                    <td className="p-2 text-center">
                      {start + index + 1}
                    </td>
                    <td className="p-2 text-center">
                      {society.society_code}
                    </td>
                    <td className="p-2 text-center">
                      {society.name}
                    </td>
                    <td className="p-2 text-center">
                      <span
                        className={`
                          inline-block px-2 py-1 rounded-full
                          ${society.society_type === 'Apartment'
                            ? 'text-[#1E40AF] bg-[#DBEAFE]'
                            : 'text-[#6B21A8] bg-[#F3E8FF]'
                          }
                        `}
                      >
                        {society.society_type}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="hover:cursor-pointer"
                          onClick={() => onViewClick(society)}
                        >
                          <EyeIcon />
                        </button>
                        <button
                          className="hover:cursor-pointer"
                          onClick={() => onEditClick(society)}
                        >
                          <EditIcon />
                        </button>
                      </div>
                    </td>
                  </tr>

                ))}
              </tbody>
            </table>

            <div className="flex justify-between bg-gray200 text-sm font-medium text-dark-gray p-4 rounded-b-lg">
              <div>Showing {start + 1} - {start + 10 > societies.length ? societies.length : start + 10} of {societies.length} societies</div>

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
                    className={`px-2 py-1 text-xs rounded-lg border border-purplegray hover:cursor-pointer ${page === i
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
          <p className="text-gray-600 mt-4">No societies found.</p>
        )}
    </div>
  );
};

export default SocietyList;