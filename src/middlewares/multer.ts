import multer from "multer"
import {v4 as uuid} from "uuid"
// Multer configuration

const storage = multer.diskStorage({
destination(req, file, callback) {
    callback(null, "uploads");
},

filename(req, file, callback) {

    const id = uuid()
    const extNmae = file.originalname.split(".").pop()
 
    callback(null, `${id}.${extNmae}`);
},


});

export const singleUpload = multer({storage}).single("photo")