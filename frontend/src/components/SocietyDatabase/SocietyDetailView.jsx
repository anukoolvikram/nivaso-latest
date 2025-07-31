import PropTypes from 'prop-types';
import { LeftArrow } from '../../assets/icons/ArrowIcons';

const SocietyDetail = ({ society, onBack }) => {
  console.log(society)
  if (!society) return null;

  const detailFields = [
    { label: 'Society Code', value: society.society_code },
    { label: 'Name', value: society.name },
    { label: 'Type', value: society.society_type },
    { label: 'No of Wings', value: society.wing_count, condition: society.no_of_wings },
    { label: 'Floor per Wing', value: society.floors_per_wing, condition: society.floor_per_wing },
    { label: 'Rooms per Floor', value: society.rooms_per_floor, condition: society.rooms_per_floor },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={onBack}
        className="mb-6 text-navy/80 hover:text-navy-dark transition-colors duration-200 flex items-center gap-2 group"
        aria-label="Go back"
      >
        <LeftArrow className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="font-semibold">Back</span>
      </button>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Society Information</h2>
        <p className="text-gray-500">Detailed overview of the society properties</p>
      </div>

      <div className="bg-white p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-lg shadow border border-purplegray">
        {detailFields.map((field, index) => (
          field.condition !== false && (
            <div key={index} className="bg-purplegray/80 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                {field.label}
              </p>
              <p className="text-gray-900 font-medium">
                {field.value || <span className="text-gray-400">—</span>}
              </p>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

SocietyDetail.propTypes = {
  society: PropTypes.shape({
    society_code: PropTypes.string,
    name: PropTypes.string,
    society_type: PropTypes.string,
    no_of_wings: PropTypes.number,
    floor_per_wing: PropTypes.number,
    rooms_per_floor: PropTypes.number,
  }),
  onBack: PropTypes.func.isRequired,
};

export default SocietyDetail;