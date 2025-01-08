"use client"
import { showSuccessAlert, showErrorAlert, showToast, showCustomAlert } from '../../../components/alert/page';

const MyComponent = () => {

  const handleShowToast = () => {
    showToast('This is a success message!', 'success');
  };
  const handleToastError = () => {
    showToast('An error occurred while processing!', 'error'); // Error toast
  };
  const handleToastWarning = () => {
    showToast('An error occurred while processing!', 'warning'); // Error toast
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <button
        onClick={handleShowToast}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all mt-4"
      >
        Show Success Toast
      </button>
      <button
        onClick={handleToastError}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all mt-4"
      >
        Show Error Toast
      </button>
      <button
        onClick={handleToastWarning}
        className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-all mt-4"
      >
        Show Custom Alert
      </button>
    </div>
  );
};

export default MyComponent;
