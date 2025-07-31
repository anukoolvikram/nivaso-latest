/* eslint-disable react/prop-types */
const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-4 text-sm text-red-700 bg-red-100 px-4 py-2 rounded border border-red-300">
      {message}
    </div>
  );
};

export default ErrorMessage;
