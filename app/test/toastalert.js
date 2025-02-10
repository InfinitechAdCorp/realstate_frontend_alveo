// toast.js

import { showToast } from "@/components/alert/page";

export const handleShowSuccessToast = (message) => {
  showToast(message, "success");
};

export const handleShowErrorToast = (message) => {
  showToast(message, "error");
};

export const handleShowWarningToast = (message) => {
  showToast(message, "warning");
};
