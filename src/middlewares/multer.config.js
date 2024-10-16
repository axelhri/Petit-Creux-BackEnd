import multer from "multer";
import DatauriParser from "datauri/parser.js";
import path from "path";

// Configurer Multer pour stocker le fichier dans la mémoire
const storage = multer.memoryStorage();
const multerUploads = multer({ storage });

// Configurer DataURI
const parser = new DatauriParser();
const dataUri = (req) =>
  parser.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer
  ); // Correction ici

export { multerUploads, dataUri };
