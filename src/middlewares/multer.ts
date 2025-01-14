import multer from "multer"
import {v4 as uuid} from "uuid"
// Multer configuration

const storage = multer.diskStorage({
destination(req, file, callback) {
    callback(null, "./public/temp");
},

filename(req, file, callback) {

    // const id = uuid()
    // const extNmae = file.originalname.split(".").pop()
 
    callback(null, file.originalname);
},


});

export const singleUpload = multer({storage}).single("photo");
export const multipleUpload = multer({ storage }).array("photos", 10);