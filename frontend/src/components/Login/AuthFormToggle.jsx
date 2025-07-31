/* eslint-disable react/prop-types */
const AuthFormToggle = ({ isRegistered, loading, toggleForm }) => {
  return (
    <div className="text-center mt-4">
      <button
        type="button"
        onClick={toggleForm}
        className="text-blue-600 hover:underline text-sm"
        disabled={loading}
      >
        {isRegistered
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default AuthFormToggle;
