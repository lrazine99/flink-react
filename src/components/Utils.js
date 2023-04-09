import { toast } from "react-toastify";

export const errorToast = (message = "Une erreur est survenue") => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const cartTotal = (counters) => {
  const total = Object.values(counters).reduce((accumulator, currentItem) => {
    return accumulator + currentItem.count * currentItem.price.amount;
  }, 0);

  return total;
};

export const formatNumberEur = (num) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(num);
};
