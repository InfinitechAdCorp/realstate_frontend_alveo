// utils/alerts.js
import Swal from "sweetalert2";

export const showSuccessAlert = (message) => {
  Swal.fire({
    title: "Success!",
    text: message || "Your action was successful.",
    icon: "success",
    confirmButtonText: "OK",
  });
};

export const showErrorAlert = (message) => {
  Swal.fire({
    title: "Error!",
    text: message || "Something went wrong!",
    icon: "error",
    confirmButtonText: "OK",
  });
};

export const showInfoAlert = (message) => {
  Swal.fire({
    title: "Information",
    text: message || "Here is some information.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

export const showToast = (message, icon = "success") => {
  const iconColors = {
    success: "bg-green-500", // Green for success
    error: "bg-red-500", // Red for error
    warning: "bg-yellow-500", // Yellow for warning
    info: "bg-blue-500", // Blue for info
    question: "bg-gray-500", // Gray for question
  };

  Swal.fire({
    toast: true,
    position: "top-end", // Position the toast in the top-right corner
    icon: icon, // Can be 'success', 'error', 'info', etc.
    title: message, // Message to display in the toast
    showConfirmButton: false, // Hide the confirm button
    timer: 3000, // Toast will disappear after 3 seconds
    timerProgressBar: true, // Show the progress bar
    customClass: {
      popup: `${iconColors[icon]} text-white`, // Tailwind custom background color for toast based on icon
      title: "font-bold", // Bold font for the title
      container: "sm:top-5 sm:right-5", // Tailwind for positioning on smaller screens
    },
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer); // Stop timer on hover
      toast.addEventListener("mouseleave", Swal.resumeTimer); // Resume timer when hover ends
    },
  });
};

export const showCustomAlert = (title, text, onConfirm) => {
  Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, confirm!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed && onConfirm) {
      onConfirm();
    }
  });
};
