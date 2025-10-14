/* eslint-disable react/prop-types */
const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="my-4 text-sm text-red-600">
      {message}
    </div>
  );
};

export default ErrorMessage;
