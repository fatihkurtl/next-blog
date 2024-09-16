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

  const question = (title: string, text: string): Promise<boolean> => {
    return new Promise((resolve) => {
      Swal.fire({
        title: title,
        text: text,
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
      }).then((result) => {
        resolve(result.isConfirmed);
      });
    });
  };

  return {
    success,
    error,
    question,
  };
}
