import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const uploadDir = path.join(__dirname, "..", "uploads");
    const filePath = path.join(__dirname, "..", "uploads", fileName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        reject(err);
      } else {
        resolve(`/uploads/${fileName}`);
      }
    });
  });
};
