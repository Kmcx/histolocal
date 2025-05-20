const express = require("express");
const router = express.Router();
const { getSignedUpload } = require("../controllers/cloudinaryController");

// GET /api/cloudinary/sign-upload
router.get("/sign-upload", getSignedUpload);

module.exports = router;
