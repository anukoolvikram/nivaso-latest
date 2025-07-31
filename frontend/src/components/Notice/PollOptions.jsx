/* eslint-disable react/prop-types */
import { CrossIcon } from '../../assets/icons/CrossIcon';

const PollOptions = ({ options, setOptions }) => {
  return (
    <div>
      <label className="block text-gray-700">
        Poll Options <span className="text-red-400">*</span>
      </label>
      <div className="flex flex-col gap-4">
        {options?.map((opt, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={opt}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[i] = e.target.value;
                setOptions(newOptions);
              }}
              className="w-full p-3 text-gray700 border border-gray100 rounded-lg focus:ring-0 focus:outline-none"
              placeholder={`Option ${i + 1}`}
              required
            />
            <div className="relative inline-block group">
              <button
                type="button"
                className="p-1 hover:cursor-pointer"
                onClick={() => {
                  const newOptions = [...options];
                  newOptions.splice(i, 1);
                  setOptions(newOptions);
                }}
              >
                <CrossIcon />
              </button>
              <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap text-xs rounded bg-gray-800 text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Remove option
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={() => setOptions([...(options || []), ''])}
          className="bg-navy text-white p-1 px-2 rounded-md hover:cursor-pointer"
        >
          + Add Option
        </button>
      </div>
    </div>
  );
};

export default PollOptions;