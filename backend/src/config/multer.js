const multer = require("multer");
const storage = multer.memoryStorage(); // Dosyayı bellekte tut

const upload = multer({ storage });
module.exports = upload;
