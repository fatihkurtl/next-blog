import fs from "fs";
import path from "path";
import { uploadDir } from "./upload-file";

export const deleteOldImage = (imageUrl: string | null): Promise<void> => {
    return new Promise((resolve) => {
      if (!imageUrl) {
        resolve();
        return;
      }
  
      const fileName = path.basename(imageUrl);
      const filePath = path.join(uploadDir, fileName);
  
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
          resolve();
        } else {
          console.log("Old image deleted successfully");
          resolve();
        }
      });
    });
  };