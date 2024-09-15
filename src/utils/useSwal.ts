import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

export function useSwal() {
  const success = (title: string, text: string) => {
    Swal.fire({
      title: title,
      text: text,
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const error = (title: string, text: string) => {
    Swal.fire({
      title: title,
      text: text,
      icon: "error",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return {
    success,
    error,
  };
}
