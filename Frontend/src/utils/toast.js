// src/utils/toast.js
import { toast } from "react-toastify";

export const notifySuccess = (msg) => {
  toast.success(msg, {
    position: "top-right",
    theme: "light",
  });
};

export const notifyError = (msg) => {
  toast.error(msg, {
    position: "top-right",
    theme: "light",
  });
};

export const notifyInfo = (msg) => {
  toast.info(msg, {
    position: "top-right",
    theme: "light",
  });
};
