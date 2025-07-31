/* eslint-disable react/prop-types */
import CircularProgress from "@mui/material/CircularProgress";

const SubmitButton = ({ loading, label }) => {
  return (
    <button
      type="submit"
      className="w-1/2 flex justify-center bg-navy m-2 text-white py-2 rounded-lg hover:bg-navy/80 transition mx-auto"
      disabled={loading}
    >
      {loading ? <CircularProgress size={20} style={{ color: "white" }} /> : label}
    </button>
  );
};

export default SubmitButton;
