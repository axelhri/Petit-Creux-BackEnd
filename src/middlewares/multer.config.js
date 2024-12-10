import multer from "multer";
import DatauriParser from "datauri/parser.js";
import path from "path";

const storage = multer.memoryStorage();
const multerUploads = multer({ storage });
const parser = new DatauriParser();
const dataUri = (req) =>
  parser.format(path.extname(req.originalname).toString(), req.buffer);
export { multerUploads, dataUri };
